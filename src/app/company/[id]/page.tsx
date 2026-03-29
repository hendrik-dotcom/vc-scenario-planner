"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Company } from "@/types/company";
import { getCompany } from "@/lib/storage";
import { CompanyHeader } from "@/components/company-header";
import { ScenarioChart } from "@/components/scenario-chart";

export default function CompanyDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [company, setCompany] = useState<Company | null>(null);
  const [notFound, setNotFound] = useState(false);

  const loadCompany = useCallback(() => {
    const c = getCompany(id);
    if (c) {
      setCompany(c);
    } else {
      setNotFound(true);
    }
  }, [id]);

  useEffect(() => {
    loadCompany();
  }, [loadCompany]);

  if (notFound) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-[var(--foreground)] mb-4">Company not found</p>
        <Link href="/" className="text-blue-500 hover:underline text-sm">
          Back to Portfolio
        </Link>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="text-center py-16 text-[var(--muted-foreground)]">Loading...</div>
    );
  }

  return (
    <div className="space-y-8">
      <Link
        href="/"
        className="inline-flex items-center text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
      >
        &larr; Back to Portfolio
      </Link>

      <CompanyHeader company={company} onUpdated={loadCompany} />

      <div className="border border-[var(--border)] rounded-lg p-6 bg-[var(--card)]">
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">
          10-Year Projections
        </h2>
        <ScenarioChart company={company} />
      </div>
    </div>
  );
}
