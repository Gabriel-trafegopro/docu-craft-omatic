import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { AppSidebar } from "@/components/AppSidebar";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import { Copy, Plus, Pencil, Building2, Key, Hash, Globe, Shield, Users, Eye, ChevronDown, ChevronUp } from "lucide-react";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const companySchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres").max(100),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/, "Apenas letras minúsculas, números e hífens"),
  primary_domain: z.string().optional().default(""),
  plan: z.enum(["free", "pro", "enterprise"]).default("free"),
  max_leads: z.number().positive().default(500),
  max_visits: z.number().positive().default(5000),
  logo_url: z.string().optional().default(""),
});

type CompanyForm = z.infer<typeof companySchema>;

interface Company {
  id: number;
  name: string;
  slug: string;
  primary_domain: string | null;
  plan: string | null;
  max_leads: number | null;
  max_visits: number | null;
  is_active: boolean | null;
  webhook_secret: string | null;
  logo_url: string | null;
  created_at: string | null;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function CompaniesPage() {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [form, setForm] = useState<CompanyForm>({
    name: "", slug: "", primary_domain: "", plan: "free",
    max_leads: 500, max_visits: 5000, logo_url: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: companies = [], isLoading } = useQuery({
    queryKey: ["admin-companies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Company[];
    },
  });

  const mutation = useMutation({
    mutationFn: async (payload: { action: string; body: Record<string, unknown> }) => {
      const { data, error } = await supabase.functions.invoke("manage-company", {
        body: { action: payload.action, ...payload.body },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-companies"] });
      queryClient.invalidateQueries({ queryKey: ["user-companies"] });
      setDialogOpen(false);
      setEditingCompany(null);
      toast({ title: editingCompany ? "Empresa atualizada!" : "Empresa criada!" });
    },
    onError: (err: Error) => {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    },
  });

  const openCreate = () => {
    setEditingCompany(null);
    setForm({ name: "", slug: "", primary_domain: "", plan: "free", max_leads: 500, max_visits: 5000, logo_url: "" });
    setErrors({});
    setDialogOpen(true);
  };

  const openEdit = (c: Company) => {
    setEditingCompany(c);
    setForm({
      name: c.name,
      slug: c.slug,
      primary_domain: c.primary_domain || "",
      plan: (c.plan as "free" | "pro" | "enterprise") || "free",
      max_leads: c.max_leads || 500,
      max_visits: c.max_visits || 5000,
      logo_url: c.logo_url || "",
    });
    setErrors({});
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    const result = companySchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((e) => { fieldErrors[e.path[0] as string] = e.message; });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    const clean = {
      ...result.data,
      primary_domain: result.data.primary_domain || null,
      logo_url: result.data.logo_url || null,
    };
    if (editingCompany) {
      mutation.mutate({ action: "update", body: { id: editingCompany.id, ...clean } });
    } else {
      mutation.mutate({ action: "create", body: clean });
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: `${label} copiado!` });
  };

  const planColors: Record<string, string> = {
    free: "bg-muted text-muted-foreground",
    pro: "bg-primary/15 text-primary",
    enterprise: "bg-accent text-accent-foreground",
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 ml-[220px] p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Empresas</h1>
            <p className="text-sm text-muted-foreground">Gerencie suas empresas e configurações de tracker</p>
          </div>
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4 mr-2" /> Nova Empresa
          </Button>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader><div className="h-5 w-32 bg-muted rounded" /></CardHeader>
                <CardContent><div className="h-4 w-48 bg-muted rounded" /></CardContent>
              </Card>
            ))}
          </div>
        ) : companies.length === 0 ? (
          <Card className="py-12 text-center">
            <CardContent>
              <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium text-foreground mb-1">Nenhuma empresa cadastrada</p>
              <p className="text-sm text-muted-foreground mb-4">Comece cadastrando a primeira empresa para configurar o tracker.</p>
              <Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" /> Nova Empresa</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {companies.map((c) => (
              <Card key={c.id} className="flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-base">{c.name}</CardTitle>
                      <CardDescription className="text-xs font-mono">{c.slug}</CardDescription>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className={planColors[c.plan || "free"]}>
                        {c.plan || "free"}
                      </Badge>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(c)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 space-y-3 text-xs">
                  {c.primary_domain && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Globe className="h-3.5 w-3.5" /> {c.primary_domain}
                    </div>
                  )}
                  <div className="flex gap-4 text-muted-foreground">
                    <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {c.max_leads} leads</span>
                    <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {c.max_visits} visitas</span>
                  </div>
                  <Badge variant={c.is_active ? "default" : "secondary"} className="text-[10px]">
                    {c.is_active ? "Ativo" : "Inativo"}
                  </Badge>

                  {/* Integration Panel */}
                  <button
                    onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}
                    className="flex items-center gap-1 text-xs font-medium text-primary hover:underline mt-2"
                  >
                    <Shield className="h-3.5 w-3.5" />
                    Configuração do Tracker
                    {expandedId === c.id ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  </button>

                  {expandedId === c.id && (
                    <div className="space-y-2 rounded-lg border border-border bg-muted/50 p-3 mt-1">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-muted-foreground"><Hash className="h-3 w-3" /> Company ID</span>
                        <button onClick={() => copyToClipboard(String(c.id), "Company ID")} className="flex items-center gap-1 font-mono text-foreground hover:text-primary">
                          {c.id} <Copy className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-muted-foreground"><Key className="h-3 w-3" /> Webhook Secret</span>
                        <button onClick={() => copyToClipboard(c.webhook_secret || "", "Webhook Secret")} className="flex items-center gap-1 font-mono text-foreground hover:text-primary truncate max-w-[140px]">
                          {c.webhook_secret ? `${c.webhook_secret.slice(0, 8)}...` : "—"} <Copy className="h-3 w-3" />
                        </button>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        Use o Company ID e o Webhook Secret para configurar o script de tracking no site do cliente.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Create / Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingCompany ? "Editar Empresa" : "Nova Empresa"}</DialogTitle>
              <DialogDescription>
                {editingCompany ? "Atualize os dados da empresa." : "Preencha os dados para cadastrar uma nova empresa."}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name" value={form.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setForm((f) => ({ ...f, name, slug: editingCompany ? f.slug : slugify(name) }));
                  }}
                  placeholder="Nome da empresa"
                />
                {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
              </div>

              <div>
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug" value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  placeholder="nome-da-empresa"
                />
                {errors.slug && <p className="text-xs text-destructive mt-1">{errors.slug}</p>}
              </div>

              <div>
                <Label htmlFor="domain">Domínio principal</Label>
                <Input
                  id="domain" value={form.primary_domain}
                  onChange={(e) => setForm((f) => ({ ...f, primary_domain: e.target.value }))}
                  placeholder="exemplo.com.br"
                />
              </div>

              <div>
                <Label>Plano</Label>
                <Select value={form.plan} onValueChange={(v) => setForm((f) => ({ ...f, plan: v as "free" | "pro" | "enterprise" }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="pro">Pro</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="max_leads">Max Leads</Label>
                  <Input
                    id="max_leads" type="number" value={form.max_leads}
                    onChange={(e) => setForm((f) => ({ ...f, max_leads: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="max_visits">Max Visitas</Label>
                  <Input
                    id="max_visits" type="number" value={form.max_visits}
                    onChange={(e) => setForm((f) => ({ ...f, max_visits: Number(e.target.value) }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="logo_url">Logo URL</Label>
                <Input
                  id="logo_url" value={form.logo_url}
                  onChange={(e) => setForm((f) => ({ ...f, logo_url: e.target.value }))}
                  placeholder="https://..."
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleSubmit} disabled={mutation.isPending}>
                {mutation.isPending ? "Salvando..." : editingCompany ? "Salvar" : "Criar Empresa"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
