import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { db } from "@/db";
import { images } from "@/db/schema";
import { uploadToR2 } from "@/lib/r2";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const uploadPromises = files.map(async (file) => {
      // Generate unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${nanoid()}.${fileExt}`;
      const path = `products/${fileName}`;

      // Upload to R2
      const { url, filename } = await uploadToR2(file, path);

      // Save to database
      const [image] = await db
        .insert(images)
        .values({
          url,
          filename,
        })
        .returning();

      return image;
    });

    const uploadedImages = await Promise.all(uploadPromises);

    return NextResponse.json({
      success: true,
      images: uploadedImages,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload images" },
      { status: 500 }
    );
  }
}
