import {prisma} from "@/lib/prisma";

export async function createUser(userData) {

    return await prisma.user.create({
        data: userData,
    })
}


export async function findUserByEmail(email){

    return await prisma.user.findUnique({
        where: {
            email
        }
    })
} 