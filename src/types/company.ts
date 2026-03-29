export type ScenarioType = "bear" | "base" | "bull";
export type CompanyType = "portfolio" | "watchlist";

export interface ScenarioAssumptions {
  growthRates: number[]; // 10 values, one per year (0.30 = 30%)
  exitMultipleFactor: number; // multiplier on current revenue multiple (0.8 = 20% compression)
}

export interface ScenarioReasoning {
  narrative: string;
  keyDrivers: string[];
  exitMultipleRationale: string;
}

export interface ResearchResult {
  recentDevelopments: string;
  marketDynamics: string;
  competitorAnalysis: string;
  industryMultiples: string;
  investmentThesis: string;
  scenarioReasoning: Record<ScenarioType, ScenarioReasoning>;
  summary: string;
  refinedAt: string;
}

export interface Company {
  id: string;
  name: string;
  url: string;
  type: CompanyType;
  amountInvested?: number;
  latestAnnualRevenue: number;
  latestValuation: number;
  scenarios: Record<ScenarioType, ScenarioAssumptions>;
  researchStatus: "idle" | "loading" | "done" | "error";
  researchResult: ResearchResult | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectionPoint {
  year: number;
  revenue: number;
  valuation: number;
}
