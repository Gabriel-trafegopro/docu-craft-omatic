import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FunnelStage {
  stage: string;
  value: number;
  color: string;
}

interface FunnelChartProps {
  title: string;
  subtitle?: string;
  data: FunnelStage[];
  variant?: "bars" | "3d";
}

function Funnel3D({ data }: { data: FunnelStage[] }) {
  const maxValue = data[0]?.value || 1;
  const stageHeight = 70;
  const totalHeight = data.length * stageHeight + 40;
  const centerX = 200;
  const maxWidth = 180;
  const minWidth = 50;

  return (
    <svg viewBox={`0 0 400 ${totalHeight}`} className="w-full max-w-[420px] mx-auto" style={{ filter: "drop-shadow(0 4px 20px rgba(0,0,0,0.3))" }}>
      <defs>
        {/* Gradient for each stage */}
        {data.map((item, idx) => {
          const ratio = 1 - idx / (data.length - 1);
          return (
            <linearGradient key={`grad-${idx}`} id={`funnel-grad-${idx}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={item.color} stopOpacity={0.9} />
              <stop offset="100%" stopColor={item.color} stopOpacity={0.5} />
            </linearGradient>
          );
        })}
        {/* Glow filter */}
        <filter id="funnel-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Top ellipse gradient */}
        <radialGradient id="top-ellipse-grad">
          <stop offset="0%" stopColor="hsl(25, 95%, 53%)" stopOpacity="0.8" />
          <stop offset="70%" stopColor="hsl(25, 95%, 40%)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="hsl(25, 95%, 30%)" stopOpacity="0.3" />
        </radialGradient>
      </defs>

      {/* Top ellipse (3D rim) */}
      <ellipse cx={centerX} cy={20} rx={maxWidth} ry={16} fill="url(#top-ellipse-grad)" filter="url(#funnel-glow)" />

      {/* Funnel segments */}
      {data.map((item, idx) => {
        const topY = 20 + idx * stageHeight;
        const bottomY = 20 + (idx + 1) * stageHeight;
        const topWidth = maxWidth - (idx / data.length) * (maxWidth - minWidth);
        const bottomWidth = maxWidth - ((idx + 1) / data.length) * (maxWidth - minWidth);
        const rate = idx > 0 ? ((item.value / data[idx - 1].value) * 100).toFixed(1) : "100";

        return (
          <g key={item.stage}>
            {/* Trapezoid body */}
            <path
              d={`M${centerX - topWidth},${topY} L${centerX + topWidth},${topY} L${centerX + bottomWidth},${bottomY} L${centerX - bottomWidth},${bottomY} Z`}
              fill={`url(#funnel-grad-${idx})`}
              stroke={item.color}
              strokeWidth="0.5"
              strokeOpacity="0.4"
              opacity="0.85"
            />
            {/* Right side highlight for 3D effect */}
            <path
              d={`M${centerX},${topY} L${centerX + topWidth},${topY} L${centerX + bottomWidth},${bottomY} L${centerX},${bottomY} Z`}
              fill="white"
              opacity="0.05"
            />
            {/* Label */}
            <text x={centerX} y={topY + stageHeight / 2 - 8} textAnchor="middle" fill="hsl(210, 40%, 98%)" fontSize="10" fontWeight="500" opacity="0.7">
              {rate}%
            </text>
            <text x={centerX} y={topY + stageHeight / 2 + 6} textAnchor="middle" fill="hsl(210, 40%, 98%)" fontSize="11" fontWeight="700" className="uppercase">
              {item.stage.toUpperCase()}
            </text>
            <text x={centerX} y={topY + stageHeight / 2 + 22} textAnchor="middle" fill={item.color} fontSize="14" fontWeight="800">
              {item.value.toLocaleString("pt-BR")}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function FunnelBars({ data }: { data: FunnelStage[] }) {
  const maxValue = data[0]?.value || 1;

  return (
    <div className="space-y-3">
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
            <div className="h-6 w-full overflow-hidden rounded bg-muted/50">
              <div
                className="h-full rounded transition-all duration-500"
                style={{
                  width: `${width}%`,
                  background: `linear-gradient(90deg, ${item.color}, ${item.color}88)`,
                  boxShadow: `0 0 12px ${item.color}44`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function FunnelChart({ title, subtitle, data, variant = "bars" }: FunnelChartProps) {
  return (
    <Card className="card-glow">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </CardHeader>
      <CardContent>
        {variant === "3d" ? <Funnel3D data={data} /> : <FunnelBars data={data} />}
      </CardContent>
    </Card>
  );
}
