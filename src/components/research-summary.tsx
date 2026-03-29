"use client";

import { Company, ScenarioType } from "@/types/company";

const SCENARIO_COLORS: Record<ScenarioType, { text: string; bg: string; border: string }> = {
  bear: { text: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/20", border: "border-red-200 dark:border-red-800" },
  base: { text: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/20", border: "border-blue-200 dark:border-blue-800" },
  bull: { text: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-950/20", border: "border-green-200 dark:border-green-800" },
};

interface Props {
  company: Company;
}

export function ResearchSummary({ company }: Props) {
  const research = company.researchResult;

  if (!research) {
    return (
      <div className="text-center py-8 text-[var(--muted-foreground)]">
        <p className="text-sm">Click &quot;Update Research&quot; to generate an AI-powered analysis with scenario reasoning.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Investment Thesis */}
      {research.investmentThesis && (
        <div className="p-4 rounded-lg border-2 border-blue-500/30 bg-blue-50 dark:bg-blue-950/20">
          <h3 className="text-sm font-semibold text-[var(--foreground)] mb-2">Investment Thesis</h3>
          <p className="text-sm font-medium text-[var(--foreground)] leading-relaxed">
            {research.investmentThesis}
          </p>
        </div>
      )}

      {/* Executive Summary */}
      {research.summary && (
        <div>
          <h3 className="text-sm font-semibold text-[var(--foreground)] mb-2">Executive Summary</h3>
          <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{research.summary}</p>
        </div>
      )}

      {/* Scenario Reasoning Cards */}
      {research.scenarioReasoning && (
        <div>
          <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">Scenario Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(["bear", "base", "bull"] as const).map((scenario) => {
              const reasoning = research.scenarioReasoning?.[scenario];
              if (!reasoning) return null;
              const colors = SCENARIO_COLORS[scenario];
              return (
                <div
                  key={scenario}
                  className={`p-4 rounded-lg border ${colors.border} ${colors.bg}`}
                >
                  <h4 className={`text-sm font-semibold ${colors.text} mb-2`}>
                    {scenario.charAt(0).toUpperCase() + scenario.slice(1)} Case
                  </h4>
                  <p className="text-sm text-[var(--foreground)] mb-3 leading-relaxed">
                    {reasoning.narrative}
                  </p>
                  <div className="mb-3">
                    <p className="text-xs font-medium text-[var(--foreground)] mb-1">Key Drivers</p>
                    <ul className="text-xs text-[var(--muted-foreground)] space-y-1">
                      {reasoning.keyDrivers.map((driver, i) => (
                        <li key={i} className="flex gap-1.5">
                          <span className="shrink-0">•</span>
                          <span>{driver}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[var(--foreground)] mb-1">Exit Multiple View</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{reasoning.exitMultipleRationale}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Research Details */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-[var(--foreground)]">
          Research Details
          <span className="text-xs font-normal text-[var(--muted-foreground)] ml-2">
            (Updated {new Date(research.refinedAt).toLocaleDateString()})
          </span>
        </h3>
        {research.recentDevelopments && (
          <div>
            <p className="text-xs font-semibold text-[var(--foreground)] mb-1">Recent Developments</p>
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{research.recentDevelopments}</p>
          </div>
        )}
        {research.marketDynamics && (
          <div>
            <p className="text-xs font-semibold text-[var(--foreground)] mb-1">Market Dynamics</p>
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{research.marketDynamics}</p>
          </div>
        )}
        {research.competitorAnalysis && (
          <div>
            <p className="text-xs font-semibold text-[var(--foreground)] mb-1">Competitors</p>
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{research.competitorAnalysis}</p>
          </div>
        )}
        {research.industryMultiples && (
          <div>
            <p className="text-xs font-semibold text-[var(--foreground)] mb-1">Industry Multiples</p>
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{research.industryMultiples}</p>
          </div>
        )}
      </div>
    </div>
  );
}
