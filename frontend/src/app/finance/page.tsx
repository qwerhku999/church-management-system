"use client";

import { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import Card from "@/components/ui/Card";
import Loader from "@/components/ui/Loader";
import EmptyState from "@/components/ui/EmptyState";
import { financeService } from "@/services/finance.service";

export default function FinancePage() {
  const [summary, setSummary] = useState<Record<string, unknown> | null>(null);
  const [monthly, setMonthly] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [summaryRes, monthlyRes] = await Promise.all([financeService.getSummary(), financeService.getMonthly()]);
        setSummary(summaryRes?.data ?? summaryRes);
        setMonthly(Array.isArray(monthlyRes?.data) ? monthlyRes.data : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load finance data");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--primary)]">Finance</p>
          <h1 className="mt-2 text-3xl font-semibold">Financial oversight</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">Review income, expenditures, and monthly trends at a glance.</p>
        </div>

        {error ? <p className="text-sm text-red-400">{error}</p> : null}

        {loading ? (
          <Loader label="Loading finance data" />
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-3">
              <Card title="Income" description="Current balance">
                <div className="text-3xl font-semibold">{summary?.income ?? 0}</div>
              </Card>
              <Card title="Expenses" description="Recorded outflows">
                <div className="text-3xl font-semibold">{summary?.expenses ?? 0}</div>
              </Card>
              <Card title="Net" description="Projected balance">
                <div className="text-3xl font-semibold">{summary?.net ?? 0}</div>
              </Card>
            </div>

            <Card title="Monthly report" description="A simple financial overview layout">
              {monthly.length === 0 ? (
                <EmptyState title="No financial report available" description="The finance module will populate once data is available." />
              ) : (
                <div className="space-y-3">
                  {monthly.map((item, index) => (
                    <div key={`${item.month ?? index}`} className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3">
                      <span>{String(item.month ?? `Month ${index + 1}`)}</span>
                      <span className="text-[var(--muted)]">{String(item.amount ?? 0)}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </>
        )}
      </div>
    </AppLayout>
  );
}
