"use client";

import { useState, useEffect, useCallback } from "react";
import { Company } from "@/types/company";
import { getCompanies } from "@/lib/storage";

export function useCompanies() {
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    setCompanies(getCompanies());
  }, []);

  const refresh = useCallback(() => {
    setCompanies(getCompanies());
  }, []);

  return { companies, refresh };
}
