"use client";

import { useEffect, useMemo, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import Card from "@/components/ui/Card";
import Loader from "@/components/ui/Loader";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  Trash2,
  X,
  UserRound,
  Video,
} from "lucide-react";
import { eventService } from "@/services/event.service";

interface EventRecord {
  _id?: string;
  title?: string;
  description?: string;
  category?: string;
  status?: "draft" | "published" | "cancelled" | "completed";
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  isAllDay?: boolean;
  location?: {
    name?: string;
    address?: string;
    room?: string;
    isOnline?: boolean;
    onlineLink?: string;
  };
  organizer?: {
    firstName?: string;
    lastName?: string;
  };
  ministry?: {
    name?: string;
  };
  capacity?: number | null;
  registrationRequired?: boolean;
  registrationDeadline?: string;
  attendeeCount?: number;
  attendees?: Array<{
    member?: string;
    registeredAt?: string;
    status?: string;
  }>;
  tags?: string[];
  image?: string;
  color?: string;
  isPublic?: boolean;
  notes?: string;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
}

const CATEGORY_OPTIONS = [
  { value: "worship", label: "Worship" },
  { value: "prayer", label: "Prayer" },
  { value: "bible_study", label: "Bible Study" },
  { value: "outreach", label: "Outreach" },
  { value: "fellowship", label: "Fellowship" },
  { value: "conference", label: "Conference" },
  { value: "seminar", label: "Seminar" },
  { value: "youth", label: "Youth" },
  { value: "children", label: "Children" },
  { value: "special", label: "Special" },
  { value: "other", label: "Other" },
];

const CATEGORY_COLORS: Record<string, string> = {
  worship: "border-indigo-400 bg-indigo-500/15 text-indigo-200",
  prayer: "border-violet-400 bg-violet-500/15 text-violet-200",
  bible_study: "border-blue-400 bg-blue-500/15 text-blue-200",
  outreach: "border-orange-400 bg-orange-500/15 text-orange-200",
  fellowship: "border-emerald-400 bg-emerald-500/15 text-emerald-200",
  conference: "border-cyan-400 bg-cyan-500/15 text-cyan-200",
  seminar: "border-sky-400 bg-sky-500/15 text-sky-200",
  youth: "border-pink-400 bg-pink-500/15 text-pink-200",
  children: "border-yellow-400 bg-yellow-500/15 text-yellow-200",
  special: "border-purple-400 bg-purple-500/15 text-purple-200",
  other: "border-slate-400 bg-slate-500/15 text-slate-200",
};

const WEEK_DAYS = [
  "SUN",
  "MON",
  "TUE",
  "WED",
  "THU",
  "FRI",
  "SAT",
];

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function startOfCalendar(date: Date) {
  const first = startOfMonth(date);
  const day = first.getDay();

  return new Date(
    first.getFullYear(),
    first.getMonth(),
    first.getDate() - day
  );
}

function getCalendarDays(date: Date): CalendarDay[] {
  const firstDay = startOfCalendar(date);

  return Array.from({ length: 42 }, (_, index) => {
    const current = new Date(
      firstDay.getFullYear(),
      firstDay.getMonth(),
      firstDay.getDate() + index
    );

    return {
      date: current,
      isCurrentMonth: current.getMonth() === date.getMonth(),
    };
  });
}

function sameDay(dateA: Date, dateB: Date) {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
}

function formatMonth(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function formatDate(date?: string) {
  if (!date) return "Date not available";

  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatShortDate(date?: string) {
  if (!date) return "TBD";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function formatCategory(category?: string) {
  if (!category) return "Other";

  return category
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getEventDate(event: EventRecord) {
  if (!event.startDate) return null;

  return new Date(event.startDate);
}

function getEventTime(event: EventRecord) {
  if (event.isAllDay) {
    return "All day";
  }

  if (event.startTime && event.endTime) {
    return `${event.startTime} – ${event.endTime}`;
  }

  if (event.startTime) {
    return event.startTime;
  }

  return "Time TBD";
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentMonth, setCurrentMonth] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );

  const [selectedEvent, setSelectedEvent] =
    useState<EventRecord | null>(null);

  const [showCreateForm, setShowCreateForm] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "special",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    locationName: "",
    locationAddress: "",
    isAllDay: false,
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const calendarDays = useMemo(
    () => getCalendarDays(currentMonth),
    [currentMonth]
  );

  const visibleEvents = useMemo(() => {
    return events
      .filter((event) => event.status !== "cancelled")
      .sort((a, b) => {
        const dateA = a.startDate
          ? new Date(a.startDate).getTime()
          : 0;

        const dateB = b.startDate
          ? new Date(b.startDate).getTime()
          : 0;

        return dateA - dateB;
      });
  }, [events]);

  const loadEvents = async () => {
    try {
      setError("");

      const response = await eventService.list();

      const body =
        response as Record<string, unknown> | undefined;

      const data =
        body?.data as Record<string, unknown> | undefined;

      const listData =
        (data?.events as unknown) ??
        (body?.events as unknown) ??
        (Array.isArray(data) ? data : undefined) ??
        [];

      setEvents(
        Array.isArray(listData)
          ? (listData as EventRecord[])
          : []
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load events"
      );
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

  const eventsForDay = (date: Date) => {
    return visibleEvents.filter((event) => {
      const eventDate = getEventDate(event);

      if (!eventDate) return false;

      return sameDay(eventDate, date);
    });
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() - 1,
        1
      )
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        1
      )
    );
  };

  const goToToday = () => {
    const today = new Date();

    setCurrentMonth(
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      )
    );
  };

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    try {
      setError("");

      if (!form.title.trim()) {
        setError("Event title is required.");
        return;
      }

      if (!form.startDate || !form.endDate) {
        setError(
          "Start date and end date are required."
        );
        return;
      }

      const startDate = new Date(
        `${form.startDate}T00:00:00`
      );

      const endDate = new Date(
        `${form.endDate}T23:59:59`
      );

      if (endDate < startDate) {
        setError(
          "End date cannot be before start date."
        );
        return;
      }

      setSaving(true);

      await eventService.create({
        title: form.title.trim(),
        description:
          form.description.trim() || undefined,
        category: form.category,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        startTime:
          form.isAllDay || !form.startTime
            ? undefined
            : form.startTime,
        endTime:
          form.isAllDay || !form.endTime
            ? undefined
            : form.endTime,
        isAllDay: form.isAllDay,
        location: {
          name:
            form.locationName.trim() || undefined,
          address:
            form.locationAddress.trim() || undefined,
          isOnline: false,
        },
      });

      await loadEvents();

      setForm({
        title: "",
        description: "",
        category: "special",
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        locationName: "",
        locationAddress: "",
        isAllDay: false,
      });

      setShowCreateForm(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save event"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedEvent?._id) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${selectedEvent.title || "this event"}"?`
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setError("");

      await eventService.remove(selectedEvent._id);

      setSelectedEvent(null);

      await loadEvents();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete event"
      );
    } finally {
      setDeleting(false);
    }
  };

  const selectedCategoryClass =
    CATEGORY_COLORS[selectedEvent?.category || "other"] ||
    CATEGORY_COLORS.other;

  return (
    <AppLayout>
      <div className="min-w-0 space-y-6">
        {/* PAGE HEADER */}
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--primary)]">
              Events
            </p>

            <h1 className="mt-2 text-3xl font-semibold">
              Church calendar
            </h1>

            <p className="mt-2 text-sm text-[var(--muted)]">
              Manage services, conferences, meetings,
              outreach programs, and church activities.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              onClick={() =>
                setShowCreateForm((current) => !current)
              }
            >
              {showCreateForm
                ? "Close form"
                : "Create event"}
            </Button>
          </div>
        </div>

        {error ? (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        ) : null}

        {/* CREATE FORM */}
        {showCreateForm ? (
          <Card
            title="Create event"
            description="Add a new church event to the calendar."
          >
            <form
              onSubmit={handleSubmit}
              className="grid gap-5 md:grid-cols-2"
            >
              <Input
                label="Event title"
                value={form.title}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title: e.target.value,
                  })
                }
                placeholder="Sunday Worship Service"
                required
              />

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Category
                </label>

                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      category: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-sm outline-none transition focus:border-[var(--primary)]"
                >
                  {CATEGORY_OPTIONS.map((category) => (
                    <option
                      key={category.value}
                      value={category.value}
                    >
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Start date"
                type="date"
                value={form.startDate}
                onChange={(e) =>
                  setForm({
                    ...form,
                    startDate: e.target.value,
                  })
                }
                required
              />

              <Input
                label="End date"
                type="date"
                value={form.endDate}
                min={form.startDate || undefined}
                onChange={(e) =>
                  setForm({
                    ...form,
                    endDate: e.target.value,
                  })
                }
                required
              />

              <Input
                label="Start time"
                type="time"
                value={form.startTime}
                disabled={form.isAllDay}
                onChange={(e) =>
                  setForm({
                    ...form,
                    startTime: e.target.value,
                  })
                }
              />

              <Input
                label="End time"
                type="time"
                value={form.endTime}
                disabled={form.isAllDay}
                onChange={(e) =>
                  setForm({
                    ...form,
                    endTime: e.target.value,
                  })
                }
              />

              <Input
                label="Location"
                value={form.locationName}
                onChange={(e) =>
                  setForm({
                    ...form,
                    locationName: e.target.value,
                  })
                }
                placeholder="Main Sanctuary"
              />

              <Input
                label="Address"
                value={form.locationAddress}
                onChange={(e) =>
                  setForm({
                    ...form,
                    locationAddress: e.target.value,
                  })
                }
                placeholder="Church address"
              />

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium">
                  Description
                </label>

                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                  rows={4}
                  placeholder="Describe the event..."
                  className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-sm outline-none transition focus:border-[var(--primary)]"
                />
              </div>

              <label className="flex cursor-pointer items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={form.isAllDay}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      isAllDay: e.target.checked,
                    })
                  }
                  className="h-4 w-4 rounded"
                />

                <span>All-day event</span>
              </label>

              <div className="flex justify-end md:col-span-2">
                <Button
                  type="submit"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : "Save event"}
                </Button>
              </div>
            </form>
          </Card>
        ) : null}

        {/* MAIN CALENDAR */}
        <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <Card
            title="Event calendar"
            description="Click any event to view its details."
          >
            {loading ? (
              <Loader label="Loading events" />
            ) : visibleEvents.length === 0 ? (
              <EmptyState
                title="No events scheduled"
                description="Create your first church event to populate the calendar."
              />
            ) : (
              <div className="min-w-0">
                {/* CALENDAR TOOLBAR */}
                <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={goToPreviousMonth}
                      aria-label="Previous month"
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-2)] transition hover:bg-[var(--surface)]"
                    >
                      <ChevronLeft size={18} />
                    </button>

                    <button
                      type="button"
                      onClick={goToNextMonth}
                      aria-label="Next month"
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-2)] transition hover:bg-[var(--surface)]"
                    >
                      <ChevronRight size={18} />
                    </button>

                    <button
                      type="button"
                      onClick={goToToday}
                      className="ml-1 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-2 text-sm font-medium transition hover:bg-[var(--surface)]"
                    >
                      Today
                    </button>
                  </div>

                  <h2 className="text-xl font-semibold sm:text-2xl">
                    {formatMonth(currentMonth)}
                  </h2>
                </div>

                {/* WEEK HEADERS */}
                <div className="grid grid-cols-7 border-b border-[var(--border)]">
                  {WEEK_DAYS.map((day) => (
                    <div
                      key={day}
                      className="px-2 py-3 text-center text-xs font-semibold tracking-wider text-[var(--muted)]"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* CALENDAR GRID */}
                <div className="grid grid-cols-7 overflow-hidden rounded-b-xl border-l border-t border-[var(--border)]">
                  {calendarDays.map(
                    ({ date, isCurrentMonth }) => {
                      const dayEvents =
                        eventsForDay(date);

                      const today = sameDay(
                        date,
                        new Date()
                      );

                      return (
                        <div
                          key={date.toISOString()}
                          className={[
                            "min-h-[125px] min-w-0 border-b border-r border-[var(--border)] p-2",
                            "bg-[var(--surface)]",
                            !isCurrentMonth
                              ? "opacity-35"
                              : "",
                          ].join(" ")}
                        >
                          {/* DATE NUMBER */}
                          <div className="mb-2 flex items-center justify-between">
                            <span
                              className={[
                                "flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium",
                                today
                                  ? "bg-[var(--primary)] text-white"
                                  : "text-[var(--muted)]",
                              ].join(" ")}
                            >
                              {date.getDate()}
                            </span>
                          </div>

                          {/* EVENTS */}
                          <div className="space-y-1.5">
                            {dayEvents
                              .slice(0, 3)
                              .map((event) => {
                                const categoryClass =
                                  CATEGORY_COLORS[
                                  event.category ||
                                  "other"
                                  ] ||
                                  CATEGORY_COLORS.other;

                                return (
                                  <button
                                    type="button"
                                    key={
                                      event._id ||
                                      `${event.title}-${event.startDate}`
                                    }
                                    onClick={() =>
                                      setSelectedEvent(
                                        event
                                      )
                                    }
                                    className={[
                                      "block w-full min-w-0 truncate rounded-lg border-l-2 px-2 py-1.5 text-left text-xs font-medium",
                                      "transition hover:translate-x-[1px] hover:brightness-125",
                                      categoryClass,
                                    ].join(" ")}
                                    title={
                                      event.title ||
                                      "Event"
                                    }
                                  >
                                    {event.title ||
                                      "Untitled event"}
                                  </button>
                                );
                              })}

                            {dayEvents.length > 3 ? (
                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedEvent(
                                    dayEvents[3]
                                  )
                                }
                                className="px-2 text-xs font-medium text-[var(--primary)] hover:underline"
                              >
                                +{dayEvents.length - 3} more
                              </button>
                            ) : null}
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            )}
          </Card>

          {/* EVENT DETAILS PANEL */}
          <Card
            title="Selected event"
            description={
              selectedEvent
                ? "Event information"
                : "Select an event from the calendar"
            }
          >
            {!selectedEvent ? (
              <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--surface-2)]">
                  <CalendarDays
                    size={25}
                    className="text-[var(--muted)]"
                  />
                </div>

                <h3 className="mt-4 font-semibold">
                  No event selected
                </h3>

                <p className="mt-2 max-w-[240px] text-sm text-[var(--muted)]">
                  Click an event on the calendar to view
                  its complete information.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {/* EVENT TITLE */}
                <div>
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="break-words text-xl font-semibold">
                        {selectedEvent.title ||
                          "Untitled event"}
                      </h3>

                      <div
                        className={[
                          "mt-2 inline-flex rounded-full border px-2.5 py-1 text-xs font-medium",
                          selectedCategoryClass,
                        ].join(" ")}
                      >
                        {formatCategory(
                          selectedEvent.category
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedEvent(null)
                      }
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg hover:bg-[var(--surface-2)]"
                      aria-label="Close event details"
                    >
                      <X size={17} />
                    </button>
                  </div>

                  {selectedEvent.status ? (
                    <span className="text-xs capitalize text-[var(--muted)]">
                      Status: {selectedEvent.status}
                    </span>
                  ) : null}
                </div>

                {/* DESCRIPTION */}
                {selectedEvent.description ? (
                  <div>
                    <p className="text-sm leading-6 text-[var(--muted)]">
                      {selectedEvent.description}
                    </p>
                  </div>
                ) : null}

                {/* DATE */}
                <div className="flex gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--surface-2)]">
                    <CalendarDays size={17} />
                  </div>

                  <div>
                    <p className="text-xs text-[var(--muted)]">
                      Date
                    </p>

                    <p className="mt-1 text-sm font-medium">
                      {formatDate(
                        selectedEvent.startDate
                      )}
                    </p>

                    {selectedEvent.endDate &&
                      selectedEvent.startDate &&
                      !sameDay(
                        new Date(
                          selectedEvent.startDate
                        ),
                        new Date(
                          selectedEvent.endDate
                        )
                      ) ? (
                      <p className="mt-1 text-xs text-[var(--muted)]">
                        Ends{" "}
                        {formatDate(
                          selectedEvent.endDate
                        )}
                      </p>
                    ) : null}
                  </div>
                </div>

                {/* TIME */}
                <div className="flex gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--surface-2)]">
                    <Clock3 size={17} />
                  </div>

                  <div>
                    <p className="text-xs text-[var(--muted)]">
                      Time
                    </p>

                    <p className="mt-1 text-sm font-medium">
                      {getEventTime(selectedEvent)}
                    </p>
                  </div>
                </div>

                {/* LOCATION */}
                {selectedEvent.location?.name ||
                  selectedEvent.location?.address ? (
                  <div className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--surface-2)]">
                      {selectedEvent.location
                        ?.isOnline ? (
                        <Video size={17} />
                      ) : (
                        <MapPin size={17} />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs text-[var(--muted)]">
                        Location
                      </p>

                      {selectedEvent.location.name ? (
                        <p className="mt-1 text-sm font-medium">
                          {selectedEvent.location.name}
                        </p>
                      ) : null}

                      {selectedEvent.location.room ? (
                        <p className="text-xs text-[var(--muted)]">
                          {selectedEvent.location.room}
                        </p>
                      ) : null}

                      {selectedEvent.location.address ? (
                        <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
                          {
                            selectedEvent.location
                              .address
                          }
                        </p>
                      ) : null}

                      {selectedEvent.location
                        .isOnline &&
                        selectedEvent.location
                          .onlineLink ? (
                        <a
                          href={
                            selectedEvent.location
                              .onlineLink
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 inline-block text-xs font-medium text-[var(--primary)] hover:underline"
                        >
                          Join online
                        </a>
                      ) : null}
                    </div>
                  </div>
                ) : null}

                {/* ORGANIZER */}
                {selectedEvent.organizer ? (
                  <div className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--surface-2)]">
                      <UserRound size={17} />
                    </div>

                    <div>
                      <p className="text-xs text-[var(--muted)]">
                        Organizer
                      </p>

                      <p className="mt-1 text-sm font-medium">
                        {
                          selectedEvent.organizer
                            .firstName
                        }{" "}
                        {
                          selectedEvent.organizer
                            .lastName
                        }
                      </p>
                    </div>
                  </div>
                ) : null}

                {/* ATTENDEES */}
                {typeof selectedEvent.attendeeCount ===
                  "number" ? (
                  <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
                    <p className="text-xs text-[var(--muted)]">
                      Registered attendees
                    </p>

                    <p className="mt-1 text-2xl font-semibold">
                      {selectedEvent.attendeeCount}
                    </p>

                    {selectedEvent.capacity ? (
                      <p className="mt-1 text-xs text-[var(--muted)]">
                        Capacity:{" "}
                        {selectedEvent.capacity}
                      </p>
                    ) : null}
                  </div>
                ) : null}

                {/* DELETE */}
                <div className="border-t border-[var(--border)] pt-5">
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Trash2 size={16} />

                    {deleting
                      ? "Deleting..."
                      : "Delete event"}
                  </button>

                  <p className="mt-2 text-center text-xs text-[var(--muted)]">
                    Deleting an event will cancel it and
                    remove it from the active calendar.
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* UPCOMING EVENTS */}
        {!loading && visibleEvents.length > 0 ? (
          <Card
            title="Upcoming events"
            description="Your next scheduled church activities"
          >
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {visibleEvents
                .filter((event) => {
                  if (!event.startDate) return false;

                  return (
                    new Date(event.startDate).getTime() >=
                    new Date().setHours(0, 0, 0, 0)
                  );
                })
                .slice(0, 6)
                .map((event) => (
                  <button
                    key={event._id}
                    type="button"
                    onClick={() =>
                      setSelectedEvent(event)
                    }
                    className="group rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 text-left transition hover:border-[var(--primary)]/50 hover:bg-[var(--surface)]"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-[var(--surface)]">
                        <span className="text-[10px] uppercase text-[var(--muted)]">
                          {event.startDate
                            ? new Date(
                              event.startDate
                            ).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                              }
                            )
                            : ""}
                        </span>

                        <span className="text-lg font-semibold">
                          {event.startDate
                            ? new Date(
                              event.startDate
                            ).getDate()
                            : ""}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate font-semibold group-hover:text-[var(--primary)]">
                          {event.title ||
                            "Untitled event"}
                        </h3>

                        <p className="mt-1 text-xs text-[var(--muted)]">
                          {formatCategory(
                            event.category
                          )}
                        </p>

                        <p className="mt-2 text-xs text-[var(--muted)]">
                          {formatShortDate(
                            event.startDate
                          )}{" "}
                          • {getEventTime(event)}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
            </div>
          </Card>
        ) : null}
      </div>
    </AppLayout>
  );
}