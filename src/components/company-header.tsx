"use client";

import { Company } from "@/types/company";
import { formatCurrency, formatMultiple, formatPercent } from "@/lib/format";
import { ResearchButton } from "./research-button";

interface Props {
  company: Company;
  onUpdated: () => void;
}

export function CompanyHeader({ company, onUpdated }: Props) {
  const currentMultiple = company.latestValuation / company.latestAnnualRevenue;

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

      {/* Scenario assumptions summary */}
      <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
        <h3 className="text-sm font-medium text-[var(--muted-foreground)] mb-3">Scenario Assumptions</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          {(["bear", "base", "bull"] as const).map((scenario) => {
            const s = company.scenarios[scenario];
            const color = scenario === "bear" ? "text-red-500" : scenario === "base" ? "text-blue-500" : "text-green-500";
            return (
              <div key={scenario}>
                <p className={`font-medium ${color} mb-1`}>
                  {scenario.charAt(0).toUpperCase() + scenario.slice(1)} Case
                </p>
                <p className="text-[var(--muted-foreground)]">
                  Growth: {formatPercent(s.growthRates[0])} → {formatPercent(s.growthRates[9])}
                </p>
                <p className="text-[var(--muted-foreground)]">
                  Exit Multiple: {formatMultiple(currentMultiple * s.exitMultipleFactor)}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Research results */}
      {company.researchResult && (
        <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
          <h3 className="text-sm font-medium text-[var(--muted-foreground)] mb-3">
            AI Research Summary
            <span className="text-xs font-normal ml-2">
              ({new Date(company.researchResult.refinedAt).toLocaleDateString()})
            </span>
          </h3>
          <p className="text-sm text-[var(--foreground)] mb-3">{company.researchResult.summary}</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-[var(--foreground)] mb-1">Market Size</p>
              <p className="text-[var(--muted-foreground)]">{company.researchResult.marketSize}</p>
            </div>
            <div>
              <p className="font-medium text-[var(--foreground)] mb-1">Growth Trajectory</p>
              <p className="text-[var(--muted-foreground)]">{company.researchResult.growthTrajectory}</p>
            </div>
            <div>
              <p className="font-medium text-[var(--foreground)] mb-1">Competitive Landscape</p>
              <p className="text-[var(--muted-foreground)]">{company.researchResult.competitiveLandscape}</p>
            </div>
            <div>
              <p className="font-medium text-[var(--foreground)] mb-1">Comparable Multiples</p>
              <p className="text-[var(--muted-foreground)]">{company.researchResult.comparableMultiples}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
