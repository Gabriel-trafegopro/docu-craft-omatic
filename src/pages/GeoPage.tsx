import { DashboardLayout } from "@/components/DashboardLayout";
import { mockGeoData } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

const tooltipStyle = { backgroundColor: "hsl(217, 33%, 17%)", border: "1px solid hsl(217, 33%, 22%)", borderRadius: 8, color: "hsl(210, 40%, 98%)" };

export default function GeoPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Análise Geográfica</h1>
          <p className="text-sm text-muted-foreground">Distribuição de leads por localização</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Top Países</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={mockGeoData.countries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 22%)" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(215, 20%, 65%)" }} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(215, 20%, 65%)" }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="leads" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Top Estados</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={mockGeoData.states.slice(0, 5)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 22%)" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(215, 20%, 65%)" }} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(215, 20%, 65%)" }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="leads" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
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
                  <TableRow key={s.name}>
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
