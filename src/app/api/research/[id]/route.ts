import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY not configured. Add it to your environment variables." },
      { status: 500 }
    );
  }

  const { name, url, revenue, valuation } = await request.json();
  const currentMultiple = (valuation / revenue).toFixed(1);

  const prompt = `You are a venture capital analyst. Analyze the following early-stage company and provide scenario assumptions for a 10-year financial projection model.

Company: ${name}
Website: ${url || "Not provided"}
Latest Annual Revenue: $${(revenue / 1_000_000).toFixed(1)}M
Latest Valuation: $${(valuation / 1_000_000).toFixed(1)}M
Current Revenue Multiple: ${currentMultiple}x

Research and analyze:
1. The company's total addressable market (TAM) and market growth rate
2. Revenue growth trajectory - is current growth sustainable? What are realistic growth scenarios?
3. Competitive landscape - who are the main competitors, what is the company's moat?
4. Comparable company multiples - what do similar public and private companies trade at?

Based on your analysis, provide specific 10-year scenario assumptions. Return your response in this EXACT JSON format and nothing else:

{
  "analysis": {
    "marketSize": "Brief description of TAM and market dynamics (2-3 sentences)",
    "growthTrajectory": "Assessment of growth sustainability and trajectory (2-3 sentences)",
    "competitiveLandscape": "Key competitors and competitive moat assessment (2-3 sentences)",
    "comparableMultiples": "Relevant comparable company multiples and benchmarks (2-3 sentences)"
  },
  "scenarios": {
    "bear": {
      "growthRates": [0.08, 0.07, 0.06, 0.05, 0.05, 0.04, 0.04, 0.03, 0.03, 0.03],
      "exitMultipleFactor": 0.6
    },
    "base": {
      "growthRates": [0.25, 0.22, 0.20, 0.18, 0.16, 0.14, 0.12, 0.11, 0.10, 0.10],
      "exitMultipleFactor": 0.9
    },
    "bull": {
      "growthRates": [0.50, 0.45, 0.40, 0.35, 0.30, 0.28, 0.25, 0.22, 0.20, 0.18],
      "exitMultipleFactor": 1.4
    }
  },
  "summary": "One paragraph executive summary of the analysis and key risks/opportunities"
}

IMPORTANT:
- Growth rates are decimals (0.30 = 30% annual growth)
- exitMultipleFactor is relative to the current revenue multiple (1.0 = flat, 0.7 = 30% compression, 1.5 = 50% expansion)
- Ensure bear < base < bull for growth rates
- The example values above are just a template - provide values specific to this company
- Each growthRates array must have exactly 10 values (one per year)
- Return ONLY the JSON, no markdown formatting or extra text`;

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
        max_tokens: 2048,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Anthropic API error:", error);
      return NextResponse.json(
        { error: "AI research failed. Check your API key and try again." },
        { status: 502 }
      );
    }

    const result = await response.json();
    const content = result.content[0].text;

    // Parse the JSON from Claude's response, handling potential markdown wrapping
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      // Try to extract JSON from markdown code blocks
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[1].trim());
      } else {
        throw new Error("Could not parse AI response as JSON");
      }
    }

    // Validate the response structure
    if (!parsed.scenarios || !parsed.analysis) {
      throw new Error("AI response missing required fields");
    }

    for (const scenario of ["bear", "base", "bull"]) {
      const s = parsed.scenarios[scenario];
      if (!s || !Array.isArray(s.growthRates) || s.growthRates.length !== 10 || typeof s.exitMultipleFactor !== "number") {
        throw new Error(`Invalid ${scenario} scenario data`);
      }
    }

    return NextResponse.json({
      scenarios: parsed.scenarios,
      researchResult: {
        marketSize: parsed.analysis.marketSize,
        growthTrajectory: parsed.analysis.growthTrajectory,
        competitiveLandscape: parsed.analysis.competitiveLandscape,
        comparableMultiples: parsed.analysis.comparableMultiples,
        summary: parsed.summary || "Research completed successfully.",
        refinedAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error("Research error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Research failed" },
      { status: 422 }
    );
  }
}
