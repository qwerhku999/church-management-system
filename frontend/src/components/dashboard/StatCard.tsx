import { type LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: number;
  accent?: "primary" | "emerald" | "amber" | "sky";
}

const accents: Record<string, string> = {
  primary: "bg-[var(--primary-soft)] text-[var(--primary)]",
  emerald: "bg-emerald-500/12 text-emerald-400",
  amber: "bg-amber-500/12 text-amber-400",
  sky: "bg-sky-500/12 text-sky-400",
};

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  accent = "primary",
}: StatCardProps) {
  const positive = (trend ?? 0) >= 0;

  return (
    <div className="card hover-card p-5">
      <div className="flex items-start justify-between">
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", accents[accent])}>
          <Icon size={19} />
        </div>
        {typeof trend === "number" ? (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold",
              positive ? "bg-emerald-500/12 text-emerald-400" : "bg-[var(--danger)]/12 text-[var(--danger)]"
            )}
          >
            {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend)}%
          </span>
        ) : null}
      </div>
      <p className="mt-4 text-sm text-[var(--muted)]">{title}</p>
      <p className="mt-1 font-display text-[26px] font-bold leading-tight tracking-tight text-[var(--text)]">{value}</p>
      {subtitle ? <p className="mt-1 text-xs text-[var(--muted)]">{subtitle}</p> : null}
    </div>
  );
}
