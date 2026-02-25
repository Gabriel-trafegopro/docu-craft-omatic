import { DashboardLayout } from "@/components/DashboardLayout";
import { mockGeoData } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

const tooltipStyle = {
  backgroundColor: "hsl(220, 40%, 8%)", border: "1px solid hsl(220, 30%, 18%)",
  borderRadius: 10, color: "hsl(210, 40%, 98%)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
};

export default function GeoPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Análise Geográfica</h1>
          <p className="text-sm text-muted-foreground">Distribuição de leads por localização</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="card-glow">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Top Países</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={mockGeoData.countries}>
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
                <BarChart data={mockGeoData.states.slice(0, 5)}>
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

        <Card className="card-glow">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Detalhamento por Estado</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estado</TableHead>
                  <TableHead>Leads</TableHead>
                  <TableHead>Visitas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockGeoData.states.map((s) => (
                  <TableRow key={s.name} className="hover:bg-accent/50 transition-colors">
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell>{s.leads.toLocaleString("pt-BR")}</TableCell>
                    <TableCell>{s.visits.toLocaleString("pt-BR")}</TableCell>
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
