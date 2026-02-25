import { ReactNode } from "react";
import { AppSidebar } from "@/components/AppSidebar";

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="ml-[220px] flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
