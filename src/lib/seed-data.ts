import { Company } from "@/types/company";
import { getDefaultScenarios } from "@/lib/scenarios";

const now = new Date().toISOString();

function makeCompany(
  name: string,
  amountInvested: number,
  valuation: number,
  revenue: number
): Company {
  return {
    id: crypto.randomUUID(),
    name,
    url: "",
    type: "portfolio",
    amountInvested,
    latestAnnualRevenue: revenue,
    latestValuation: valuation,
    scenarios: getDefaultScenarios(),
    researchStatus: "idle",
    researchResult: null,
    createdAt: now,
    updatedAt: now,
  };
}

export const SEED_COMPANIES: Company[] = [
  makeCompany("The Fourth Law", 43657, 34892740, 1000000),
  makeCompany("Afterimage", 43877, 43615925, 100000),
  makeCompany("Becoming Bio", 43212, 87231850, 0),
  makeCompany("Esper", 125629, 43615925, 500000),
  makeCompany("Elo", 86343, 17446370, 3000000),
  makeCompany("DuoHub", 54485, 13957096, 1200000),
  makeCompany("Orion", 174000, 139570960, 200000),
  makeCompany("Positron", 17173, 314034660, 20000000),
  makeCompany("Bovonic", 50000, 10000000, 1500000),
  makeCompany("Foundry Lab", 250500, 48849836, 1000000),
  makeCompany("Puralink", 113446, 11949650, 0),
  makeCompany("Wych", 150000, 15000000, 3000000),
  makeCompany("Herasight", 86343, 83647550, 250000),
  makeCompany("Gluon", 43000, 8723185, 0),
  makeCompany("Spoke", 200000, 15000000, 4000000),
  makeCompany("Sharesies", 500000, 750000000, 81000000),
  makeCompany("Bonnet", 150000, 4500000, 900000),
  makeCompany("Plots", 86500, 43615925, 200000),
  makeCompany("Appetise", 228190, 50000000, 3500000),
  makeCompany("Dawn", 417000, 343000000, 30000000),
  makeCompany("General Compute", 86000, 43615925, 0),
];
