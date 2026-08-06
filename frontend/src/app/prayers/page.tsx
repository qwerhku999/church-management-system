"use client";

import { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import Card from "@/components/ui/Card";
import Loader from "@/components/ui/Loader";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { prayerService } from "@/services/prayer.service";

interface PrayerRecord {
  _id?: string;
  title?: string;
  request?: string;
  status?: string;
}

export default function PrayersPage() {
  const [prayers, setPrayers] = useState<PrayerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", request: "", status: "pending" });
  const [error, setError] = useState("");

  const loadPrayers = async () => {
    try {
      const response = await prayerService.list();
      const listData = response?.data?.prayers ?? response?.data ?? [];
      setPrayers(Array.isArray(listData) ? listData : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load prayer requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadPrayers();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await prayerService.create(form);
      await loadPrayers();
      setForm({ title: "", request: "", status: "pending" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save prayer request");
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--primary)]">Prayer requests</p>
          <h1 className="mt-2 text-3xl font-semibold">Prayer support and updates</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">Collect requests and track their progress.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card title="Requests" description="Current prayer needs">
            {error ? <p className="mb-4 text-sm text-red-400">{error}</p> : null}
            {loading ? (
              <Loader label="Loading prayer requests" />
            ) : prayers.length === 0 ? (
              <EmptyState title="No prayer requests yet" description="Create one to start capturing community needs." />
            ) : (
              <div className="space-y-3">
                {prayers.map((prayer) => (
                  <div key={prayer._id} className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-semibold">{prayer.title || "Prayer request"}</h3>
                      <span className="rounded-full bg-[var(--surface)] px-3 py-1 text-xs uppercase">{prayer.status || "pending"}</span>
                    </div>
                    <p className="mt-2 text-sm text-[var(--muted)]">{prayer.request || "No details provided."}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card title="Create request" description="Submit a new prayer request">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              <textarea value={form.request} onChange={(e) => setForm({ ...form, request: e.target.value })} className="min-h-28 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-3 text-sm outline-none" placeholder="Describe the request" />
              <Input label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} />
              <Button type="submit" className="w-full">Save request</Button>
            </form>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
