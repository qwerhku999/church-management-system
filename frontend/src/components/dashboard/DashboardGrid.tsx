import AttendanceChart from "./AttendanceChart";
import DonationChart from "./DonationChart";
import RecentMembers from "./RecentMembers";
import {
  ArrowUpRight,
  CalendarDays,
  Clock3,
  UserPlus,
  CalendarPlus,
  ClipboardCheck,
  BarChart3,
} from "lucide-react";

function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
        {eyebrow}
      </p>

      <h2 className="mt-1 font-display text-lg font-bold tracking-tight text-[var(--text)]">
        {title}
      </h2>
    </div>
  );
}

const quickActions = [
  { label: "Add Member", icon: UserPlus },
  { label: "New Event", icon: CalendarPlus },
  { label: "Attendance", icon: ClipboardCheck },
  { label: "Reports", icon: BarChart3 },
];

const events = [
  { title: "Sunday Worship", time: "Sunday • 8:00 AM" },
  { title: "Youth Fellowship", time: "Friday • 6:00 PM" },
  { title: "Choir Rehearsal", time: "Saturday • 4:00 PM" },
];

export default function DashboardGrid() {
  return (
    <section className="space-y-4">
      {/* Attendance */}
      <div className="card p-6">
        <div className="mb-6 flex items-center justify-between">
          <SectionHeading
            eyebrow="Analytics"
            title="Attendance Overview"
          />

          <span className="rounded-md border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1.5 text-xs font-medium text-[var(--muted-strong)]">
            This Week
          </span>
        </div>

        <AttendanceChart />
      </div>

      {/* Donations */}
      <div className="card p-6">
        <div className="mb-4 flex items-center justify-between">
          <SectionHeading eyebrow="Finance" title="Donations" />

          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/12 px-2 py-1 text-xs font-semibold text-emerald-400">
            <ArrowUpRight size={13} />
            12%
          </span>
        </div>

        <DonationChart />
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h2 className="mb-4 font-display text-lg font-bold tracking-tight text-[var(--text)]">
          Quick Actions
        </h2>

        <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
          {quickActions.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className="focus-ring flex flex-col items-start gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-3 text-sm font-medium text-[var(--text)] transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--surface-hover)]"
            >
              <Icon size={17} className="text-[var(--primary)]" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Members */}
      <div className="card p-6">
        <RecentMembers />
      </div>

      {/* Upcoming Events */}
      <div className="card p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold tracking-tight text-[var(--text)]">
            Upcoming Events
          </h2>

          <CalendarDays size={18} className="text-[var(--muted)]" />
        </div>

        <div className="space-y-2.5">
          {events.map((event) => (
            <div
              key={event.title}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-3.5 transition-colors hover:border-[var(--border-strong)]"
            >
              <h3 className="text-sm font-semibold text-[var(--text)]">
                {event.title}
              </h3>

              <div className="mt-1.5 flex items-center gap-1.5 text-xs text-[var(--muted)]">
                <Clock3 size={13} />
                {event.time}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}