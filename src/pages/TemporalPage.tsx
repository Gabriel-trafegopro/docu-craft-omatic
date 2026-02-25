import { useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useCompany } from "@/hooks/useCompany";
import { useVisits, useEvents } from "@/hooks/useSupabaseData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const tooltipStyle = {
  backgroundColor: "hsl(220, 40%, 8%)", border: "1px solid hsl(220, 30%, 18%)",
  borderRadius: 10, color: "hsl(210, 40%, 98%)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
};
const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export default function TemporalPage() {
  const { companyId } = useCompany();
  const { data: visits, isLoading: visitsLoading } = useVisits(companyId);
  const { data: events, isLoading: eventsLoading } = useEvents(companyId);
  const isLoading = visitsLoading || eventsLoading;

  const { timelineData, heatmapGrid } = useMemo(() => {
    const visitsByDate: Record<string, number> = {};
    const eventsByDate: Record<string, number> = {};
    const grid: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0));

    (visits || []).forEach((v) => {
      const d = v.visit_date || v.visit_datetime?.slice(0, 10) || "";
      visitsByDate[d] = (visitsByDate[d] || 0) + 1;
      const dt = new Date(v.visit_datetime);
      grid[dt.getDay()][dt.getHours()] += 1;
    });

    (events || []).forEach((e) => {
      const d = e.event_datetime?.slice(0, 10) || "";
      eventsByDate[d] = (eventsByDate[d] || 0) + 1;
    });

    const allDates = new Set([...Object.keys(visitsByDate), ...Object.keys(eventsByDate)]);
    const timeline = Array.from(allDates).sort().map((date) => ({
      date: date.slice(5),
      visitas: visitsByDate[date] || 0,
      eventos: eventsByDate[date] || 0,
    }));

    return { timelineData: timeline, heatmapGrid: grid };
  }, [visits, events]);

  const maxHeatVal = Math.max(1, ...heatmapGrid.flat());

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Análise Temporal</h1>
          <p className="text-sm text-muted-foreground">Padrões de atividade ao longo do tempo</p>
        </div>

        <Card className="card-glow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Visitas e Eventos — Últimos dias</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-[280px]" /> : (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 30%, 14%)" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(215, 20%, 45%)" }} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(215, 20%, 45%)" }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line type="monotone" dataKey="visitas" stroke="hsl(25, 95%, 53%)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="eventos" stroke="hsl(142, 71%, 45%)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="card-glow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Heatmap de Atividade</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-[200px]" /> : (
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
                        const opacity = Math.max(0.08, val / maxHeatVal);
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
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
