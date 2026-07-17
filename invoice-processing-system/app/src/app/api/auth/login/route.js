import { NextResponse } from "next/server";

import { login } from "@/services/auth.service";

import { loginSchema } from "@/validations/auth.validation";



export async function POST(request) {
    
    try {

        const body = await request.json();

        const validateData = loginSchema.parse(body)

        const result = await login(validateData)

        return NextResponse.json(
            {
                success: true,
                message : "User loginned Successfully",
                token : result.token,
                user : result.user
            }
        )
        
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message : error.message,
            },
            {
                status: 401
            }
        )
    }

}