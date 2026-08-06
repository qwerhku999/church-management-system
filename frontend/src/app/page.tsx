import AppLayout from "@/components/layout/AppLayout";
import StatCard from "@/components/dashboard/StatCard";
import DashboardGrid from "@/components/dashboard/DashboardGrid";

import {
  Users,
  CalendarDays,
  Wallet,
  Church,
} from "lucide-react";

export default function HomePage() {
  return (
    <AppLayout>
      {/* Hero */}

      <section className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
            MinistryFlow
          </p>

          <h1 className="mt-2 text-5xl font-bold">
            Church Dashboard
          </h1>

          <p className="mt-4 max-w-2xl text-lg text-[var(--muted)]">
            Monitor attendance, finances, ministries,
            members and church activities from one place.
          </p>
        </div>

        <button className="rounded-2xl bg-[var(--primary)] px-6 py-4 font-semibold text-white transition hover:scale-[1.02]">
          + Add Member
        </button>
      </section>

      {/* Stats */}

      <section className="mb-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Members"
          value="1,284"
          subtitle="+18 this month"
          icon={Users}
        />

        <StatCard
          title="Donations"
          value="GHS 32,450"
          subtitle="+12%"
          icon={Wallet}
        />

        <StatCard
          title="Events"
          value="12"
          subtitle="This Week"
          icon={CalendarDays}
        />

        <StatCard
          title="Ministries"
          value="15"
          subtitle="Active"
          icon={Church}
        />
      </section>

      <DashboardGrid />
    </AppLayout>
  );
}