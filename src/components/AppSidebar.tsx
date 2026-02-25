import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Users, Filter, Share2, Globe, Zap, Clock, LogOut, Building2,
} from "lucide-react";
import { useCompany } from "@/hooks/useCompany";
import { useAuth } from "@/hooks/useAuth";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
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
  { title: "Empresas", path: "/companies", icon: Building2 },
];

export function AppSidebar() {
  const location = useLocation();
  const { companyId, setCompanyId, companies } = useCompany();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[220px] flex-col border-r border-sidebar-border bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 border border-primary/30">
          <Zap className="h-4 w-4 text-primary" />
        </div>
        <div>
          <span className="text-sm font-bold text-foreground">LeadTracker</span>
          <p className="text-[10px] text-muted-foreground">Analytics Dashboard</p>
        </div>
      </div>

      {/* Company Selector */}
      <div className="px-4 pb-4">
        <Select value={companyId?.toString() || ""} onValueChange={(v) => setCompanyId(Number(v))}>
          <SelectTrigger className="h-9 w-full border-sidebar-border bg-sidebar-accent text-xs text-sidebar-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {companies.map((c) => (
              <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Navigation */}
      <p className="px-5 pb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Menu</p>
      <nav className="flex-1 space-y-0.5 px-3">
        {navItems.map((item) => {
          const isActive = item.path === "/" ? location.pathname === "/" : location.pathname.startsWith(item.path);
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/15 text-primary border border-primary/20 shadow-[0_0_12px_-3px_hsl(var(--primary)/0.3)]"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground border border-transparent"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border px-4 py-3 space-y-2">
        {user?.email && (
          <p className="truncate text-[11px] text-muted-foreground">{user.email}</p>
        )}
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-xs text-sidebar-foreground hover:bg-sidebar-accent hover:text-destructive transition-colors"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sair
        </button>
      </div>
    </aside>
  );
}
