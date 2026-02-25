import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
    <Card className={cn("border-border", compact && "")}>
      <CardContent className={cn("flex items-center gap-4", compact ? "p-4" : "p-6")}>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-muted-foreground">{title}</p>
          <p className={cn("font-bold", compact ? "text-lg" : "text-2xl")}>
            {typeof value === "number" ? value.toLocaleString("pt-BR") : value}
          </p>
        </div>
        {change !== undefined && (
          <div
            className={cn(
              "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
              isPositive
                ? "bg-success/10 text-success"
                : "bg-destructive/10 text-destructive"
            )}
          >
            {isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {Math.abs(change).toFixed(1)}%
          </div>
        )}
      </CardContent>
    </Card>
  );
}
