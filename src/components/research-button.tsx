"use client";

import { useState } from "react";
import { Company } from "@/types/company";
import { updateCompany } from "@/lib/storage";

interface Props {
  company: Company;
  onUpdated: () => void;
}

export function ResearchButton({ company, onUpdated }: Props) {
  const [loading, setLoading] = useState(company.researchStatus === "loading");

  async function handleResearch() {
    setLoading(true);
    updateCompany(company.id, { researchStatus: "loading" });

    try {
      const res = await fetch(`/api/research/${company.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: company.name,
          url: company.url,
          revenue: company.latestAnnualRevenue,
          valuation: company.latestValuation,
        }),
      });

      if (!res.ok) {
        throw new Error(`Research failed: ${res.statusText}`);
      }

      const data = await res.json();

      updateCompany(company.id, {
        scenarios: data.scenarios,
        researchResult: data.researchResult,
        researchStatus: "done",
      });
    } catch (err) {
      console.error("Research error:", err);
      updateCompany(company.id, { researchStatus: "error" });
    } finally {
      setLoading(false);
      onUpdated();
    }
  }

  return (
    <button
      onClick={handleResearch}
      disabled={loading}
      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
        loading
          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 cursor-wait"
          : company.researchStatus === "done"
          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 hover:opacity-90"
          : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 hover:opacity-90"
      }`}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Researching...
        </span>
      ) : company.researchStatus === "done" ? (
        "Re-run Research"
      ) : (
        "Run AI Research"
      )}
    </button>
  );
}
