import { DashboardLayout } from "@/components/DashboardLayout";
import { mockTemporalData, mockHeatmapData } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const tooltipStyle = { backgroundColor: "hsl(217, 33%, 17%)", border: "1px solid hsl(217, 33%, 22%)", borderRadius: 8, color: "hsl(210, 40%, 98%)" };
const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export default function TemporalPage() {
  // Build heatmap grid
  const heatmapGrid: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0));
  mockHeatmapData.forEach((d) => { heatmapGrid[d.day][d.hour] = d.value; });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Análise Temporal</h1>
          <p className="text-sm text-muted-foreground">Padrões de atividade ao longo do tempo</p>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Visitas, Eventos e Conversões — 30 dias</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={mockTemporalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 22%)" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(215, 20%, 65%)" }} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(215, 20%, 65%)" }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="visitas" stroke="hsl(217, 91%, 60%)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="eventos" stroke="hsl(142, 71%, 45%)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="conversoes" stroke="hsl(38, 92%, 50%)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Heatmap de Atividade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="min-w-[700px]">
                {/* Hours header */}
                <div className="flex mb-1">
                  <div className="w-10" />
                  {Array.from({ length: 24 }, (_, h) => (
                    <div key={h} className="flex-1 text-center text-[9px] text-muted-foreground">{h}</div>
                  ))}
                </div>
                {/* Rows */}
                {heatmapGrid.map((row, dayIdx) => (
                  <div key={dayIdx} className="flex items-center mb-0.5">
                    <div className="w-10 text-xs text-muted-foreground">{days[dayIdx]}</div>
                    {row.map((val, hourIdx) => {
                      const opacity = Math.max(0.1, val / 100);
                      return (
                        <div
                          key={hourIdx}
                          className="flex-1 mx-px aspect-square rounded-sm"
                          style={{ backgroundColor: `hsl(217, 91%, 60%, ${opacity})` }}
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
