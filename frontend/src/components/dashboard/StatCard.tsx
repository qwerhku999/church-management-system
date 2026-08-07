import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: number;
  accent?: "indigo" | "emerald" | "amber" | "sky";
}

const accents: Record<string, string> = {
  indigo: "from-indigo-500/20 to-indigo-500/0 text-indigo-300",
  emerald: "from-emerald-500/20 to-emerald-500/0 text-emerald-300",
  amber: "from-amber-500/20 to-amber-500/0 text-amber-300",
  sky: "from-sky-500/20 to-sky-500/0 text-sky-300",
};

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  accent = "indigo",
}: StatCardProps) {
  const positive = (trend ?? 0) >= 0;

  return (
    <div className="card hover-card p-5">
      <div className="flex items-start justify-between">
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br",
            accents[accent]
          )}
        >
          <Icon size={20} />
        </div>
        {typeof trend === "number" ? (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
              positive ? "bg-emerald-500/12 text-emerald-300" : "bg-red-500/12 text-red-300"
            )}
          >
            {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend)}%
          </span>
        ) : null}
      </div>
      <p className="mt-4 text-sm text-[var(--muted)]">{title}</p>
      <p className="mt-1 font-display text-2xl font-bold tracking-tight">{value}</p>
      {subtitle ? <p className="mt-1 text-xs text-[var(--muted)]">{subtitle}</p> : null}
    </div>
  );
}
