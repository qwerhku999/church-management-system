"use client";

import { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import Card from "@/components/ui/Card";
import Loader from "@/components/ui/Loader";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { visitorService } from "@/services/visitor.service";

interface VisitorRecord {
  _id?: string;
  name?: string;
  contact?: string;
  followUpStatus?: string;
}

export default function VisitorsPage() {
  const [visitors, setVisitors] = useState<VisitorRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", contact: "", followUpStatus: "pending" });
  const [error, setError] = useState("");

  const loadVisitors = async () => {
    try {
      const response = await visitorService.list();
      const listData =
        (response?.data as any)?.visitors ??
        response?.data ??
        [];
      setVisitors(Array.isArray(listData) ? listData : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load visitors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadVisitors();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await visitorService.create(form);
      await loadVisitors();
      setForm({ name: "", contact: "", followUpStatus: "pending" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save visitor");
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--primary)]">Visitors</p>
          <h1 className="mt-2 text-3xl font-semibold">Visitor follow-up tracking</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">Log visitors and keep follow-up progress visible.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card title="Visitor records" description="Recent guest visits">
            {error ? <p className="mb-4 text-sm text-red-400">{error}</p> : null}
            {loading ? (
              <Loader label="Loading visitors" />
            ) : visitors.length === 0 ? (
              <EmptyState title="No visitors recorded" description="Add a visitor to begin tracking follow-up." />
            ) : (
              <div className="space-y-3">
                {visitors.map((visitor) => (
                  <div key={visitor._id} className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="font-semibold">{visitor.name || "Visitor"}</h3>
                        <p className="mt-1 text-sm text-[var(--muted)]">{visitor.contact || "No contact info"}</p>
                      </div>
                      <span className="rounded-full bg-[var(--surface)] px-3 py-1 text-xs uppercase">{visitor.followUpStatus || "pending"}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card title="Add visitor" description="Register a new guest">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <Input label="Contact" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
              <Input label="Follow-up status" value={form.followUpStatus} onChange={(e) => setForm({ ...form, followUpStatus: e.target.value })} />
              <Button type="submit" className="w-full">Save visitor</Button>
            </form>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
