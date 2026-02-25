import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Filter,
  Share2,
  Globe,
  Zap,
  Clock,
  ChevronDown,
  Activity,
} from "lucide-react";
import { useCompany } from "@/hooks/useCompany";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Dashboard", path: "/", icon: LayoutDashboard },
  { title: "Leads", path: "/leads", icon: Users },
  { title: "Funil", path: "/funnel", icon: Filter },
  { title: "Análise UTM", path: "/utm", icon: Share2 },
  { title: "Geográfico", path: "/geo", icon: Globe },
  { title: "Eventos", path: "/events", icon: Zap },
  { title: "Temporal", path: "/temporal", icon: Clock },
];

export function AppSidebar() {
  const location = useLocation();
  const { companyId, setCompanyId, companies } = useCompany();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[220px] flex-col border-r border-sidebar-border bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 px-5">
        <Activity className="h-6 w-6 text-primary" />
        <span className="text-lg font-bold text-foreground">LeadTracker</span>
      </div>

      {/* Company Selector */}
      <div className="px-4 pb-4">
        <Select value={companyId} onValueChange={setCompanyId}>
          <SelectTrigger className="h-9 w-full border-sidebar-border bg-sidebar-accent text-xs text-sidebar-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {companies.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const isActive =
            item.path === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.path);
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border px-4 py-3">
        <div className="flex items-center gap-2 text-xs text-sidebar-foreground">
          <span className="h-2 w-2 rounded-full bg-success animate-pulse-dot" />
          Dados em tempo real
        </div>
      </div>
    </aside>
  );
}
