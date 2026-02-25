import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface Company {
  id: number;
  name: string;
  slug: string;
}

interface CompanyContextType {
  companyId: number | null;
  companyName: string;
  setCompanyId: (id: number) => void;
  companies: Company[];
  isLoading: boolean;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export function CompanyProvider({ children }: { children: ReactNode }) {
  const [companyId, setCompanyId] = useState<number | null>(null);

  const { data: companies = [], isLoading } = useQuery({
    queryKey: ["user-companies"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // Fallback: try to get all companies (for dev without auth)
        const { data } = await supabase.from("companies").select("id, name, slug").limit(10);
        return (data || []) as Company[];
      }
      const { data: uc } = await supabase
        .from("user_companies")
        .select("company_id")
        .eq("user_id", user.id);
      if (!uc || uc.length === 0) return [];
      const ids = uc.map((r) => r.company_id);
      const { data: companies } = await supabase
        .from("companies")
        .select("id, name, slug")
        .in("id", ids);
      return (companies || []) as Company[];
    },
    staleTime: 60_000,
  });

  useEffect(() => {
    if (companies.length > 0 && companyId === null) {
      setCompanyId(companies[0].id);
    }
  }, [companies, companyId]);

  const company = companies.find((c) => c.id === companyId);

  return (
    <CompanyContext.Provider
      value={{
        companyId,
        companyName: company?.name || "",
        setCompanyId,
        companies,
        isLoading,
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
