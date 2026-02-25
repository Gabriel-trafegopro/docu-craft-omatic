import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { mockLeads } from "@/data/mockData";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Search, Users, Download, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const statusColors: Record<string, string> = {
  lead: "bg-primary/20 text-primary",
  cliente: "bg-success/20 text-success",
  identificado: "bg-warning/20 text-warning",
};

const PAGE_SIZE = 20;

export default function LeadsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(0);
  const navigate = useNavigate();

  const filtered = mockLeads.filter((l) => {
    const matchSearch = !search || l.name.toLowerCase().includes(search.toLowerCase()) || l.email.toLowerCase().includes(search.toLowerCase()) || l.id.includes(search);
    const matchStatus = statusFilter === "all" || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Leads</h1>
            <p className="text-sm text-muted-foreground">Gerencie e analise todos os leads capturados</p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary">
            <Users className="h-3.5 w-3.5" />
            {filtered.length} leads
          </div>
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar por nome, email ou ID..." className="pl-9 bg-card border-border" value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} />
          </div>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(0); }}>
            <SelectTrigger className="w-32 bg-card border-border">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="lead">Lead</SelectItem>
              <SelectItem value="cliente">Cliente</SelectItem>
              <SelectItem value="identificado">Identificado</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="20">
            <SelectTrigger className="w-32 bg-card border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="20">20 por pág.</SelectItem>
              <SelectItem value="50">50 por pág.</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="gap-1.5 border-border">
            <Download className="h-3.5 w-3.5" /> Exportar
          </Button>
        </div>

        <Card className="card-glow">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lead</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Visitas</TableHead>
                  <TableHead>Eventos</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Origem</TableHead>
                  <TableHead>Última Visita</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((lead) => (
                  <TableRow key={lead.id} className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => navigate(`/leads/${lead.id}`)}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{lead.name}</p>
                        <p className="text-[11px] text-muted-foreground font-mono">{lead.id}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">-</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={statusColors[lead.status]}>{lead.status}</Badge>
                    </TableCell>
                    <TableCell className="font-semibold">{lead.visits}</TableCell>
                    <TableCell className="font-semibold">{lead.events}</TableCell>
                    <TableCell>
                      <div className="text-xs">
                        <p>{lead.city.toLowerCase()}</p>
                        <p className="text-muted-foreground">{lead.state.toLowerCase()}, br</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">{lead.source}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{new Date(lead.lastVisit).toLocaleDateString("pt-BR")}</TableCell>
                    <TableCell>
                      <Eye className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setPage(i)} className={`h-8 w-8 rounded-lg text-sm font-medium transition-colors ${page === i ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"}`}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
