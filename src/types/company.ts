export type ScenarioType = "bear" | "base" | "bull";

export interface ScenarioAssumptions {
  growthRates: number[]; // 10 values, one per year (0.30 = 30%)
  exitMultipleFactor: number; // multiplier on current revenue multiple (0.8 = 20% compression)
}

export interface ResearchResult {
  marketSize: string;
  growthTrajectory: string;
  competitiveLandscape: string;
  comparableMultiples: string;
  summary: string;
  refinedAt: string;
}

export interface Company {
  id: string;
  name: string;
  url: string;
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
