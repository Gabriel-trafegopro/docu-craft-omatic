import { DashboardLayout } from "@/components/DashboardLayout";
import { KPICard } from "@/components/KPICard";
import { mockEventTypes, mockEventsTimeline, mockRecentEvents } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const eventBadgeColors: Record<string, string> = {
  page_view: "bg-primary/20 text-primary",
  button_click: "bg-success/20 text-success",
  form_submit: "bg-warning/20 text-warning",
  scroll_depth: "bg-chart-4/20 text-chart-4",
  video_play: "bg-destructive/20 text-destructive",
  download: "bg-chart-1/20 text-chart-1",
};

export default function EventsPage() {
  const totalEvents = mockEventTypes.reduce((sum, e) => sum + e.count, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Eventos</h1>
          <p className="text-sm text-muted-foreground">Rastreamento de ações dos usuários</p>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <KPICard title="Total de Eventos" value={totalEvents} icon={<Zap className="h-5 w-5" />} />
          <KPICard title="Tipos Únicos" value={mockEventTypes.length} icon={<Hash className="h-5 w-5" />} />
          <KPICard title="Páginas" value={8} icon={<FileText className="h-5 w-5" />} />
          <KPICard title="Leads com Eventos" value={2200} icon={<Users className="h-5 w-5" />} />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="card-glow">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Por Tipo de Evento</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={mockEventTypes} dataKey="count" nameKey="type" cx="50%" cy="50%" outerRadius={90} label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={9}>
                    {mockEventTypes.map((e, i) => <Cell key={i} fill={e.color} />)}
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
                <LineChart data={mockEventsTimeline}>
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

        <Card className="card-glow">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Eventos Recentes</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Página</TableHead>
                  <TableHead>Lead</TableHead>
                  <TableHead>Horário</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockRecentEvents.map((evt) => (
                  <TableRow key={evt.id} className="hover:bg-accent/50 transition-colors">
                    <TableCell>
                      <Badge variant="secondary" className={eventBadgeColors[evt.type] || ""}>{evt.type}</Badge>
                    </TableCell>
                    <TableCell className="text-xs">{evt.page}</TableCell>
                    <TableCell className="text-sm">{evt.leadName}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{new Date(evt.timestamp).toLocaleTimeString("pt-BR")}</TableCell>
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
