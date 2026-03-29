"use client";

import { Company, ScenarioType } from "@/types/company";
import { formatCurrency, formatMultiple, formatPercent } from "@/lib/format";
import { ResearchButton } from "./research-button";

interface Props {
  company: Company;
  onUpdated: () => void;
}

const SCENARIO_COLORS: Record<ScenarioType, string> = {
  bear: "text-red-500",
  base: "text-blue-500",
  bull: "text-green-500",
};

export function CompanyHeader({ company, onUpdated }: Props) {
  const currentMultiple = company.latestValuation / company.latestAnnualRevenue;
  const research = company.researchResult;

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">{company.name}</h1>
          {company.url && (
            <a
              href={company.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-500 hover:underline"
            >
              {company.url}
            </a>
          )}
        </div>
        <ResearchButton company={company} onUpdated={onUpdated} />
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-[var(--muted)]">
          <p className="text-xs text-[var(--muted-foreground)] mb-1">Annual Revenue</p>
          <p className="text-lg font-semibold text-[var(--foreground)]">
            {formatCurrency(company.latestAnnualRevenue)}
          </p>
        </div>
        <div className="p-4 rounded-lg bg-[var(--muted)]">
          <p className="text-xs text-[var(--muted-foreground)] mb-1">Valuation</p>
          <p className="text-lg font-semibold text-[var(--foreground)]">
            {formatCurrency(company.latestValuation)}
          </p>
        </div>
        <div className="p-4 rounded-lg bg-[var(--muted)]">
          <p className="text-xs text-[var(--muted-foreground)] mb-1">Revenue Multiple</p>
          <p className="text-lg font-semibold text-[var(--foreground)]">
            {formatMultiple(currentMultiple)}
          </p>
        </div>
      </div>

      {/* Investment Thesis — shown prominently when research is done */}
      {research?.investmentThesis && (
        <div className="p-4 rounded-lg border-2 border-blue-500/30 bg-blue-50 dark:bg-blue-950/20">
          <h3 className="text-sm font-semibold text-[var(--foreground)] mb-2">Investment Thesis</h3>
          <p className="text-sm font-medium text-[var(--foreground)] leading-relaxed">
            {research.investmentThesis}
          </p>
        </div>
      )}

      {/* Research details */}
      {research && (
        <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
          <h3 className="text-sm font-medium text-[var(--muted-foreground)] mb-3">
            Research Analysis
            <span className="text-xs font-normal ml-2">
              (Updated {new Date(research.refinedAt).toLocaleDateString()})
            </span>
          </h3>
          <p className="text-sm text-[var(--foreground)] mb-4">{research.summary}</p>

          <div className="space-y-3">
            {research.recentDevelopments && (
              <div>
                <p className="text-xs font-semibold text-[var(--foreground)] mb-1">Recent Developments</p>
                <p className="text-sm text-[var(--muted-foreground)]">{research.recentDevelopments}</p>
              </div>
            )}
            {research.marketDynamics && (
              <div>
                <p className="text-xs font-semibold text-[var(--foreground)] mb-1">Market Dynamics</p>
                <p className="text-sm text-[var(--muted-foreground)]">{research.marketDynamics}</p>
              </div>
            )}
            {research.competitorAnalysis && (
              <div>
                <p className="text-xs font-semibold text-[var(--foreground)] mb-1">Competitors</p>
                <p className="text-sm text-[var(--muted-foreground)]">{research.competitorAnalysis}</p>
              </div>
            )}
            {research.industryMultiples && (
              <div>
                <p className="text-xs font-semibold text-[var(--foreground)] mb-1">Industry Multiples</p>
                <p className="text-sm text-[var(--muted-foreground)]">{research.industryMultiples}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Scenario assumptions with integrated reasoning */}
      <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
        <h3 className="text-sm font-medium text-[var(--muted-foreground)] mb-3">Scenario Assumptions</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          {(["bear", "base", "bull"] as const).map((scenario) => {
            const s = company.scenarios[scenario];
            const reasoning = research?.scenarioReasoning?.[scenario];
            return (
              <div key={scenario}>
                <p className={`font-medium ${SCENARIO_COLORS[scenario]} mb-1`}>
                  {scenario.charAt(0).toUpperCase() + scenario.slice(1)} Case
                </p>
                <p className="text-[var(--muted-foreground)]">
                  Growth: {formatPercent(s.growthRates[0])} → {formatPercent(s.growthRates[9])}
                </p>
                <p className="text-[var(--muted-foreground)]">
                  Exit Multiple: {formatMultiple(currentMultiple * s.exitMultipleFactor)}
                </p>

                {reasoning && (
                  <div className="mt-2 pt-2 border-t border-[var(--border)]">
                    <p className="text-xs text-[var(--foreground)] italic mb-1.5 leading-relaxed">
                      {reasoning.narrative}
                    </p>
                    <ul className="text-xs text-[var(--muted-foreground)] space-y-0.5 mb-1.5">
                      {reasoning.keyDrivers.map((driver, i) => (
                        <li key={i} className="flex gap-1">
                          <span className="shrink-0">•</span>
                          <span>{driver}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-[var(--muted-foreground)] italic">
                      {reasoning.exitMultipleRationale}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
