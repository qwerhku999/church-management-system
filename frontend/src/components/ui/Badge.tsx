import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "default" | "success" | "warning" | "danger" | "info" | "muted";

const tones: Record<Tone, string> = {
  default: "bg-[var(--primary-soft)] text-[var(--primary)] border-[var(--primary)]/20",
  success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  danger: "bg-[var(--danger)]/10 text-[var(--danger)] border-[var(--danger)]/20",
  info: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  muted: "bg-[var(--surface-hover)] text-[var(--muted)] border-[var(--border)]",
};

export default function Badge({
  children,
  tone = "default",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
