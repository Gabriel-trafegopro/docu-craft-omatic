import { DashboardLayout } from "@/components/DashboardLayout";
import { KPICard } from "@/components/KPICard";
import { FunnelChart } from "@/components/FunnelChart";
import {
  mockKPIs,
  mockFunnelConversion,
  mockFunnelSales,
  mockVisitsEvents30d,
  mockUtmSources,
  mockLeads,
} from "@/data/mockData";
import { Users, Eye, Zap, UserCheck, Activity, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const statusColors: Record<string, string> = {
  lead: "bg-primary/20 text-primary",
  cliente: "bg-success/20 text-success",
  identificado: "bg-warning/20 text-warning",
};

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Visão geral de performance</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <KPICard title="Leads" value={mockKPIs.leads.value} change={mockKPIs.leads.change} icon={<Users className="h-5 w-5" />} />
          <KPICard title="Visitas" value={mockKPIs.visits.value} change={mockKPIs.visits.change} icon={<Eye className="h-5 w-5" />} />
          <KPICard title="Eventos" value={mockKPIs.events.value} change={mockKPIs.events.change} icon={<Zap className="h-5 w-5" />} />
          <KPICard title="Clientes" value={mockKPIs.customers.value} change={mockKPIs.customers.change} icon={<UserCheck className="h-5 w-5" />} />
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <KPICard title="Ativos 7 dias" value={mockKPIs.active7d.value} icon={<Activity className="h-5 w-5" />} compact />
          <KPICard title="Ativos 24h" value={mockKPIs.active24h.value} icon={<Clock className="h-5 w-5" />} compact />
        </div>

        {/* Funnels */}
        <div className="grid gap-4 lg:grid-cols-2">
          <FunnelChart title="Funil de Conversão" data={mockFunnelConversion} />
          <FunnelChart title="Funil de Vendas" data={mockFunnelSales} />
        </div>

        {/* Charts */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Visitas e Eventos — 30 dias</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={mockVisitsEvents30d}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 22%)" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(215, 20%, 65%)" }} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(215, 20%, 65%)" }} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(217, 33%, 17%)", border: "1px solid hsl(217, 33%, 22%)", borderRadius: 8, color: "hsl(210, 40%, 98%)" }} />
                  <Line type="monotone" dataKey="visitas" stroke="hsl(217, 91%, 60%)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="eventos" stroke="hsl(142, 71%, 45%)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Top 5 UTM Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={mockUtmSources.slice(0, 5)} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 22%)" />
                  <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(215, 20%, 65%)" }} />
                  <YAxis dataKey="source" type="category" tick={{ fontSize: 10, fill: "hsl(215, 20%, 65%)" }} width={70} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(217, 33%, 17%)", border: "1px solid hsl(217, 33%, 22%)", borderRadius: 8, color: "hsl(210, 40%, 98%)" }} />
                  <Bar dataKey="leads" fill="hsl(217, 91%, 60%)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Leads */}
        <Card>
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
                {mockLeads.slice(0, 10).map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{lead.name}</p>
                        <p className="text-xs text-muted-foreground">{lead.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={statusColors[lead.status]}>
                        {lead.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{lead.visits}</TableCell>
                    <TableCell>{lead.events}</TableCell>
                    <TableCell>{lead.source}</TableCell>
                    <TableCell className="text-xs">{lead.location}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(lead.lastVisit).toLocaleDateString("pt-BR")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
