import { auth } from "@clerk/nextjs";

import OpenAI from "openai";

// api liimt imports 
import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request){
    try {
        const {userId} = auth(); 
        const body = await req.json(); 
        const {prompt, amount=1, resolution=512} = body; 

        if(!userId) {
            return new Response("Unauthorized", {status: 401});
        }

        if(!openai.apiKey) {
            return new Response("OpenAIApi key not configured", {status: 500});
        }

        if(!prompt){
            return new Response("Prompt not provided", {status: 400});
        
        }

        if(!amount){
            return new Response("Amount not provided", {status: 400});
        
        }

        if(!resolution){
            return new Response("Resolution not provided", {status: 400});
        
        }

        const freeTrial = await checkApiLimit();
        if(!freeTrial){
            return new Response(JSON.stringify("Api limit exceeded"), {status: 403});
        }

        const response = await openai.images.generate({
            model: "dall-e-2",
            prompt, 
            n: parseInt(amount, 10),
            size: resolution,
        })

        await increaseApiLimit();

        return new Response(JSON.stringify(response.data), {status: 200});

    } catch (error) {
        console.log("[IMAGE ERROR]", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}