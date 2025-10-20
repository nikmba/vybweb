import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ ok: true, message: "Use POST with { verdict, score }" });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { verdict, score } = body ?? {};

    if (!["PASS", "FAIL"].includes(verdict) || typeof score !== "number") {
      return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
    }

    return NextResponse.json({ ok: true, received: { verdict, score } }, { status: 200 });
  } catch {
    return NextResponse.json({ ok: false, error: "Bad JSON" }, { status: 400 });
  }
}
