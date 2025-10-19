import { NextResponse } from "next/server";
import { db } from "@/db";
import { images } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const allImages = await db
      .select()
      .from(images)
      .orderBy(desc(images.createdAt));

    return NextResponse.json({ images: allImages });
  } catch (error) {
    console.error("Failed to fetch images:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}
