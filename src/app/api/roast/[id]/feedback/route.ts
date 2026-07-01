import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { rating } = await req.json();

    if (!["savage_af", "funny", "meh", "boring"].includes(rating)) {
      return NextResponse.json({ error: "Invalid rating" }, { status: 400 });
    }

    const roast = await prisma.roast.findUnique({ where: { id } });
    if (!roast) {
      return NextResponse.json({ error: "Roast not found" }, { status: 404 });
    }

    const updated = await prisma.roast.update({
      where: { id },
      data: {
        feedback: rating,
        feedbacks: {
          create: { rating },
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Feedback error:", error);
    return NextResponse.json({ error: "Failed to save feedback" }, { status: 500 });
  }
}
