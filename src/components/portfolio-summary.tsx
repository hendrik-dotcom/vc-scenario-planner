"use client";

import { Company, ScenarioType } from "@/types/company";
import { projectScenario } from "@/lib/scenarios";
import { formatCurrency, formatMultiple } from "@/lib/format";

interface Props {
  companies: Company[];
}

const SCENARIO_LABELS: Record<ScenarioType, string> = {
  bear: "Bear Case",
  base: "Base Case",
  bull: "Bull Case",
};

const SCENARIO_COLORS: Record<ScenarioType, { text: string; bg: string }> = {
  bear: { text: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/20" },
  base: { text: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/20" },
  bull: { text: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-950/20" },
};

export function PortfolioSummary({ companies }: Props) {
  const invested = companies.filter((c) => c.amountInvested && c.amountInvested > 0);
  if (invested.length === 0) return null;

  const totalInvested = invested.reduce((sum, c) => sum + (c.amountInvested ?? 0), 0);

  const scenarioResults = (["bear", "base", "bull"] as const).map((scenario) => {
    let portfolioValue = 0;
    for (const company of invested) {
      const ownershipPct = company.amountInvested! / company.latestValuation;
      const projections = projectScenario(
        company.latestAnnualRevenue,
        company.latestValuation,
        company.scenarios[scenario]
      );
      portfolioValue += projections[10].valuation * ownershipPct;
    }
    return {
      scenario,
      portfolioValue,
      returnMultiple: totalInvested > 0 ? portfolioValue / totalInvested : 0,
    };
  });

  return (
    <div className="border border-[var(--border)] rounded-lg p-5 bg-[var(--card)] mb-6">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-sm font-semibold text-[var(--foreground)]">Portfolio Summary</h2>
        <p className="text-sm text-[var(--muted-foreground)]">
          Total Invested: <span className="font-semibold text-[var(--foreground)]">{formatCurrency(totalInvested)}</span>
          <span className="ml-2">({invested.length} {invested.length === 1 ? "company" : "companies"})</span>
        </p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {scenarioResults.map(({ scenario, portfolioValue, returnMultiple }) => {
          const colors = SCENARIO_COLORS[scenario];
          return (
            <div key={scenario} className={`p-4 rounded-lg ${colors.bg}`}>
              <p className={`text-xs font-semibold ${colors.text} mb-2`}>
                {SCENARIO_LABELS[scenario]}
              </p>
              <p className="text-lg font-bold text-[var(--foreground)]">
                {formatCurrency(portfolioValue)}
              </p>
              <p className={`text-sm font-semibold ${colors.text}`}>
                {formatMultiple(returnMultiple)} return
              </p>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">at year 10</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
