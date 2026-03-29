import { ScenarioAssumptions, ScenarioType, ProjectionPoint } from "@/types/company";

function generateGrowthRates(
  initialRate: number,
  terminalRate: number,
  years: number = 10
): number[] {
  return Array.from({ length: years }, (_, i) =>
    initialRate + (terminalRate - initialRate) * (i / (years - 1))
  );
}

export function getDefaultScenarios(): Record<ScenarioType, ScenarioAssumptions> {
  return {
    bear: {
      growthRates: generateGrowthRates(0.1, 0.05),
      exitMultipleFactor: 0.8,
    },
    base: {
      growthRates: generateGrowthRates(0.3, 0.15),
      exitMultipleFactor: 1.0,
    },
    bull: {
      growthRates: generateGrowthRates(0.6, 0.25),
      exitMultipleFactor: 1.3,
    },
  };
}

export function projectScenario(
  revenue: number,
  valuation: number,
  assumptions: ScenarioAssumptions
): ProjectionPoint[] {
  // Handle pre-revenue companies
  if (revenue <= 0) {
    return Array.from({ length: 11 }, (_, i) => ({
      year: i,
      revenue: 0,
      valuation: valuation,
    }));
  }

  const currentMultiple = valuation / revenue;
  const targetMultiple = currentMultiple * assumptions.exitMultipleFactor;
  const results: ProjectionPoint[] = [{ year: 0, revenue, valuation }];

  for (let i = 0; i < 10; i++) {
    const prevRevenue = results[i].revenue;
    const projectedRevenue = prevRevenue * (1 + assumptions.growthRates[i]);
    const interpolatedMultiple =
      currentMultiple + (targetMultiple - currentMultiple) * ((i + 1) / 10);
    const projectedValuation = projectedRevenue * interpolatedMultiple;
    results.push({
      year: i + 1,
      revenue: projectedRevenue,
      valuation: projectedValuation,
    });
  }

  return results;
}
