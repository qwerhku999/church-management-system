"use client";

import AppLayout from "@/components/layout/AppLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function ReportsPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--primary)]">Reports</p>
          <h1 className="mt-2 text-3xl font-semibold">Generate ministry reports</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">Preview summary metrics and export-ready reporting views.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card title="Members" description="Current membership snapshot">
            <div className="text-3xl font-semibold">1,284</div>
          </Card>
          <Card title="Attendance" description="Weekly service average">
            <div className="text-3xl font-semibold">318</div>
          </Card>
          <Card title="Donations" description="Monthly giving trend">
            <div className="text-3xl font-semibold">GHS 32k</div>
          </Card>
        </div>

        <Card title="Export reports" description="Report generation controls">
          <div className="flex flex-wrap gap-3">
            <Button>Export PDF</Button>
            <Button variant="secondary">Export CSV</Button>
            <Button variant="secondary">Share report</Button>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
