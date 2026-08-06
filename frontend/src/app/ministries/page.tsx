"use client";

import { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import Card from "@/components/ui/Card";
import Loader from "@/components/ui/Loader";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { apiGet } from "@/services/api";

interface MinistryRecord {
  _id?: string;
  name?: string;
  description?: string;
  status?: string;
  members?: Array<unknown>;
}

export default function MinistriesPage() {
  const [ministries, setMinistries] = useState<MinistryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", description: "", status: "active" });
  const [error, setError] = useState("");

  const loadMinistries = async () => {
    try {
      const response = await apiGet(`/ministries`);
      const listData = response?.data?.ministries ?? response?.data ?? [];
      setMinistries(Array.isArray(listData) ? listData : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load ministries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadMinistries();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await apiGet(`/ministries`);
      await loadMinistries();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save ministry");
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--primary)]">Ministries</p>
          <h1 className="mt-2 text-3xl font-semibold">Ministry portfolio</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">Manage ministry focus areas and member participation.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card title="Ministries" description="Active ministry groups">
            {error ? <p className="mb-4 text-sm text-red-400">{error}</p> : null}
            {loading ? (
              <Loader label="Loading ministries" />
            ) : ministries.length === 0 ? (
              <EmptyState title="No ministries added" description="Add a ministry to organize church programs." />
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {ministries.map((ministry) => (
                  <div key={ministry._id} className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
                    <h3 className="font-semibold">{ministry.name || "Ministry"}</h3>
                    <p className="mt-2 text-sm text-[var(--muted)]">{ministry.description || "No description yet."}</p>
                    <div className="mt-4 flex items-center justify-between text-sm">
                      <span className="text-[var(--muted)]">{ministry.members?.length ?? 0} members</span>
                      <span className="rounded-full bg-[var(--surface)] px-3 py-1 text-xs uppercase">{ministry.status || "active"}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card title="Manage ministry" description="Add or update a ministry">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <Input label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <Input label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} />
              <Button type="submit" className="w-full">Save ministry</Button>
            </form>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
