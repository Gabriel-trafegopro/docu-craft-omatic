import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: ReactNode;
  compact?: boolean;
}

export function KPICard({ title, value, change, icon, compact }: KPICardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <div className={cn(
      "card-glow rounded-xl bg-card text-card-foreground",
      compact ? "p-4" : "p-5"
    )}>
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline gap-2">
            <p className={cn("font-bold text-foreground", compact ? "text-lg" : "text-2xl")}>
              {typeof value === "number" ? value.toLocaleString("pt-BR") : value}
            </p>
            {change !== undefined && (
              <div
                className={cn(
                  "flex items-center gap-0.5 text-xs font-semibold",
                  isPositive ? "text-success" : "text-destructive"
                )}
              >
                {isPositive ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {isPositive ? "+" : ""}{Math.abs(change).toFixed(1)}%
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
