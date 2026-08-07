"use client";

import { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import Card from "@/components/ui/Card";
import Loader from "@/components/ui/Loader";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { eventService } from "@/services/event.service";

interface EventRecord {
  _id?: string;
  title?: string;
  category?: string;
  startDate?: string;
  location?: { name?: string };
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", category: "special", startDate: "" });
  const [error, setError] = useState("");

  const loadEvents = async () => {
    try {
      const response = await eventService.list();
      const listData =
        (response?.data as any)?.events ??
        response?.data ??
        [];
      setEvents(Array.isArray(listData) ? listData : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadEvents();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await eventService.create({ ...form, startDate: new Date(form.startDate).toISOString() });
      await loadEvents();
      setForm({ title: "", category: "special", startDate: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save event");
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--primary)]">Events</p>
          <h1 className="mt-2 text-3xl font-semibold">Upcoming church activities</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">Plan services, conferences, and fellowship gatherings.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card title="Event list" description="Recent and upcoming events">
            {error ? <p className="mb-4 text-sm text-red-400">{error}</p> : null}
            {loading ? (
              <Loader label="Loading events" />
            ) : events.length === 0 ? (
              <EmptyState title="No events scheduled" description="Create the next event to see it listed here." />
            ) : (
              <div className="space-y-3">
                {events.map((event) => (
                  <div key={event._id} className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="font-semibold">{event.title || "Untitled event"}</h3>
                        <p className="mt-1 text-sm text-[var(--muted)]">{event.category || "other"}</p>
                      </div>
                      <span className="text-sm text-[var(--muted)]">{event.startDate ? new Date(event.startDate).toLocaleDateString() : "TBD"}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card title="Create event" description="Add a new ministry event">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              <Input label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              <Input label="Start date" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
              <Button type="submit" className="w-full">Save event</Button>
            </form>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
