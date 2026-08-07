import AppLayout from "@/components/layout/AppLayout";
import StatCard from "@/components/dashboard/StatCard";
import DashboardGrid from "@/components/dashboard/DashboardGrid";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";

import { Users, CalendarDays, Wallet, Church, Plus } from "lucide-react";

export default function HomePage() {
  return (
    <AppLayout>
      <PageHeader
        title="Dashboard"
        description="Monitor attendance, giving, ministries, and member activity from one place."
        actions={
          <Button>
            <Plus size={16} />
            Add Member
          </Button>
        }
      />

      {/* Stats */}
      <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Members" value="1,284" subtitle="+18 this month" icon={Users} trend={4} accent="primary" />
        <StatCard title="Donations" value="GHS 32,450" subtitle="This month" icon={Wallet} trend={12} accent="emerald" />
        <StatCard title="Events" value="12" subtitle="This week" icon={CalendarDays} accent="sky" />
        <StatCard title="Ministries" value="15" subtitle="Active" icon={Church} accent="amber" />
      </section>

      <DashboardGrid />
    </AppLayout>
  );
}
