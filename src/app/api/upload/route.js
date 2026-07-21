import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import uploadService from "../../../services/upload.service.js";

export async function POST(request) {
  try {
    // 1. Authorization Header Check
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized: Missing token",
        },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    let decoded;

    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "super_secret_key_change_this_in_production"
      );
    } catch (err) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized: Invalid or expired token",
        },
        { status: 401 }
      );
    }

    const userId = decoded?.id || null;

    // 2. Parse incoming multipart/form-data request
    let formData;
    try {
      formData = await request.formData();
    } catch (err) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid form-data payload",
        },
        { status: 400 }
      );
    }

    // 3. Retrieve File Object from formData
    let file = formData.get("file");

    if (!file || !(file instanceof File)) {
      for (const [, value] of formData.entries()) {
        if (value && typeof value === "object" && typeof value.text === "function") {
          file = value;
          break;
        }
      }
    }

    if (!file || typeof file.text !== "function") {
      return NextResponse.json(
        {
          success: false,
          message: "No valid file found in request. Please upload a file.",
        },
        { status: 400 }
      );
    }

    // 4. File Extension & CSV Validation
    const fileName = file.name || "";
    if (!fileName.toLowerCase().endsWith(".csv") && file.type && !file.type.includes("csv")) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid file format. Only CSV files are allowed.",
        },
        { status: 400 }
      );
    }

    // 5. Check Empty File Content
    const content = await file.text();
    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "CSV file is empty",
        },
        { status: 400 }
      );
    }

    // 6. Delegate Processing to Service Layer
    const result = await uploadService.processFileUpload(file, userId);

    if (!result.batch || result.batch.totalRows === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "CSV file contains no valid data rows",
        },
        { status: 400 }
      );
    }

    // 7. Return 201 Created Response
    return NextResponse.json(
      {
        success: true,
        message: "File uploaded and processed successfully!",
        data: result,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("API Upload Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to process file upload.",
      },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized: Missing token",
        },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    try {
      jwt.verify(
        token,
        process.env.JWT_SECRET || "super_secret_key_change_this_in_production"
      );
    } catch (err) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized: Invalid or expired token",
        },
        { status: 401 }
      );
    }

    const uploads = await uploadService.getAllUploads();
    return NextResponse.json({ success: true, data: uploads });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
