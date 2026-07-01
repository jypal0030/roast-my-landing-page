import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Roasts list requires database — coming soon with Turso DB" }, { status: 503 });
}
