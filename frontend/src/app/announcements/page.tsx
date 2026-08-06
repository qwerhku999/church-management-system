"use client";

import { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import Card from "@/components/ui/Card";
import Loader from "@/components/ui/Loader";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { announcementService } from "@/services/announcement.service";

interface AnnouncementRecord {
  _id?: string;
  title?: string;
  content?: string;
  createdAt?: string;
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<AnnouncementRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", content: "" });
  const [error, setError] = useState("");

  const loadAnnouncements = async () => {
    try {
      const response = await announcementService.list();
      const listData = response?.data?.announcements ?? response?.data ?? [];
      setAnnouncements(Array.isArray(listData) ? listData : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load announcements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadAnnouncements();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await announcementService.create(form);
      await loadAnnouncements();
      setForm({ title: "", content: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save announcement");
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--primary)]">Announcements</p>
          <h1 className="mt-2 text-3xl font-semibold">Church communication feed</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">Share updates, reminders, and important notices.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card title="Feed" description="Recent announcements">
            {error ? <p className="mb-4 text-sm text-red-400">{error}</p> : null}
            {loading ? (
              <Loader label="Loading announcements" />
            ) : announcements.length === 0 ? (
              <EmptyState title="No announcements yet" description="Create the first update for your congregation." />
            ) : (
              <div className="space-y-3">
                {announcements.map((announcement) => (
                  <div key={announcement._id} className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
                    <h3 className="font-semibold">{announcement.title || "Announcement"}</h3>
                    <p className="mt-2 text-sm text-[var(--muted)]">{announcement.content || "No content provided."}</p>
                    <p className="mt-3 text-xs uppercase tracking-wide text-[var(--muted)]">{announcement.createdAt ? new Date(announcement.createdAt).toLocaleDateString() : "Just now"}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card title="Create announcement" description="Publish a new update">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="min-h-28 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-3 text-sm outline-none" placeholder="Write the announcement here" />
              <Button type="submit" className="w-full">Publish</Button>
            </form>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
