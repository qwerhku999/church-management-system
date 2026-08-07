"use client";

import { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import Card from "@/components/ui/Card";
import Loader from "@/components/ui/Loader";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { donationService } from "@/services/donation.service";

interface DonationRecord {
  _id?: string;
  amount?: number;
  donorName?: string;
  paymentMethod?: string;
  createdAt?: string;
}

export default function DonationsPage() {
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ donorName: "", amount: "", paymentMethod: "cash" });
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      const [listRes, summaryRes] = await Promise.all([donationService.list(), donationService.getSummary()]);
      const listData =
        (listRes?.data as any)?.donations ??
        listRes?.data ??
        [];
      setDonations(Array.isArray(listData) ? listData : []);
      setSummary(summaryRes?.data ?? summaryRes);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load donations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadData();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await donationService.create({ ...form, amount: Number(form.amount) });
      await loadData();
      setForm({ donorName: "", amount: "", paymentMethod: "cash" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save donation");
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--primary)]">Donations</p>
          <h1 className="mt-2 text-3xl font-semibold">Donation history and giving insights</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">Track contributions and monitor giving progress.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card title="Total received" description="This month">
            <div className="text-3xl font-semibold">{summary?.totalAmount ?? 0}</div>
          </Card>
          <Card title="Transactions" description="Recorded gifts">
            <div className="text-3xl font-semibold">{summary?.count ?? 0}</div>
          </Card>
          <Card title="Average" description="Per donation">
            <div className="text-3xl font-semibold">{summary?.average ?? 0}</div>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card title="Donation history" description="Recent contributions">
            {error ? <p className="mb-4 text-sm text-red-400">{error}</p> : null}
            {loading ? (
              <Loader label="Loading donations" />
            ) : donations.length === 0 ? (
              <EmptyState title="No donations recorded yet" description="Add the first donation to start tracking giving." />
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="text-[var(--muted)]">
                    <tr className="border-b border-[var(--border)]">
                      <th className="px-3 py-3">Donor</th>
                      <th className="px-3 py-3">Amount</th>
                      <th className="px-3 py-3">Method</th>
                      <th className="px-3 py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.map((donation) => (
                      <tr key={donation._id} className="border-b border-[var(--border)]/70">
                        <td className="px-3 py-3">{donation.donorName || "Anonymous"}</td>
                        <td className="px-3 py-3">{donation.amount ?? 0}</td>
                        <td className="px-3 py-3">{donation.paymentMethod || "cash"}</td>
                        <td className="px-3 py-3">{donation.createdAt ? new Date(donation.createdAt).toLocaleDateString() : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          <Card title="Add donation" description="Record a new contribution">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Donor name" value={form.donorName} onChange={(e) => setForm({ ...form, donorName: e.target.value })} />
              <Input label="Amount" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
              <Input label="Payment method" value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })} />
              <Button type="submit" className="w-full">Save donation</Button>
            </form>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
