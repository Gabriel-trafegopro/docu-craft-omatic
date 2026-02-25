import { DashboardLayout } from "@/components/DashboardLayout";
import { KPICard } from "@/components/KPICard";
import { useCompany } from "@/hooks/useCompany";
import { useFunnel } from "@/hooks/useSupabaseData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Users, UserCheck } from "lucide-react";

const stageColors = [
  { bg: "bg-primary", border: "border-primary/30", text: "text-primary" },
  { bg: "bg-chart-2", border: "border-chart-2/30", text: "text-chart-2" },
  { bg: "bg-chart-3", border: "border-chart-3/30", text: "text-chart-3" },
  { bg: "bg-chart-4", border: "border-chart-4/30", text: "text-chart-4" },
  { bg: "bg-success", border: "border-success/30", text: "text-success" },
];

export default function FunnelPage() {
  const { companyId } = useCompany();
  const { data: funnel, isLoading } = useFunnel(companyId);

  const stages = funnel ? [
    { stage: "Visitantes", value: Number(funnel.total_visitors) || 0 },
    { stage: "Leads", value: Number(funnel.total_leads) || 0 },
    { stage: "Engajados", value: Number(funnel.total_engaged) || 0 },
    { stage: "Interessados", value: Number(funnel.total_interested) || 0 },
    { stage: "Clientes", value: Number(funnel.total_customers) || 0 },
  ] : [];

  const maxValue = stages[0]?.value || 1;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Funil de Conversão</h1>
          <p className="text-sm text-muted-foreground">Análise detalhada do funil</p>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)
          ) : (
            <>
              <KPICard title="Taxa de Conversão" value={`${funnel?.overall_conversion_rate ?? 0}%`} icon={<TrendingUp className="h-5 w-5" />} />
              <KPICard title="Visitantes" value={Number(funnel?.total_visitors) || 0} icon={<Users className="h-5 w-5" />} />
              <KPICard title="Clientes" value={Number(funnel?.total_customers) || 0} icon={<UserCheck className="h-5 w-5" />} />
            </>
          )}
        </div>

        <Card className="card-glow">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Funil Visual</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)
            ) : stages.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Sem dados de funil disponíveis.</p>
            ) : (
              stages.map((stage, idx) => {
                const color = stageColors[idx] || stageColors[0];
                const percentage = maxValue > 0 ? ((stage.value / maxValue) * 100).toFixed(1) : "0";
                return (
                  <div key={stage.stage} className="group cursor-pointer">
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="font-medium">{stage.stage}</span>
                      <span className="text-muted-foreground">
                        {stage.value.toLocaleString("pt-BR")} <span className="text-foreground font-semibold">({percentage}%)</span>
                      </span>
                    </div>
                    <div className="h-10 w-full overflow-hidden rounded-lg bg-muted/30 border border-border/50">
                      <div
                        className={`h-full ${color.bg} rounded-lg transition-all group-hover:opacity-80`}
                        style={{ width: `${percentage}%`, boxShadow: `0 0 16px hsl(var(--primary) / 0.15)` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
