"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Company, ScenarioType } from "@/types/company";
import { projectScenario } from "@/lib/scenarios";
import { formatCurrency } from "@/lib/format";
import { useState } from "react";

interface Props {
  company: Company;
}

const SCENARIO_COLORS: Record<ScenarioType, string> = {
  bear: "#ef4444",
  base: "#3b82f6",
  bull: "#22c55e",
};

export function ScenarioChart({ company }: Props) {
  const [metric, setMetric] = useState<"valuation" | "revenue">("valuation");

  const bearData = projectScenario(
    company.latestAnnualRevenue,
    company.latestValuation,
    company.scenarios.bear
  );
  const baseData = projectScenario(
    company.latestAnnualRevenue,
    company.latestValuation,
    company.scenarios.base
  );
  const bullData = projectScenario(
    company.latestAnnualRevenue,
    company.latestValuation,
    company.scenarios.bull
  );

  const chartData = bearData.map((_, i) => ({
    year: `Y${i}`,
    bear: Math.round(metric === "valuation" ? bearData[i].valuation : bearData[i].revenue),
    base: Math.round(metric === "valuation" ? baseData[i].valuation : baseData[i].revenue),
    bull: Math.round(metric === "valuation" ? bullData[i].valuation : bullData[i].revenue),
  }));

  const summaryYears = [0, 5, 10];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setMetric("valuation")}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            metric === "valuation"
              ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
              : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--accent)]"
          }`}
        >
          Valuation
        </button>
        <button
          onClick={() => setMetric("revenue")}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            metric === "revenue"
              ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
              : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--accent)]"
          }`}
        >
          Revenue
        </button>
      </div>

      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="year" stroke="var(--muted-foreground)" fontSize={12} />
            <YAxis
              stroke="var(--muted-foreground)"
              fontSize={12}
              tickFormatter={(v) => formatCurrency(v)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                fontSize: "13px",
              }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any) => formatCurrency(Number(value))}
            />
            <Legend
              formatter={(value: string) =>
                value.charAt(0).toUpperCase() + value.slice(1) + " Case"
              }
            />
            <Line
              type="monotone"
              dataKey="bear"
              stroke={SCENARIO_COLORS.bear}
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="base"
              stroke={SCENARIO_COLORS.base}
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="bull"
              stroke={SCENARIO_COLORS.bull}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Summary table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="text-left py-2 px-3 font-medium text-[var(--muted-foreground)]">
                {metric === "valuation" ? "Valuation" : "Revenue"}
              </th>
              {summaryYears.map((y) => (
                <th key={y} className="text-right py-2 px-3 font-medium text-[var(--muted-foreground)]">
                  Year {y}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(["bear", "base", "bull"] as ScenarioType[]).map((scenario) => {
              const data =
                scenario === "bear" ? bearData : scenario === "base" ? baseData : bullData;
              return (
                <tr key={scenario} className="border-b border-[var(--border)]">
                  <td className="py-2 px-3 font-medium" style={{ color: SCENARIO_COLORS[scenario] }}>
                    {scenario.charAt(0).toUpperCase() + scenario.slice(1)} Case
                  </td>
                  {summaryYears.map((y) => (
                    <td key={y} className="text-right py-2 px-3 text-[var(--foreground)]">
                      {formatCurrency(metric === "valuation" ? data[y].valuation : data[y].revenue)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
