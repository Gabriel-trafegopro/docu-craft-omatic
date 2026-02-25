import { DashboardLayout } from "@/components/DashboardLayout";
import { useCompany } from "@/hooks/useCompany";
import { useGeoAnalysis } from "@/hooks/useSupabaseData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { useMemo } from "react";

const tooltipStyle = {
  backgroundColor: "hsl(220, 40%, 8%)", border: "1px solid hsl(220, 30%, 18%)",
  borderRadius: 10, color: "hsl(210, 40%, 98%)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
};

export default function GeoPage() {
  const { companyId } = useCompany();
  const { data: geoData, isLoading } = useGeoAnalysis(companyId);

  const { countries, states } = useMemo(() => {
    const countryMap: Record<string, { leads: number; visits: number }> = {};
    const stateMap: Record<string, { leads: number; visits: number }> = {};
    (geoData || []).forEach((g) => {
      const c = g.country || "Desconhecido";
      const s = g.state || "Desconhecido";
      if (!countryMap[c]) countryMap[c] = { leads: 0, visits: 0 };
      countryMap[c].leads += Number(g.unique_leads) || 0;
      countryMap[c].visits += Number(g.total_visits) || 0;
      if (!stateMap[s]) stateMap[s] = { leads: 0, visits: 0 };
      stateMap[s].leads += Number(g.unique_leads) || 0;
      stateMap[s].visits += Number(g.total_visits) || 0;
    });
    return {
      countries: Object.entries(countryMap).map(([name, v]) => ({ name, ...v })).sort((a, b) => b.leads - a.leads),
      states: Object.entries(stateMap).map(([name, v]) => ({ name, ...v })).sort((a, b) => b.leads - a.leads),
    };
  }, [geoData]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Análise Geográfica</h1>
          <p className="text-sm text-muted-foreground">Distribuição de leads por localização</p>
        </div>

        {isLoading ? (
          <div className="grid gap-4 lg:grid-cols-2">{Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-64 rounded-xl" />)}</div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="card-glow">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Top Países</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={countries.slice(0, 5)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 30%, 14%)" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(215, 20%, 45%)" }} />
                    <YAxis tick={{ fontSize: 10, fill: "hsl(215, 20%, 45%)" }} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="leads" fill="hsl(25, 95%, 53%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="card-glow">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Top Estados</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={states.slice(0, 5)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 30%, 14%)" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(215, 20%, 45%)" }} />
                    <YAxis tick={{ fontSize: 10, fill: "hsl(215, 20%, 45%)" }} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="leads" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        <Card className="card-glow">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Detalhamento por Localização</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>País</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Cidade</TableHead>
                  <TableHead>Leads</TableHead>
                  <TableHead>Visitas</TableHead>
                  <TableHead>Clientes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(geoData || []).map((g, i) => (
                  <TableRow key={i} className="hover:bg-accent/50 transition-colors">
                    <TableCell className="font-medium">{g.country || "-"}</TableCell>
                    <TableCell>{g.state || "-"}</TableCell>
                    <TableCell>{g.city || "-"}</TableCell>
                    <TableCell>{Number(g.unique_leads || 0).toLocaleString("pt-BR")}</TableCell>
                    <TableCell>{Number(g.total_visits || 0).toLocaleString("pt-BR")}</TableCell>
                    <TableCell>{Number(g.total_customers || 0).toLocaleString("pt-BR")}</TableCell>
                  </TableRow>
                ))}
                {(!geoData || geoData.length === 0) && (
                  <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Sem dados geográficos disponíveis.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
