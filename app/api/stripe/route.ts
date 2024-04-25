import { auth, currentUser } from "@clerk/nextjs";
import { PrismaClient } from "@prisma/client";

import { stripe } from "@/lib/stripe";
import { absolutePath } from "@/lib/utils";

const settingsUrl = absolutePath("/settings");
const prisma = new PrismaClient();

export async function GET(req: Request, res: Response) {
  try {
    const { userId } = auth();
    const user = await currentUser();
    if (!user || !userId) {
      return new Response(JSON.stringify("Unauthorized"), { status: 401 });
    }
    const userSubscription = await prisma.userSubscription.findUnique({
      where: {
        userId,
      },
    });

    // creating billing portal if user subscription exists
    if (userSubscription && userSubscription.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: userSubscription.stripeCustomerId,
        return_url: settingsUrl,
      });

      return new Response(JSON.stringify({ url: stripeSession.url }), {
        status: 200,
      });
    }

    // creating a checkout page if user subscription does not exist
    const stripeSession = await stripe.checkout.sessions.create({
      success_url: settingsUrl,
      cancel_url: settingsUrl,
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      customer_email: user.emailAddresses[0].emailAddress,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Genius Pro",
              description: "Unlimited A.I generations",
            },
            unit_amount: 2000,
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],

      // very important to catch userId and put in db to know who subscribed
      metadata: {
        userId,
      },
    });
    return new Response(JSON.stringify({ url: stripeSession.url }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify("Stripe error"), { status: 500 });
  }
}
