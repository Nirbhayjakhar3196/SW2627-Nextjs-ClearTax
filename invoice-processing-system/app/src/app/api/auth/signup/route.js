import { NextResponse } from "next/server";

import { signupSchema } from "@/validations/auth.validation";
import { signup } from "@/services/auth.service";

export async function POST(request) {
    
    try {
        const body = await request.json();

        const validateData = await signupSchema.parse(body)

        const user = await signup(validateData)

        return NextResponse.json(
            {
                success: true,
                message : "User registered Successfully",
                user:{
                    id : user.id,
                    name : user.name,
                    email : user.email,
                    role : user.role,
                    createdAt: user.createdAt
                }
            },
            {status : 201}
        )
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message : error.message
            },
            {status : 400}
        )
    }

}