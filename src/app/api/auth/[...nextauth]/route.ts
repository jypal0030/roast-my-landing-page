import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Auth requires database — coming soon with Turso DB" }, { status: 503 });
}
export async function POST() {
  return NextResponse.json({ message: "Auth requires database — coming soon with Turso DB" }, { status: 503 });
}
