import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const hasKey = !!process.env.ANTHROPIC_API_KEY;
  const keyPrefix = process.env.ANTHROPIC_API_KEY
    ? process.env.ANTHROPIC_API_KEY.substring(0, 7) + "..."
    : "NOT SET";

  // Check for common typos / variations
  const envKeysWithAnth = Object.keys(process.env).filter(
    (k) => k.toLowerCase().includes("anth") || k.toLowerCase().includes("api_key")
  );

  return NextResponse.json({
    hasKey,
    keyPrefix,
    nodeEnv: process.env.NODE_ENV,
    matchingEnvKeys: envKeysWithAnth,
    totalEnvKeys: Object.keys(process.env).length,
  });
}
