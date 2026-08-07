import { Users, CalendarDays, HandCoins, BarChart3 } from "lucide-react";

const highlights = [
  { icon: Users, label: "Member directory & discipleship tracking" },
  { icon: CalendarDays, label: "Events, attendance & follow-ups" },
  { icon: HandCoins, label: "Giving, tithes & financial reports" },
  { icon: BarChart3, label: "Real-time analytics & insights" },
];

export default function AuthBrandPanel() {
  return (
    <div className="relative hidden overflow-hidden border-r border-[var(--border)] bg-[var(--surface)] lg:block">
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
        aria-hidden="true"
      />

      <div className="relative flex h-full flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--primary)] text-lg font-bold text-white">
            M
          </div>
          <div>
            <h1 className="font-display text-lg font-bold text-[var(--text)]">MinistryFlow</h1>
            <p className="text-xs text-[var(--muted)]">Church Management System</p>
          </div>
        </div>

        <div className="max-w-md">
          <h2 className="font-display text-4xl font-bold leading-tight text-[var(--text)] text-balance">
            The digital operating system for your church.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--muted)]">
            Manage members, attendance, giving, and ministries from one elegant,
            unified platform built for modern churches.
          </p>

          <div className="mt-8 space-y-2.5">
            {highlights.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface-2)] text-[var(--primary)]">
                  <Icon size={16} />
                </div>
                <span className="text-sm text-[var(--muted-strong)]">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-[var(--muted)]/70">© 2026 MinistryFlow · Developed by N.K. Ammonoh</p>
      </div>
    </div>
  );
}
