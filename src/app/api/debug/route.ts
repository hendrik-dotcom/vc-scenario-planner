import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const hasKey = !!process.env.ANTHROPIC_API_KEY;
  const keyPrefix = process.env.ANTHROPIC_API_KEY
    ? process.env.ANTHROPIC_API_KEY.substring(0, 7) + "..."
    : "NOT SET";

  return NextResponse.json({
    hasKey,
    keyPrefix,
    nodeEnv: process.env.NODE_ENV,
  });
}
