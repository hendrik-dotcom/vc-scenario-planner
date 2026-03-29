"use client";

import { Company, ScenarioType } from "@/types/company";
import { formatCurrency, formatMultiple, formatPercent } from "@/lib/format";
import { updateCompany } from "@/lib/storage";
import { ResearchButton } from "./research-button";
import { EditableField } from "./editable-field";

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

  function handleFieldSave(field: string, value: string) {
    const numValue = parseFloat(value);
    switch (field) {
      case "name":
        if (value.trim()) {
          updateCompany(company.id, { name: value.trim() });
          onUpdated();
        }
        break;
      case "url":
        updateCompany(company.id, { url: value.trim() });
        onUpdated();
        break;
      case "revenue":
        if (numValue > 0) {
          updateCompany(company.id, { latestAnnualRevenue: numValue });
          onUpdated();
        }
        break;
      case "valuation":
        if (numValue > 0) {
          updateCompany(company.id, { latestValuation: numValue });
          onUpdated();
        }
        break;
      case "invested":
        updateCompany(company.id, { amountInvested: numValue > 0 ? numValue : undefined });
        onUpdated();
        break;
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            <EditableField
              value={company.name}
              onSave={(v) => handleFieldSave("name", v)}
              className="text-2xl font-bold"
            />
          </h1>
          <EditableField
            value={company.url}
            onSave={(v) => handleFieldSave("url", v)}
            type="url"
            className="text-sm text-blue-500"
            placeholder="Add website URL"
          />
        </div>
        <ResearchButton company={company} onUpdated={onUpdated} />
      </div>

      {/* Key metrics — editable */}
      <div className={`grid ${company.type === "portfolio" ? "grid-cols-4" : "grid-cols-3"} gap-4`}>
        <div className="p-4 rounded-lg bg-[var(--muted)]">
          <p className="text-xs text-[var(--muted-foreground)] mb-1">Annual Revenue</p>
          <div className="text-lg font-semibold text-[var(--foreground)]">
            <EditableField
              value={String(company.latestAnnualRevenue)}
              onSave={(v) => handleFieldSave("revenue", v)}
              type="number"
              className="text-lg font-semibold w-full"
            />
            <p className="text-xs text-[var(--muted-foreground)] font-normal mt-0.5">
              {formatCurrency(company.latestAnnualRevenue)}
            </p>
          </div>
        </div>
        <div className="p-4 rounded-lg bg-[var(--muted)]">
          <p className="text-xs text-[var(--muted-foreground)] mb-1">Valuation</p>
          <div className="text-lg font-semibold text-[var(--foreground)]">
            <EditableField
              value={String(company.latestValuation)}
              onSave={(v) => handleFieldSave("valuation", v)}
              type="number"
              className="text-lg font-semibold w-full"
            />
            <p className="text-xs text-[var(--muted-foreground)] font-normal mt-0.5">
              {formatCurrency(company.latestValuation)}
            </p>
          </div>
        </div>
        {company.type === "portfolio" && (
          <div className="p-4 rounded-lg bg-[var(--muted)]">
            <p className="text-xs text-[var(--muted-foreground)] mb-1">Amount Invested</p>
            <div className="text-lg font-semibold text-[var(--foreground)]">
              <EditableField
                value={company.amountInvested ? String(company.amountInvested) : ""}
                onSave={(v) => handleFieldSave("invested", v)}
                type="number"
                className="text-lg font-semibold w-full"
                placeholder="Enter amount"
              />
              {company.amountInvested && (
                <p className="text-xs text-[var(--muted-foreground)] font-normal mt-0.5">
                  {formatCurrency(company.amountInvested)}
                </p>
              )}
            </div>
          </div>
        )}
        <div className="p-4 rounded-lg bg-[var(--muted)]">
          <p className="text-xs text-[var(--muted-foreground)] mb-1">Revenue Multiple</p>
          <p className="text-lg font-semibold text-[var(--foreground)]">
            {formatMultiple(currentMultiple)}
          </p>
        </div>
      </div>

      {/* Scenario assumptions */}
      <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
        <h3 className="text-sm font-medium text-[var(--muted-foreground)] mb-3">Scenario Assumptions</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          {(["bear", "base", "bull"] as const).map((scenario) => {
            const s = company.scenarios[scenario];
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
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
