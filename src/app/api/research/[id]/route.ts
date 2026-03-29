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
  const revenueM = (revenue / 1_000_000).toFixed(1);
  const valuationM = (valuation / 1_000_000).toFixed(1);

  const prompt = `You are a senior equity research analyst at a top-tier investment bank. You are writing an investment memo on an early-stage private company for a VC fund. Your job is NOT to be neutral — you must form an opinionated thesis, just like you would covering a public stock. Take a clear stance on whether this is a good investment and why.

Company: ${name}
Website: ${url || "Not provided"}
Latest Annual Revenue: $${revenueM}M
Latest Valuation: $${valuationM}M
Current Revenue Multiple: ${currentMultiple}x

Work through the following analysis sections with rigor, then use your findings to construct three 10-year scenarios.

## SECTION 1: RECENT DEVELOPMENTS
What are the most notable recent developments for ${name}? Cover:
- Funding rounds, acquisitions, strategic partnerships
- Product launches, pivots, or major feature releases
- Leadership changes, key hires or departures
- Regulatory or legal developments
- Any red flags: layoffs, customer churn, negative press

## SECTION 2: MARKET DYNAMICS & COMPETITORS
Provide a sharp analysis, not a textbook summary:
- TAM with a specific dollar figure and your reasoning
- Market CAGR and whether ${name} is outpacing or lagging the market
- Name 3-5 direct competitors with approximate revenue or valuation where known
- Assess ${name}'s moat honestly: network effects, switching costs, tech, brand, scale
- What is the single biggest competitive threat?

## SECTION 3: INDUSTRY VALUATION MULTIPLES
Be specific — name names:
- Current public market revenue multiples for 3-5 comparable companies (name them with their multiples)
- Multiple trend over the past 2 years: compression or expansion? Why?
- Private market premium/discount vs public comps
- Is ${name}'s current ${currentMultiple}x multiple justified, cheap, or expensive relative to peers? Take a stance.

## SECTION 4: INVESTMENT THESIS
Form your opinion:
- Is this company well-positioned or not? Why?
- What needs to go right for the bull case?
- What are the real risks that could destroy value?
- Is the current valuation justified?

## SECTION 5: SCENARIO CONSTRUCTION
Using ALL of the above, construct three 10-year scenarios. For each scenario, you MUST provide conviction-driven reasoning — write like an analyst who has a view, not a consultant hedging everything.

For each scenario (bear, base, bull):
1. Narrative: what happens in this world? (2-3 sentences, written with conviction: "We believe..." / "The company will likely...")
2. Key drivers: 2-4 specific factors that make this scenario play out
3. Year-by-year revenue growth rates (10 values) — the arc should tell a story
4. Exit multiple factor relative to current ${currentMultiple}x multiple, with a clear explanation of WHY (1.0 = flat, 0.7 = 30% compression, 1.5 = 50% expansion)

Return your response in this EXACT JSON format and nothing else:

{
  "research": {
    "recentDevelopments": "Key recent developments (3-4 sentences)",
    "marketDynamics": "TAM, growth, positioning analysis (3-4 sentences)",
    "competitorAnalysis": "Named competitors, moat assessment, threats (3-4 sentences)",
    "industryMultiples": "Named public comps with multiples, trend analysis, valuation view (3-4 sentences)"
  },
  "investmentThesis": "Your opinionated 2-3 sentence investment thesis — is this a good investment and why/why not?",
  "scenarios": {
    "bear": {
      "growthRates": [y1, y2, y3, y4, y5, y6, y7, y8, y9, y10],
      "exitMultipleFactor": 0.6,
      "reasoning": {
        "narrative": "What happens in the bear case (2-3 sentences with conviction)",
        "keyDrivers": ["specific driver 1", "specific driver 2", "specific driver 3"],
        "exitMultipleRationale": "Why the multiple compresses to Xx (1-2 sentences)"
      }
    },
    "base": {
      "growthRates": [y1, y2, y3, y4, y5, y6, y7, y8, y9, y10],
      "exitMultipleFactor": 0.9,
      "reasoning": {
        "narrative": "...",
        "keyDrivers": ["...", "...", "..."],
        "exitMultipleRationale": "..."
      }
    },
    "bull": {
      "growthRates": [y1, y2, y3, y4, y5, y6, y7, y8, y9, y10],
      "exitMultipleFactor": 1.4,
      "reasoning": {
        "narrative": "...",
        "keyDrivers": ["...", "...", "..."],
        "exitMultipleRationale": "..."
      }
    }
  },
  "summary": "Executive summary paragraph covering the key opportunity, main risks, and where you come out on valuation"
}

CRITICAL RULES:
- Growth rates are decimals (0.30 = 30% annual growth)
- exitMultipleFactor is relative to the CURRENT revenue multiple of ${currentMultiple}x
- Bear < base < bull for growth rates at each year
- Each growthRates array must have EXACTLY 10 values (one per year, years 1-10)
- The reasoning must be SPECIFIC to this company — no generic platitudes
- Write with conviction, not hedging language
- Return ONLY valid JSON, no markdown formatting or extra text`;

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
        max_tokens: 4096,
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

    // Parse JSON, handling potential markdown wrapping
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[1].trim());
      } else {
        throw new Error("Could not parse AI response as JSON");
      }
    }

    // Validate structure
    if (!parsed.scenarios || !parsed.research) {
      throw new Error("AI response missing required fields");
    }

    for (const scenario of ["bear", "base", "bull"] as const) {
      const s = parsed.scenarios[scenario];
      if (!s || !Array.isArray(s.growthRates) || s.growthRates.length !== 10 || typeof s.exitMultipleFactor !== "number") {
        throw new Error(`Invalid ${scenario} scenario data`);
      }
      if (!s.reasoning || !s.reasoning.narrative || !Array.isArray(s.reasoning.keyDrivers)) {
        throw new Error(`Missing reasoning for ${scenario} scenario`);
      }
    }

    return NextResponse.json({
      scenarios: {
        bear: { growthRates: parsed.scenarios.bear.growthRates, exitMultipleFactor: parsed.scenarios.bear.exitMultipleFactor },
        base: { growthRates: parsed.scenarios.base.growthRates, exitMultipleFactor: parsed.scenarios.base.exitMultipleFactor },
        bull: { growthRates: parsed.scenarios.bull.growthRates, exitMultipleFactor: parsed.scenarios.bull.exitMultipleFactor },
      },
      researchResult: {
        recentDevelopments: parsed.research.recentDevelopments,
        marketDynamics: parsed.research.marketDynamics,
        competitorAnalysis: parsed.research.competitorAnalysis,
        industryMultiples: parsed.research.industryMultiples,
        investmentThesis: parsed.investmentThesis || "",
        scenarioReasoning: {
          bear: parsed.scenarios.bear.reasoning,
          base: parsed.scenarios.base.reasoning,
          bull: parsed.scenarios.bull.reasoning,
        },
        summary: parsed.summary || "Research completed.",
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
