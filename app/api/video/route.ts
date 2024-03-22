import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
})

export async function POST(req: Request){
    try {
        const {userId} = auth(); 
        const body = await req.json(); 
        const {prompt} = body; 

        if(!userId) {
            return new Response("Unauthorized", {status: 401});
        }

        if(!prompt){
            return new Response("Prompt not provided", {status: 400});
        
        }

        const input = {
            prompt_b: prompt,
        };

        const response = await replicate.run("anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351", { input });

        return NextResponse.json(response);

    } catch (error) {
        console.log("[VIDEO ERROR]", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}