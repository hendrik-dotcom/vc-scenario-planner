"use client";

import Link from "next/link";
import { Company } from "@/types/company";
import { formatCurrency, formatMultiple } from "@/lib/format";
import { deleteCompany } from "@/lib/storage";

interface Props {
  companies: Company[];
  onRefresh: () => void;
}

export function WatchlistTable({ companies, onRefresh }: Props) {
  if (companies.length === 0) {
    return (
      <div className="text-center py-12 text-[var(--muted-foreground)]">
        <p className="text-sm">No watchlist companies yet. Add companies you&apos;re tracking.</p>
      </div>
    );
  }

  function handleDelete(e: React.MouseEvent, id: string) {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Remove this company from your watchlist?")) {
      deleteCompany(id);
      onRefresh();
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--border)]">
            <th className="text-left py-3 px-4 font-medium text-[var(--muted-foreground)]">Company</th>
            <th className="text-right py-3 px-4 font-medium text-[var(--muted-foreground)]">Revenue</th>
            <th className="text-right py-3 px-4 font-medium text-[var(--muted-foreground)]">Valuation</th>
            <th className="text-right py-3 px-4 font-medium text-[var(--muted-foreground)]">Multiple</th>
            <th className="text-right py-3 px-4 font-medium text-[var(--muted-foreground)]">Last Researched</th>
            <th className="text-right py-3 px-4 font-medium text-[var(--muted-foreground)]"></th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <Link key={company.id} href={`/company/${company.id}`} className="contents">
              <tr className="border-b border-[var(--border)] hover:bg-[var(--accent)] cursor-pointer transition-colors">
                <td className="py-3 px-4">
                  <div className="font-medium text-[var(--foreground)]">{company.name}</div>
                  {company.url && (
                    <div className="text-xs text-[var(--muted-foreground)] truncate max-w-[200px]">
                      {company.url}
                    </div>
                  )}
                </td>
                <td className="text-right py-3 px-4 text-[var(--foreground)]">
                  {formatCurrency(company.latestAnnualRevenue)}
                </td>
                <td className="text-right py-3 px-4 text-[var(--foreground)]">
                  {formatCurrency(company.latestValuation)}
                </td>
                <td className="text-right py-3 px-4 text-[var(--foreground)]">
                  {formatMultiple(company.latestValuation / company.latestAnnualRevenue)}
                </td>
                <td className="text-right py-3 px-4 text-[var(--muted-foreground)] text-xs">
                  {company.researchStatus === "done" && company.researchResult?.refinedAt
                    ? new Date(company.researchResult.refinedAt).toLocaleDateString()
                    : company.researchStatus === "loading"
                    ? "Researching..."
                    : "—"}
                </td>
                <td className="text-right py-3 px-4">
                  <button
                    onClick={(e) => handleDelete(e, company.id)}
                    className="text-[var(--muted-foreground)] hover:text-[var(--destructive)] transition-colors text-xs"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            </Link>
          ))}
        </tbody>
      </table>
    </div>
  );
}
