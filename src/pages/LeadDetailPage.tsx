import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useLeadDetail } from "@/hooks/useSupabaseData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Eye, Zap, Globe, Calendar, MapPin, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";

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

export default function LeadDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const leadId = id ? Number(id) : null;
  const { lead: leadQuery, visits: visitsQuery, events: eventsQuery } = useLeadDetail(leadId);
  const lead = leadQuery.data;

  if (leadQuery.isLoading) {
    return <DashboardLayout><div className="space-y-4 p-6">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}</div></DashboardLayout>;
  }

  if (!lead) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-muted-foreground">Lead não encontrado</p>
          <Button variant="ghost" onClick={() => navigate("/leads")} className="mt-4">Voltar</Button>
        </div>
      </DashboardLayout>
    );
  }

  const status = getStatus(lead);
  const visits = visitsQuery.data || [];
  const events = eventsQuery.data || [];

  // Build timeline from visits + events
  const timeline = [
    ...visits.map((v) => ({ date: v.visit_datetime, type: "visit" as const, desc: `Visitou ${v.page_title || v.page_url || v.page_path || "/"}`, detail: [v.city, v.country].filter(Boolean).join(", ") })),
    ...events.map((e) => ({ date: e.event_datetime, type: "event" as const, desc: `${e.event_type}: ${e.event_name || e.element_text || "-"}`, detail: e.page_url || "" })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 50);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Button variant="ghost" size="sm" onClick={() => navigate("/leads")} className="gap-1 text-muted-foreground">
          <ArrowLeft className="h-4 w-4" /> Voltar para Leads
        </Button>

        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/20 text-xl font-bold text-primary">
            {(lead.name || lead.external_user_id || "?").charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{lead.name || lead.external_user_id}</h1>
              <Badge variant="secondary" className={statusColors[status]}>{status}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{lead.email || "-"}</p>
            {lead.whatsapp && <p className="text-xs text-muted-foreground">WhatsApp: {lead.whatsapp}</p>}
            <p className="text-xs text-muted-foreground">{[lead.last_city, lead.last_country].filter(Boolean).join(", ") || "-"}</p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-4">
          <Card><CardContent className="flex items-center gap-3 p-4"><Eye className="h-4 w-4 text-primary" /><div><p className="text-xs text-muted-foreground">Visitas</p><p className="text-lg font-bold">{lead.total_visits || 0}</p></div></CardContent></Card>
          <Card><CardContent className="flex items-center gap-3 p-4"><Zap className="h-4 w-4 text-success" /><div><p className="text-xs text-muted-foreground">Eventos</p><p className="text-lg font-bold">{lead.total_events || 0}</p></div></CardContent></Card>
          <Card><CardContent className="flex items-center gap-3 p-4"><Globe className="h-4 w-4 text-warning" /><div><p className="text-xs text-muted-foreground">UTM Sources</p><p className="text-lg font-bold">{lead.utm_sources_count || 0}</p></div></CardContent></Card>
          <Card><CardContent className="flex items-center gap-3 p-4"><MapPin className="h-4 w-4 text-chart-4" /><div><p className="text-xs text-muted-foreground">Cidades</p><p className="text-lg font-bold">{lead.cities_visited || 0}</p></div></CardContent></Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card><CardContent className="flex items-center gap-3 p-4"><Hash className="h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Páginas visitadas</p><p className="text-lg font-bold">{lead.pages_visited || 0}</p></div></CardContent></Card>
          <Card><CardContent className="flex items-center gap-3 p-4"><Calendar className="h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Primeiro acesso</p><p className="text-sm font-medium">{lead.first_visit_at ? new Date(lead.first_visit_at).toLocaleDateString("pt-BR") : "-"}</p></div></CardContent></Card>
          <Card><CardContent className="flex items-center gap-3 p-4"><Calendar className="h-4 w-4 text-primary" /><div><p className="text-xs text-muted-foreground">Último acesso</p><p className="text-sm font-medium">{lead.last_visit_at ? new Date(lead.last_visit_at).toLocaleDateString("pt-BR") : "-"}</p></div></CardContent></Card>
        </div>

        <Tabs defaultValue="timeline">
          <TabsList>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="visits">Visitas ({visits.length})</TabsTrigger>
            <TabsTrigger value="events">Eventos ({events.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="timeline" className="mt-4">
            <Card>
              <CardContent className="p-6">
                {timeline.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">Nenhuma atividade registrada.</p>
                ) : (
                  <div className="space-y-4">
                    {timeline.map((item, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`h-3 w-3 rounded-full ${item.type === "event" ? "bg-success" : "bg-primary"}`} />
                          {i < timeline.length - 1 && <div className="w-px flex-1 bg-border" />}
                        </div>
                        <div className="pb-4">
                          <p className="text-sm font-medium">{item.desc}</p>
                          {item.detail && <p className="text-xs text-muted-foreground">{item.detail}</p>}
                          <p className="text-xs text-muted-foreground">{new Date(item.date).toLocaleString("pt-BR")}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="visits" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Página</TableHead>
                      <TableHead>Título</TableHead>
                      <TableHead>UTM Source</TableHead>
                      <TableHead>Cidade</TableHead>
                      <TableHead>Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visits.map((v) => (
                      <TableRow key={v.id} className="hover:bg-accent/50">
                        <TableCell className="text-xs font-mono max-w-[200px] truncate">{v.page_url || v.page_path}</TableCell>
                        <TableCell className="text-xs">{v.page_title || "-"}</TableCell>
                        <TableCell className="text-xs">{v.utm_source || "-"}</TableCell>
                        <TableCell className="text-xs">{[v.city, v.country].filter(Boolean).join(", ") || "-"}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{new Date(v.visit_datetime).toLocaleString("pt-BR")}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Página</TableHead>
                      <TableHead>Elemento</TableHead>
                      <TableHead>Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.map((e) => (
                      <TableRow key={e.id} className="hover:bg-accent/50">
                        <TableCell><Badge variant="secondary">{e.event_type}</Badge></TableCell>
                        <TableCell className="text-xs">{e.event_name || "-"}</TableCell>
                        <TableCell className="text-xs font-mono max-w-[200px] truncate">{e.page_url || "-"}</TableCell>
                        <TableCell className="text-xs">{e.element_text || "-"}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{new Date(e.event_datetime).toLocaleString("pt-BR")}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
