import { NextResponse } from "next/server";
import uploadService from "../../../services/upload.service.js";

export async function POST(request) {
  try {
    // 1. Parse incoming multipart/form-data request
    const formData = await request.formData();

    // 2. Retrieve File Object from formData (checks "file" or first File object in entries)
    let file = formData.get("file");

    if (!file || !(file instanceof File)) {
      // Fallback: look for any entry that is a File instance
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
          message: "No valid file found in request. Please send multipart/form-data with a file field named 'file'.",
        },
        { status: 400 }
      );
    }

    // Optional userId from form data if provided
    const userId = formData.get("userId") || null;

    // 3. Delegate File Object processing to Service Layer
    const result = await uploadService.processFileUpload(file, userId);

    // 4. Return success response to Frontend / Client
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

export async function GET() {
  try {
    const uploads = await uploadService.getAllUploads();
    return NextResponse.json({ success: true, data: uploads });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
