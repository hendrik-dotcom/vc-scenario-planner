import { Company } from "@/types/company";
import { getDefaultScenarios } from "@/lib/scenarios";

interface SeedEntry {
  name: string;
  amountInvested: number;
  valuation: number;
  revenue: number;
}

const SEED_ENTRIES: SeedEntry[] = [
  { name: "The Fourth Law", amountInvested: 43657, valuation: 34892740, revenue: 1000000 },
  { name: "Afterimage", amountInvested: 43877, valuation: 43615925, revenue: 100000 },
  { name: "Becoming Bio", amountInvested: 43212, valuation: 87231850, revenue: 0 },
  { name: "Esper", amountInvested: 125629, valuation: 43615925, revenue: 500000 },
  { name: "Elo", amountInvested: 86343, valuation: 17446370, revenue: 3000000 },
  { name: "DuoHub", amountInvested: 54485, valuation: 13957096, revenue: 1200000 },
  { name: "Orion", amountInvested: 174000, valuation: 139570960, revenue: 200000 },
  { name: "Positron", amountInvested: 17173, valuation: 314034660, revenue: 20000000 },
  { name: "Bovonic", amountInvested: 50000, valuation: 10000000, revenue: 1500000 },
  { name: "Foundry Lab", amountInvested: 250500, valuation: 48849836, revenue: 1000000 },
  { name: "Puralink", amountInvested: 113446, valuation: 11949650, revenue: 0 },
  { name: "Wych", amountInvested: 150000, valuation: 15000000, revenue: 3000000 },
  { name: "Herasight", amountInvested: 86343, valuation: 83647550, revenue: 250000 },
  { name: "Gluon", amountInvested: 43000, valuation: 8723185, revenue: 0 },
  { name: "Spoke", amountInvested: 200000, valuation: 15000000, revenue: 4000000 },
  { name: "Sharesies", amountInvested: 500000, valuation: 750000000, revenue: 81000000 },
  { name: "Bonnet", amountInvested: 150000, valuation: 4500000, revenue: 900000 },
  { name: "Plots", amountInvested: 86500, valuation: 43615925, revenue: 200000 },
  { name: "Appetise", amountInvested: 228190, valuation: 50000000, revenue: 3500000 },
  { name: "Dawn", amountInvested: 417000, valuation: 343000000, revenue: 30000000 },
  { name: "General Compute", amountInvested: 86000, valuation: 43615925, revenue: 0 },
];

export function createSeedCompanies(): Company[] {
  const now = new Date().toISOString();
  return SEED_ENTRIES.map((entry) => ({
    id: crypto.randomUUID(),
    name: entry.name,
    url: "",
    type: "portfolio" as const,
    amountInvested: entry.amountInvested,
    latestAnnualRevenue: entry.revenue,
    latestValuation: entry.valuation,
    scenarios: getDefaultScenarios(),
    researchStatus: "idle" as const,
    researchResult: null,
    createdAt: now,
    updatedAt: now,
  }));
}
