import { Users, CalendarDays, HandCoins, BarChart3 } from "lucide-react";

const highlights = [
  { icon: Users, label: "Member directory & discipleship tracking" },
  { icon: CalendarDays, label: "Events, attendance & follow-ups" },
  { icon: HandCoins, label: "Giving, tithes & financial reports" },
  { icon: BarChart3, label: "Real-time analytics & insights" },
];

export default function AuthBrandPanel() {
  return (
    <div className="relative hidden overflow-hidden bg-[#0A0F1D] lg:block">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.18),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.14),transparent_45%)]" />
      <div className="absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-indigo-600/20 blur-3xl" />

      <div className="relative flex h-full flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 text-xl font-bold text-white shadow-lg shadow-indigo-500/30">
            M
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-white">MinistryFlow</h1>
            <p className="text-xs text-slate-400">Church Management System</p>
          </div>
        </div>

        <div className="max-w-md">
          <h2 className="font-display text-4xl font-bold leading-tight text-white text-balance">
            The digital operating system for your church.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-400">
            Manage members, attendance, giving, and ministries from one elegant,
            unified platform built for modern churches.
          </p>

          <div className="mt-8 space-y-3">
            {highlights.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-indigo-300">
                  <Icon size={17} />
                </div>
                <span className="text-sm text-slate-300">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-500">© 2026 MinistryFlow · Developed by N.K. Ammonoh</p>
      </div>
    </div>
  );
}
