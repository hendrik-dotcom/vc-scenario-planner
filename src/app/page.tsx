"use client";

import { useState } from "react";
import { useCompanies } from "@/hooks/use-companies";
import { PortfolioTable } from "@/components/portfolio-table";
import { PortfolioSummary } from "@/components/portfolio-summary";
import { WatchlistTable } from "@/components/watchlist-table";
import { AddCompanyModal } from "@/components/add-company-modal";

export default function HomePage() {
  const { companies, refresh } = useCompanies();
  const [modalOpen, setModalOpen] = useState(false);

  const portfolioCompanies = companies.filter((c) => c.type === "portfolio");
  const watchlistCompanies = companies.filter((c) => c.type === "watchlist");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Portfolio</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            {portfolioCompanies.length} {portfolioCompanies.length === 1 ? "company" : "companies"}
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 rounded-md bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-medium hover:opacity-90 transition-opacity"
        >
          + Add Company
        </button>
      </div>

      <PortfolioSummary companies={portfolioCompanies} />

      <div className="border border-[var(--border)] rounded-lg overflow-hidden bg-[var(--card)]">
        <PortfolioTable companies={portfolioCompanies} onRefresh={refresh} />
      </div>

      {/* Watchlist */}
      <div className="mt-12">
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-[var(--foreground)]">Watchlist</h2>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">
              {watchlistCompanies.length} {watchlistCompanies.length === 1 ? "company" : "companies"}
            </p>
          </div>
        </div>
        <div className="border border-[var(--border)] rounded-lg overflow-hidden bg-[var(--card)]">
          <WatchlistTable companies={watchlistCompanies} onRefresh={refresh} />
        </div>
      </div>

      <AddCompanyModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdded={refresh}
      />
    </div>
  );
}
