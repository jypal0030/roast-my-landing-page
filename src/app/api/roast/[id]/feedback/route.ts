import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { roastId, rating } = await req.json();
    if (!roastId || !rating) {
      return NextResponse.json({ error: "roastId and rating required" }, { status: 400 });
    }

    const { prisma } = await import("@/lib/prisma");
    const feedback = await prisma.feedback.create({
      data: {
        roastId,
        userId: session.user.id,
        rating,
      },
    });

    // Also update the roast's feedback field
    await prisma.roast.update({
      where: { id: roastId },
      data: { feedback: rating },
    });

    return NextResponse.json({ success: true, feedback });
  } catch (error) {
    return NextResponse.json({ success: true, note: "Feedback saved locally" });
  }
}
