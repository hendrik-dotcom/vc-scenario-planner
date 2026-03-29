import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const hasKey = !!apiKey;
  const keyPrefix = apiKey ? apiKey.substring(0, 10) + "..." : "NOT SET";

  // If key exists, test a minimal API call
  let apiTest = "skipped - no key";
  if (apiKey) {
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 10,
          messages: [{ role: "user", content: "Say hi" }],
        }),
      });

      if (response.ok) {
        apiTest = "SUCCESS";
      } else {
        const errorBody = await response.text();
        apiTest = `FAILED ${response.status}: ${errorBody}`;
      }
    } catch (err) {
      apiTest = `ERROR: ${err instanceof Error ? err.message : String(err)}`;
    }
  }

  return NextResponse.json({
    hasKey,
    keyPrefix,
    apiTest,
    nodeEnv: process.env.NODE_ENV,
  });
}
