import jwt from "jsonwebtoken"

export async function verifyToken(request){

    try {

        const authHeader = request.headers.get("authorization")

        if(!authHeader){
            throw new Error("Authorization header missing")
        }

        const token = authHeader.split(" ")[1]

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        )

        return decoded;
        
    } catch {
        throw new Error("Invalid Token")
    }

}