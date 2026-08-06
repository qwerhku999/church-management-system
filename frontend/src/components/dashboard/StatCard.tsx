import { ArrowUpRight, LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
}: StatCardProps) {
  return (
    <div className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--primary)]/40 hover:shadow-2xl">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--muted)]">
            {title}
          </p>

          <h3 className="mt-4 text-4xl font-bold tracking-tight">
            {value}
          </h3>
        </div>

        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary)] to-blue-500 shadow-lg">
          <Icon className="h-8 w-8 text-white" />
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-400">
          <ArrowUpRight size={14} />
          +12%
        </span>

        <span className="text-sm text-[var(--muted)]">
          {subtitle}
        </span>
      </div>
    </div>
  );
}