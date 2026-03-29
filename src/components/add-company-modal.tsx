"use client";

import { useState } from "react";
import { Company, CompanyType } from "@/types/company";
import { getDefaultScenarios } from "@/lib/scenarios";
import { saveCompany } from "@/lib/storage";

interface Props {
  open: boolean;
  onClose: () => void;
  onAdded: () => void;
}

export function AddCompanyModal({ open, onClose, onAdded }: Props) {
  const [companyType, setCompanyType] = useState<CompanyType>("portfolio");
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [revenue, setRevenue] = useState("");
  const [valuation, setValuation] = useState("");
  const [amountInvested, setAmountInvested] = useState("");

  if (!open) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const revenueNum = parseFloat(revenue);
    const valuationNum = parseFloat(valuation);
    if (!name || !revenueNum || !valuationNum) return;

    const company: Company = {
      id: crypto.randomUUID(),
      name,
      url,
      type: companyType,
      amountInvested:
        companyType === "portfolio" ? parseFloat(amountInvested) || undefined : undefined,
      latestAnnualRevenue: revenueNum,
      latestValuation: valuationNum,
      scenarios: getDefaultScenarios(),
      researchStatus: "idle",
      researchResult: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveCompany(company);
    setName("");
    setUrl("");
    setRevenue("");
    setValuation("");
    setAmountInvested("");
    setCompanyType("portfolio");
    onAdded();
    onClose();
  }

  const inputClass =
    "w-full px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)]";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-[var(--card)] border border-[var(--border)] rounded-lg p-6 w-full max-w-md shadow-xl">
        <h2 className="text-lg font-semibold mb-4 text-[var(--foreground)]">
          {companyType === "portfolio" ? "Add Portfolio Company" : "Add to Watchlist"}
        </h2>

        {/* Type toggle */}
        <div className="flex mb-4 rounded-md border border-[var(--border)] overflow-hidden">
          {(["portfolio", "watchlist"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setCompanyType(t)}
              className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
                companyType === t
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                  : "bg-[var(--background)] text-[var(--muted-foreground)] hover:bg-[var(--accent)]"
              }`}
            >
              {t === "portfolio" ? "Portfolio" : "Watchlist"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-[var(--foreground)]">
              Company Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              placeholder="e.g. Acme Corp"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-[var(--foreground)]">
              Website URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className={inputClass}
              placeholder="https://acme.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-[var(--foreground)]">
              Latest Annual Revenue ($)
            </label>
            <input
              type="number"
              value={revenue}
              onChange={(e) => setRevenue(e.target.value)}
              className={inputClass}
              placeholder="e.g. 5000000"
              min="0"
              step="any"
              required
            />
            <p className="text-xs text-[var(--muted-foreground)] mt-1">
              Enter in dollars (e.g. 5000000 for $5M)
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-[var(--foreground)]">
              Latest Valuation ($)
            </label>
            <input
              type="number"
              value={valuation}
              onChange={(e) => setValuation(e.target.value)}
              className={inputClass}
              placeholder="e.g. 50000000"
              min="0"
              step="any"
              required
            />
            <p className="text-xs text-[var(--muted-foreground)] mt-1">
              Enter in dollars (e.g. 50000000 for $50M)
            </p>
          </div>
          {companyType === "portfolio" && (
            <div>
              <label className="block text-sm font-medium mb-1 text-[var(--foreground)]">
                Amount Invested ($)
              </label>
              <input
                type="number"
                value={amountInvested}
                onChange={(e) => setAmountInvested(e.target.value)}
                className={inputClass}
                placeholder="e.g. 2000000"
                min="0"
                step="any"
              />
              <p className="text-xs text-[var(--muted-foreground)] mt-1">
                Enter in dollars (e.g. 2000000 for $2M)
              </p>
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-md border border-[var(--border)] text-sm font-medium text-[var(--foreground)] hover:bg-[var(--accent)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 rounded-md bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-medium hover:opacity-90 transition-opacity"
            >
              {companyType === "portfolio" ? "Add Company" : "Add to Watchlist"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
