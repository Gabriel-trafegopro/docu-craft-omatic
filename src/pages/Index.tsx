import { DashboardLayout } from "@/components/DashboardLayout";
import { KPICard } from "@/components/KPICard";
import { FunnelChart } from "@/components/FunnelChart";
import { useCompany } from "@/hooks/useCompany";
import { useDashboardKPIs, useFunnel, useVisitsTimeline, useUtmAnalysis, useLeads } from "@/hooks/useSupabaseData";
import { Users, Eye, Zap, UserCheck, Activity, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from "recharts";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const statusColors: Record<string, string> = {
  cliente: "bg-success/20 text-success",
  identificado: "bg-warning/20 text-warning",
  anonimo: "bg-muted text-muted-foreground",
};

function getStatus(lead: { is_customer?: boolean | null; is_identified?: boolean | null }) {
  if (lead.is_customer) return "cliente";
  if (lead.is_identified) return "identificado";
  return "anonimo";
}

const tooltipStyle = {
  backgroundColor: "hsl(220, 40%, 8%)",
  border: "1px solid hsl(220, 30%, 18%)",
  borderRadius: 10,
  color: "hsl(210, 40%, 98%)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
};

export default function DashboardPage() {
  const { companyId } = useCompany();
  const { data: kpis, isLoading: kpisLoading } = useDashboardKPIs(companyId);
  const { data: funnel, isLoading: funnelLoading } = useFunnel(companyId);
  const { data: timeline, isLoading: timelineLoading } = useVisitsTimeline(companyId);
  const { data: utmData } = useUtmAnalysis(companyId);
  const { data: leads } = useLeads(companyId);

  const conversionRate = kpis && kpis.leads > 0 ? ((kpis.customers / kpis.leads) * 100).toFixed(1) + "%" : "0%";

  const funnelConversion = funnel ? [
    { stage: "Visitantes", value: Number(funnel.total_visitors) || 0, color: "hsl(25, 95%, 53%)" },
    { stage: "Leads", value: Number(funnel.total_leads) || 0, color: "hsl(217, 91%, 60%)" },
    { stage: "Engajados", value: Number(funnel.total_engaged) || 0, color: "hsl(142, 71%, 45%)" },
    { stage: "Interessados", value: Number(funnel.total_interested) || 0, color: "hsl(38, 92%, 50%)" },
    { stage: "Clientes", value: Number(funnel.total_customers) || 0, color: "hsl(280, 65%, 60%)" },
  ] : [];

  const utmTop5 = (utmData || []).slice(0, 5).map((u) => ({
    source: u.utm_source || "(direto)",
    leads: Number(u.unique_leads) || 0,
  }));

  const recentLeads = (leads || []).slice(0, 10);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Visão geral do desempenho de leads e conversões</p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse-dot" />
            Tempo Real
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {kpisLoading ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)
          ) : (
            <>
              <KPICard title="Leads" value={kpis?.leads || 0} icon={<Users className="h-5 w-5" />} />
              <KPICard title="Visitas" value={kpis?.visits || 0} icon={<Eye className="h-5 w-5" />} />
              <KPICard title="Eventos" value={kpis?.events || 0} icon={<Zap className="h-5 w-5" />} />
              <KPICard title="Clientes" value={kpis?.customers || 0} icon={<UserCheck className="h-5 w-5" />} />
            </>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <KPICard title="Taxa de Conversão" value={conversionRate} icon={<Activity className="h-5 w-5" />} compact />
          <KPICard title="Total Leads" value={kpis?.leads || 0} icon={<Activity className="h-5 w-5" />} compact />
          <KPICard title="Total Visitas" value={kpis?.visits || 0} icon={<Clock className="h-5 w-5" />} compact />
        </div>

        {/* Funnels */}
        {funnelConversion.length > 0 && (
          <div className="grid gap-4 lg:grid-cols-2">
            <FunnelChart title="Funil de Conversão" subtitle="Visitantes → Leads → Engajados → Interessados → Clientes" data={funnelConversion} variant="3d" />
            <FunnelChart title="Funil de Vendas" subtitle="Visualização em barras" data={funnelConversion} variant="bars" />
          </div>
        )}
        {funnelLoading && <Skeleton className="h-80 rounded-xl" />}

        {/* Charts */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="card-glow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Visitas e Eventos (últimos 30 dias)</CardTitle>
            </CardHeader>
            <CardContent>
              {timelineLoading ? <Skeleton className="h-[260px]" /> : (
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={timeline || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 30%, 14%)" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(215, 20%, 45%)" }} />
                    <YAxis tick={{ fontSize: 10, fill: "hsl(215, 20%, 45%)" }} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Line type="monotone" dataKey="visitas" stroke="hsl(25, 95%, 53%)" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="eventos" stroke="hsl(142, 71%, 45%)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card className="card-glow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Top 5 UTM Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={utmTop5} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 30%, 14%)" />
                  <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(215, 20%, 45%)" }} />
                  <YAxis dataKey="source" type="category" tick={{ fontSize: 10, fill: "hsl(215, 20%, 45%)" }} width={70} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="leads" fill="hsl(25, 95%, 53%)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Leads */}
        <Card className="card-glow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Últimos Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lead</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Visitas</TableHead>
                  <TableHead>Eventos</TableHead>
                  <TableHead>Origem</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Última Visita</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentLeads.map((lead) => {
                  const status = getStatus(lead);
                  return (
                    <TableRow key={lead.id} className="hover:bg-accent/50 transition-colors">
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{lead.name || lead.external_user_id}</p>
                          <p className="text-xs text-muted-foreground">{lead.email || "-"}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={statusColors[status]}>{status}</Badge>
                      </TableCell>
                      <TableCell>{lead.total_visits || 0}</TableCell>
                      <TableCell>{lead.total_events || 0}</TableCell>
                      <TableCell>{lead.first_utm_source || "(direto)"}</TableCell>
                      <TableCell className="text-xs">{[lead.last_city, lead.last_country].filter(Boolean).join(", ") || "-"}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {lead.last_visit_at ? new Date(lead.last_visit_at).toLocaleDateString("pt-BR") : "-"}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {recentLeads.length === 0 && (
                  <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">Nenhum lead encontrado. Verifique se está autenticado.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
