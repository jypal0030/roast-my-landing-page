import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ message: "Feedback requires database — coming soon with Turso DB" }, { status: 503 });
}
