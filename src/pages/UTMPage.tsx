import { DashboardLayout } from "@/components/DashboardLayout";
import { useCompany } from "@/hooks/useCompany";
import { useUtmAnalysis } from "@/hooks/useSupabaseData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

const COLORS = [
  "hsl(25, 95%, 53%)", "hsl(142, 71%, 45%)", "hsl(217, 91%, 60%)",
  "hsl(280, 65%, 60%)", "hsl(0, 84%, 60%)", "hsl(199, 89%, 48%)",
  "hsl(160, 60%, 45%)", "hsl(45, 93%, 47%)", "hsl(300, 50%, 50%)", "hsl(20, 90%, 55%)",
];

const tooltipStyle = {
  backgroundColor: "hsl(220, 40%, 8%)", border: "1px solid hsl(220, 30%, 18%)",
  borderRadius: 10, color: "hsl(210, 40%, 98%)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
};
const tooltipItemStyle = { color: "hsl(210, 40%, 98%)" };
const tooltipLabelStyle = { color: "hsl(210, 40%, 98%)" };

export default function UTMPage() {
  const { companyId } = useCompany();
  const { data: utmData, isLoading } = useUtmAnalysis(companyId);

  const chartData = (utmData || []).slice(0, 10).map((u) => ({
    source: u.utm_source || "(direto)",
    leads: Number(u.unique_leads) || 0,
    visits: Number(u.total_visits) || 0,
  }));

  const totalLeads = chartData.reduce((sum, x) => sum + x.leads, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Análise de Origem (UTM)</h1>
          <p className="text-sm text-muted-foreground">Performance por fonte de tráfego e campanha</p>
        </div>

        {isLoading ? (
          <div className="grid gap-4 lg:grid-cols-2">{Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-80 rounded-xl" />)}</div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="card-glow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Visitas por Origem (UTM Source)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 30%, 14%)" />
                    <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(215, 20%, 45%)" }} />
                    <YAxis dataKey="source" type="category" tick={{ fontSize: 10, fill: "hsl(215, 20%, 45%)" }} width={70} />
                    <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} labelStyle={tooltipLabelStyle} />
                    <Bar dataKey="visits" radius={[0, 4, 4, 0]}>
                      {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="card-glow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Distribuição de Leads</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={chartData} dataKey="leads" nameKey="source" cx="50%" cy="50%" outerRadius={100} label={({ source, percent }) => `${source}: ${(percent * 100).toFixed(0)}%`} labelLine={true} fontSize={10}>
                      {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} labelStyle={tooltipLabelStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        <Card className="card-glow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Detalhamento por Origem</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Origem</TableHead>
                  <TableHead>Medium</TableHead>
                  <TableHead>Campanha</TableHead>
                  <TableHead>Visitas</TableHead>
                  <TableHead>Leads</TableHead>
                  <TableHead>Clientes</TableHead>
                  <TableHead>Conversão</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(utmData || []).map((s, i) => (
                  <TableRow key={i} className="hover:bg-accent/50 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span className="font-medium">{s.utm_source || "(direto)"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">{s.utm_medium || "-"}</TableCell>
                    <TableCell className="text-xs">{s.utm_campaign || "-"}</TableCell>
                    <TableCell>{Number(s.total_visits || 0).toLocaleString("pt-BR")}</TableCell>
                    <TableCell>{Number(s.unique_leads || 0).toLocaleString("pt-BR")}</TableCell>
                    <TableCell>{Number(s.total_customers || 0).toLocaleString("pt-BR")}</TableCell>
                    <TableCell>{s.conversion_rate ?? 0}%</TableCell>
                  </TableRow>
                ))}
                {(!utmData || utmData.length === 0) && (
                  <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">Sem dados UTM disponíveis.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
