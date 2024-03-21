import { auth } from "@clerk/nextjs";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const instructionMessage: OpenAI.ChatCompletionMessageParam = {
  role: "system",
  content:
    "you are a code generator. You must answer only in markdown code snippets. Use code comments for explanations",
};

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { messages } = body;

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (!openai.apiKey) {
      return new Response("OpenAIApi key not configured", { status: 500 });
    }

    if (!messages) {
      return new Response("Messages not provided", { status: 400 });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [instructionMessage, ...messages]
    });

    return new Response(JSON.stringify(response.choices[0].message), {
      status: 200,
    });
  } catch (error) {
    console.log("[CODE ERROR]", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
