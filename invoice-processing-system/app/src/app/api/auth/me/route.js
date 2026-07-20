
import { NextResponse } from "next/server";

import { verifyToken } from "@/middleware/auth.middleware";
import { getCurrentUser } from "@/services/auth.service";

export async function GET(request) {
  try {
    const decoded = await verifyToken(request);

    const user = await getCurrentUser(decoded.id);

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 401,
      }
    );
  }
}   