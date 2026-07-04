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

    const { referralCode } = await req.json();
    if (!referralCode) {
      return NextResponse.json({ error: "referralCode required" }, { status: 400 });
    }

    const { prisma } = await import("@/lib/prisma");

    // Get the current user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Don't process referral if already referred
    if (user.referredById) {
      return NextResponse.json({ success: true, note: "Already referred" });
    }

    // Find referrer
    const referrer = await prisma.user.findUnique({
      where: { referralCode },
    });

    if (!referrer || referrer.id === user.id) {
      return NextResponse.json({ success: false, note: "Invalid referral code" });
    }

    // Create level 1 referral
    const { processReferral } = await import("@/lib/referral");
    await processReferral(user.id, referralCode);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, note: "Referral already processed or DB unavailable" });
  }
}
