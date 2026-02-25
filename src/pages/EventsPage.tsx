import { useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { KPICard } from "@/components/KPICard";
import { useCompany } from "@/hooks/useCompany";
import { useEvents } from "@/hooks/useSupabaseData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Zap, Hash, FileText, Users } from "lucide-react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
} from "recharts";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const tooltipStyle = {
  backgroundColor: "hsl(220, 40%, 8%)", border: "1px solid hsl(220, 30%, 18%)",
  borderRadius: 10, color: "hsl(210, 40%, 98%)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
};

const PIE_COLORS = [
  "hsl(25, 95%, 53%)", "hsl(142, 71%, 45%)", "hsl(217, 91%, 60%)",
  "hsl(280, 65%, 60%)", "hsl(0, 84%, 60%)", "hsl(45, 93%, 47%)",
];

export default function EventsPage() {
  const { companyId } = useCompany();
  const { data: events, isLoading } = useEvents(companyId);

  const { typeData, timelineData, uniqueTypes, uniquePages, uniqueLeads } = useMemo(() => {
    const evts = events || [];
    const typeMap: Record<string, number> = {};
    const dateMap: Record<string, number> = {};
    const pages = new Set<string>();
    const leadIds = new Set<number>();

    evts.forEach((e) => {
      typeMap[e.event_type] = (typeMap[e.event_type] || 0) + 1;
      const d = e.event_datetime?.slice(0, 10) || "";
      dateMap[d] = (dateMap[d] || 0) + 1;
      if (e.page_path) pages.add(e.page_path);
      leadIds.add(e.lead_id);
    });

    return {
      typeData: Object.entries(typeMap).map(([type, count]) => ({ type, count })).sort((a, b) => b.count - a.count),
      timelineData: Object.entries(dateMap).sort().map(([date, eventos]) => ({ date: date.slice(5), eventos })),
      uniqueTypes: Object.keys(typeMap).length,
      uniquePages: pages.size,
      uniqueLeads: leadIds.size,
    };
  }, [events]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Eventos</h1>
          <p className="text-sm text-muted-foreground">Rastreamento de ações dos usuários</p>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)
          ) : (
            <>
              <KPICard title="Total de Eventos" value={(events || []).length} icon={<Zap className="h-5 w-5" />} />
              <KPICard title="Tipos Únicos" value={uniqueTypes} icon={<Hash className="h-5 w-5" />} />
              <KPICard title="Páginas" value={uniquePages} icon={<FileText className="h-5 w-5" />} />
              <KPICard title="Leads com Eventos" value={uniqueLeads} icon={<Users className="h-5 w-5" />} />
            </>
          )}
        </div>

        {isLoading ? (
          <Skeleton className="h-72 rounded-xl" />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="card-glow">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Por Tipo de Evento</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={typeData} dataKey="count" nameKey="type" cx="50%" cy="50%" outerRadius={90} label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={9}>
                      {typeData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="card-glow">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Eventos ao Longo do Tempo</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 30%, 14%)" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(215, 20%, 45%)" }} />
                    <YAxis tick={{ fontSize: 10, fill: "hsl(215, 20%, 45%)" }} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Line type="monotone" dataKey="eventos" stroke="hsl(142, 71%, 45%)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        <Card className="card-glow">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Eventos Recentes</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Página</TableHead>
                  <TableHead>Elemento</TableHead>
                  <TableHead>Horário</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(events || []).slice(0, 30).map((evt) => (
                  <TableRow key={evt.id} className="hover:bg-accent/50 transition-colors">
                    <TableCell><Badge variant="secondary">{evt.event_type}</Badge></TableCell>
                    <TableCell className="text-xs">{evt.event_name || "-"}</TableCell>
                    <TableCell className="text-xs font-mono max-w-[200px] truncate">{evt.page_url || "-"}</TableCell>
                    <TableCell className="text-xs">{evt.element_text || "-"}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{new Date(evt.event_datetime).toLocaleString("pt-BR")}</TableCell>
                  </TableRow>
                ))}
                {(!events || events.length === 0) && (
                  <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Nenhum evento registrado.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
