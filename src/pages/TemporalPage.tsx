import { DashboardLayout } from "@/components/DashboardLayout";
import { mockTemporalData, mockHeatmapData } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const tooltipStyle = {
  backgroundColor: "hsl(220, 40%, 8%)", border: "1px solid hsl(220, 30%, 18%)",
  borderRadius: 10, color: "hsl(210, 40%, 98%)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
};
const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export default function TemporalPage() {
  const heatmapGrid: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0));
  mockHeatmapData.forEach((d) => { heatmapGrid[d.day][d.hour] = d.value; });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Análise Temporal</h1>
          <p className="text-sm text-muted-foreground">Padrões de atividade ao longo do tempo</p>
        </div>

        <Card className="card-glow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Visitas, Eventos e Conversões — 30 dias</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={mockTemporalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 30%, 14%)" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(215, 20%, 45%)" }} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(215, 20%, 45%)" }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="visitas" stroke="hsl(25, 95%, 53%)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="eventos" stroke="hsl(142, 71%, 45%)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="conversoes" stroke="hsl(38, 92%, 50%)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="card-glow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Heatmap de Atividade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="min-w-[700px]">
                <div className="flex mb-1">
                  <div className="w-10" />
                  {Array.from({ length: 24 }, (_, h) => (
                    <div key={h} className="flex-1 text-center text-[9px] text-muted-foreground">{h}</div>
                  ))}
                </div>
                {heatmapGrid.map((row, dayIdx) => (
                  <div key={dayIdx} className="flex items-center mb-0.5">
                    <div className="w-10 text-xs text-muted-foreground">{days[dayIdx]}</div>
                    {row.map((val, hourIdx) => {
                      const opacity = Math.max(0.08, val / 100);
                      return (
                        <div
                          key={hourIdx}
                          className="flex-1 mx-px aspect-square rounded-sm"
                          style={{ backgroundColor: `hsl(25, 95%, 53%, ${opacity})` }}
                          title={`${days[dayIdx]} ${hourIdx}h: ${val}`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
