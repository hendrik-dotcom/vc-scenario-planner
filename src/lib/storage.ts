import { Company } from "@/types/company";

const STORAGE_KEY = "vc-portfolio";

export function getCompanies(): Company[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function getCompany(id: string): Company | null {
  return getCompanies().find((c) => c.id === id) || null;
}

export function saveCompany(company: Company): void {
  const companies = getCompanies();
  companies.push(company);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(companies));
}

export function updateCompany(id: string, updates: Partial<Company>): void {
  const companies = getCompanies();
  const index = companies.findIndex((c) => c.id === id);
  if (index !== -1) {
    companies[index] = { ...companies[index], ...updates, updatedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(companies));
  }
}

export function deleteCompany(id: string): void {
  const companies = getCompanies().filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(companies));
}
