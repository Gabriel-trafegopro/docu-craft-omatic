import { DashboardLayout } from "@/components/DashboardLayout";
import { KPICard } from "@/components/KPICard";
import { mockFunnelDetailed } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, UserCheck, Clock } from "lucide-react";

export default function FunnelPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Funil de Conversão</h1>
          <p className="text-sm text-muted-foreground">Análise detalhada do funil</p>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <KPICard title="Taxa de Conversão" value="1.9%" icon={<TrendingUp className="h-5 w-5" />} />
          <KPICard title="Visitantes" value={18432} icon={<Users className="h-5 w-5" />} />
          <KPICard title="Clientes" value={342} icon={<UserCheck className="h-5 w-5" />} />
          <KPICard title="Tempo Médio" value="12 dias" icon={<Clock className="h-5 w-5" />} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Funil Visual</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {mockFunnelDetailed.map((stage, idx) => {
              const colors = ["bg-primary", "bg-chart-2", "bg-chart-3", "bg-chart-4", "bg-success"];
              return (
                <div key={stage.stage} className="group cursor-pointer">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium">{stage.stage}</span>
                    <span className="text-muted-foreground">
                      {stage.value.toLocaleString("pt-BR")} ({stage.percentage}%)
                    </span>
                  </div>
                  <div className="h-10 w-full overflow-hidden rounded-md bg-muted">
                    <div
                      className={`h-full ${colors[idx]} rounded-md transition-all group-hover:opacity-80`}
                      style={{ width: `${stage.percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
