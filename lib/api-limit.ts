import { auth } from "@clerk/nextjs";
import {PrismaClient} from '@prisma/client'
import { MAX_FREE_COUNTS } from "@/constants";

const prisma = new PrismaClient();

// making an api call to increase the api limit 
export const increaseApiLimit = async () => {
    const {userId} = auth();

    if(!userId) {
        return; 
    }

    // accessing the database to get the user's api limit
    const userApiLimit = await prisma.userApiLimit.findUnique({
        where: {
            userId: userId
        }
    });

    // check wether user exists or create a new user. 

    if(userApiLimit){
        await prisma.userApiLimit.update({
            where: {
                userId: userId
            },
            data: {
                count: userApiLimit.count + 1
            }
        });
    } else {
        await prisma.userApiLimit.create({
            data: {
                userId: userId,
                count: 1
            }
        });
    }
}

// check if user reached free limit usage 
export const checkApiLimit = async () => {
    const {userId} = auth();
    if(!userId){
        return false;
    }

    const userApiLimit = await prisma.userApiLimit.findUnique({
        where: {
            userId: userId
        }
    });

    if(!userApiLimit || userApiLimit.count < MAX_FREE_COUNTS){
        return true;
    }
    else {
        return false;
    }
};

export const getApiLimitCount = async () => {
    const {userId} = auth();
    if(!userId){
        return 0;
    }

    const userApiLimit = await prisma.userApiLimit.findUnique({
        where: {
            userId: userId
        }
    });

    if(!userApiLimit){
        return 0;
    }

    return userApiLimit?.count || 0;
}