import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { mockLeads } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Eye, Zap, Globe, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const statusColors: Record<string, string> = {
  lead: "bg-primary/20 text-primary",
  cliente: "bg-success/20 text-success",
  identificado: "bg-warning/20 text-warning",
};

export default function LeadDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const lead = mockLeads.find((l) => l.id === id);

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

  const mockTimeline = [
    { date: lead.lastVisit, type: "visit", desc: `Visitou /pricing` },
    { date: new Date(new Date(lead.lastVisit).getTime() - 3600000).toISOString(), type: "event", desc: "Clicou em 'Ver planos'" },
    { date: new Date(new Date(lead.lastVisit).getTime() - 7200000).toISOString(), type: "visit", desc: "Visitou /home" },
    { date: lead.createdAt, type: "created", desc: "Lead criado" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Button variant="ghost" size="sm" onClick={() => navigate("/leads")} className="gap-1 text-muted-foreground">
          <ArrowLeft className="h-4 w-4" /> Voltar para Leads
        </Button>

        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/20 text-xl font-bold text-primary">
            {lead.name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{lead.name}</h1>
              <Badge variant="secondary" className={statusColors[lead.status]}>{lead.status}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{lead.email}</p>
            <p className="text-xs text-muted-foreground">{lead.location}, {lead.country}</p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-4">
          <Card><CardContent className="flex items-center gap-3 p-4"><Eye className="h-4 w-4 text-primary" /><div><p className="text-xs text-muted-foreground">Visitas</p><p className="text-lg font-bold">{lead.visits}</p></div></CardContent></Card>
          <Card><CardContent className="flex items-center gap-3 p-4"><Zap className="h-4 w-4 text-success" /><div><p className="text-xs text-muted-foreground">Eventos</p><p className="text-lg font-bold">{lead.events}</p></div></CardContent></Card>
          <Card><CardContent className="flex items-center gap-3 p-4"><Globe className="h-4 w-4 text-warning" /><div><p className="text-xs text-muted-foreground">Origem</p><p className="text-lg font-bold">{lead.source}</p></div></CardContent></Card>
          <Card><CardContent className="flex items-center gap-3 p-4"><Calendar className="h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Primeiro acesso</p><p className="text-sm font-medium">{new Date(lead.createdAt).toLocaleDateString("pt-BR")}</p></div></CardContent></Card>
        </div>

        <Tabs defaultValue="timeline">
          <TabsList>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="visits">Visitas</TabsTrigger>
            <TabsTrigger value="events">Eventos</TabsTrigger>
          </TabsList>
          <TabsContent value="timeline" className="mt-4">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {mockTimeline.map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`h-3 w-3 rounded-full ${item.type === "event" ? "bg-success" : item.type === "created" ? "bg-warning" : "bg-primary"}`} />
                        {i < mockTimeline.length - 1 && <div className="w-px flex-1 bg-border" />}
                      </div>
                      <div className="pb-4">
                        <p className="text-sm font-medium">{item.desc}</p>
                        <p className="text-xs text-muted-foreground">{new Date(item.date).toLocaleString("pt-BR")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="visits" className="mt-4">
            <Card><CardContent className="p-6 text-sm text-muted-foreground">Detalhes de visitas serão carregados com Supabase.</CardContent></Card>
          </TabsContent>
          <TabsContent value="events" className="mt-4">
            <Card><CardContent className="p-6 text-sm text-muted-foreground">Detalhes de eventos serão carregados com Supabase.</CardContent></Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
