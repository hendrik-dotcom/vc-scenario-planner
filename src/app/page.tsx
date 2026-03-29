"use client";

import { useState } from "react";
import { useCompanies } from "@/hooks/use-companies";
import { PortfolioTable } from "@/components/portfolio-table";
import { AddCompanyModal } from "@/components/add-company-modal";

export default function HomePage() {
  const { companies, refresh } = useCompanies();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Portfolio</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            {companies.length} {companies.length === 1 ? "company" : "companies"}
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 rounded-md bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-medium hover:opacity-90 transition-opacity"
        >
          + Add Company
        </button>
      </div>

      <div className="border border-[var(--border)] rounded-lg overflow-hidden bg-[var(--card)]">
        <PortfolioTable companies={companies} onRefresh={refresh} />
      </div>

      <AddCompanyModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdded={refresh}
      />
    </div>
  );
}
