import { createContext, useContext, useState, ReactNode } from "react";
import { mockCompanies } from "@/data/mockData";

interface CompanyContextType {
  companyId: string;
  companyName: string;
  setCompanyId: (id: string) => void;
  companies: typeof mockCompanies;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export function CompanyProvider({ children }: { children: ReactNode }) {
  const [companyId, setCompanyId] = useState(mockCompanies[0].id);
  const company = mockCompanies.find((c) => c.id === companyId) || mockCompanies[0];

  return (
    <CompanyContext.Provider
      value={{
        companyId,
        companyName: company.name,
        setCompanyId,
        companies: mockCompanies,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const ctx = useContext(CompanyContext);
  if (!ctx) throw new Error("useCompany must be used within CompanyProvider");
  return ctx;
}
