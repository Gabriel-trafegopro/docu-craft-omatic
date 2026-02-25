import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FunnelStage {
  stage: string;
  value: number;
  color: string;
}

interface FunnelChartProps {
  title: string;
  data: FunnelStage[];
}

export function FunnelChart({ title, data }: FunnelChartProps) {
  const maxValue = data[0]?.value || 1;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {data.map((item, idx) => {
          const width = Math.max((item.value / maxValue) * 100, 8);
          const rate = idx > 0 ? ((item.value / data[idx - 1].value) * 100).toFixed(1) : "100";
          return (
            <div key={item.stage} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{item.stage}</span>
                <span className="font-medium text-foreground">
                  {item.value.toLocaleString("pt-BR")}
                  {idx > 0 && (
                    <span className="ml-1 text-muted-foreground">({rate}%)</span>
                  )}
                </span>
              </div>
              <div className="h-6 w-full overflow-hidden rounded bg-muted">
                <div
                  className="h-full rounded transition-all duration-500"
                  style={{ width: `${width}%`, backgroundColor: item.color }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
