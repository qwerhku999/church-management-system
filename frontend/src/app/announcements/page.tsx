"use client";

import { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import Card from "@/components/ui/Card";
import Loader from "@/components/ui/Loader";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { attendanceService } from "@/services/attendance.service";

interface AttendanceRecord {
  _id?: string;
  date?: string;
  serviceType?: string;
  totalCount?: number;
  memberCount?: number;
  visitorCount?: number;
}

export default function AttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    serviceType: "sunday_service",
    totalCount: "0",
  });
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      const [listRes, statsRes] = await Promise.all([
        attendanceService.list(),
        attendanceService.getStats(),
      ]);

      const listData =
        (listRes?.data as any)?.attendance ??
        listRes?.data ??
        [];

      setRecords(Array.isArray(listData) ? listData : []);
      setStats(statsRes?.data ?? statsRes);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load attendance"
      );
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
      await attendanceService.create({
        ...form,
        totalCount: Number(form.totalCount),
      });

      await loadData();

      setForm({
        serviceType: "sunday_service",
        totalCount: "0",
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save record"
      );
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--primary)]">
            Attendance
          </p>

          <h1 className="mt-2 text-3xl font-semibold">
            Track church attendance
          </h1>

          <p className="mt-2 text-sm text-[var(--muted)]">
            Record attendance with quick summaries and service insights.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <Card title="Today" description="Service attendance overview">
            <div className="text-4xl font-semibold">
              {stats?.attendance?.present ?? 0}
            </div>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Present members
            </p>
          </Card>

          <Card title="Absent" description="Pending follow-up">
            <div className="text-4xl font-semibold">
              {stats?.attendance?.absent ?? 0}
            </div>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Absences logged
            </p>
          </Card>

          <Card title="Late" description="Attendance status breakdown">
            <div className="text-4xl font-semibold">
              {stats?.attendance?.late ?? 0}
            </div>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Late arrivals
            </p>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card
            title="Attendance records"
            description="Recent attendance captures"
          >
            {error ? (
              <p className="mb-4 text-sm text-red-400">
                {error}
              </p>
            ) : null}

            {loading ? (
              <Loader label="Loading attendance" />
            ) : records.length === 0 ? (
              <EmptyState
                title="No attendance records yet"
                description="Capture the latest service attendance to get started."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="text-[var(--muted)]">
                    <tr className="border-b border-[var(--border)]">
                      <th className="px-3 py-3">Date</th>
                      <th className="px-3 py-3">Service</th>
                      <th className="px-3 py-3">Members</th>
                      <th className="px-3 py-3">Visitors</th>
                    </tr>
                  </thead>

                  <tbody>
                    {records.map((record) => (
                      <tr
                        key={record._id}
                        className="border-b border-[var(--border)]/70"
                      >
                        <td className="px-3 py-3">
                          {record.date
                            ? new Date(
                                record.date
                              ).toLocaleDateString()
                            : "—"}
                        </td>

                        <td className="px-3 py-3">
                          {record.serviceType || "—"}
                        </td>

                        <td className="px-3 py-3">
                          {record.memberCount ?? 0}
                        </td>

                        <td className="px-3 py-3">
                          {record.visitorCount ?? 0}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          <Card
            title="Mark attendance"
            description="Record a new service attendance"
          >
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <Input
                label="Service type"
                value={form.serviceType}
                onChange={(e) =>
                  setForm({
                    ...form,
                    serviceType: e.target.value,
                  })
                }
              />

              <Input
                label="Total count"
                type="number"
                value={form.totalCount}
                onChange={(e) =>
                  setForm({
                    ...form,
                    totalCount: e.target.value,
                  })
                }
              />

              <Button type="submit" className="w-full">
                Save attendance
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}