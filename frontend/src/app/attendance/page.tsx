"use client";

import { useEffect, useState } from "react";
import {
  Check,
  Clock,
  Users,
  UserX,
  RotateCcw,
} from "lucide-react";

import AppLayout from "@/components/layout/AppLayout";
import Card from "@/components/ui/Card";
import Loader from "@/components/ui/Loader";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

import { attendanceService } from "@/services/attendance.service";
import { apiGet } from "@/services/api";

interface Member {
  _id: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  status?: string;
}

interface EventItem {
  _id: string;
  title?: string;
  startDate?: string;
}

interface AttendanceRecord {
  _id?: string;
  date?: string;
  serviceType?: string;
  totalCount?: number;
  memberCount?: number;
  visitorCount?: number;
  childrenCount?: number;
  onlineCount?: number;
}

interface AttendanceStats {
  totalServices?: number;
  present?: number;
  absent?: number;
  late?: number;
  excused?: number;
  weeklyAttendance?: Array<{
    day: string;
    attendance: number;
  }>;
}

type AttendanceStatus =
  | "present"
  | "absent"
  | "late"
  | "excused";

interface MemberAttendance {
  person: string;
  status: AttendanceStatus;
  checkInTime: string | null;
  notes: string;
}

interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
}

interface ListResponse<T> {
  data?: {
    members?: T[];
    events?: T[];
  };
  members?: T[];
  events?: T[];
}

const getMemberName = (member: Member) => {
  const name = `${member.firstName ?? ""} ${member.lastName ?? ""
    }`.trim();

  return name || "Unnamed member";
};

const getEventName = (event: EventItem) => {
  return event.title || "Untitled event";
};

const getApiList = <T,>(
  response: unknown,
  key: "members" | "events"
): T[] => {
  const result = response as ListResponse<T>;

  if (Array.isArray(result?.data?.[key])) {
    return result.data[key]!;
  }

  if (Array.isArray(result?.[key])) {
    return result[key]!;
  }

  if (Array.isArray(result?.data)) {
    return result.data as T[];
  }

  if (Array.isArray(result)) {
    return result as unknown as T[];
  }

  return [];
};

export default function AttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);

  const [stats, setStats] =
    useState<AttendanceStats | null>(null);

  const [loading, setLoading] = useState(true);
  const [membersLoading, setMembersLoading] =
    useState(true);
  const [eventsLoading, setEventsLoading] =
    useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [form, setForm] = useState({
    event: "",
    serviceType: "sunday_service",
    date: new Date().toISOString().slice(0, 10),
    visitorCount: "0",
    childrenCount: "0",
    onlineCount: "0",
  });

  const [memberAttendance, setMemberAttendance] =
    useState<Record<string, MemberAttendance>>({});

  /*
   * Load attendance records and statistics.
   */
  const loadAttendance = async () => {
    try {
      setError("");

      const [listRes, statsRes] =
        await Promise.all([
          attendanceService.list(),
          attendanceService.getStats(),
        ]);

      const listData =
        (listRes?.data as Record<string, unknown>)
          ?.attendance ??
        listRes?.data ??
        [];

      setRecords(
        Array.isArray(listData)
          ? (listData as AttendanceRecord[])
          : []
      );

      /*
       * Backend returns:
       *
       * {
       *   totalServices,
       *   present,
       *   absent,
       *   late,
       *   excused,
       *   weeklyAttendance
       * }
       */
      const statsData =
        (statsRes?.data ??
          statsRes) as AttendanceStats;

      setStats(statsData);
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

  /*
   * Load members.
   *
   * We use the existing API helper directly so this
   * page does not depend on assumptions about the
   * member service implementation.
   */
  const loadMembers = async () => {
    try {
      setMembersLoading(true);

      const response =
        await apiGet<unknown>("/members?limit=1000");

      const list =
        getApiList<Member>(
          response.data,
          "members"
        );

      setMembers(list);

      /*
       * Every member starts as present.
       *
       * This means the user can simply change the
       * people who are absent/late/excused.
       */
      const initial: Record<
        string,
        MemberAttendance
      > = {};

      list.forEach((member) => {
        initial[member._id] = {
          person: member._id,
          status: "present",
          checkInTime: null,
          notes: "",
        };
      });

      setMemberAttendance(initial);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load members"
      );
    } finally {
      setMembersLoading(false);
    }
  };

  /*
   * Load events.
   *
   * Attendance.js requires event, so the user must
   * select an event before saving attendance.
   */
  const loadEvents = async () => {
    try {
      setEventsLoading(true);

      const response =
        await apiGet<unknown>("/events?limit=1000");

      const list =
        getApiList<EventItem>(
          response.data,
          "events"
        );

      setEvents(list);

      /*
       * Automatically select the first event if
       * there is only one available.
       */
      if (list.length === 1) {
        setForm((current) => ({
          ...current,
          event: list[0]._id,
        }));
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load events"
      );
    } finally {
      setEventsLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      await Promise.all([
        loadAttendance(),
        loadMembers(),
        loadEvents(),
      ]);
    };

    void load();
  }, []);

  /*
   * Change a member's attendance status.
   */
  const setMemberStatus = (
    memberId: string,
    status: AttendanceStatus
  ) => {
    setMemberAttendance((current) => ({
      ...current,
      [memberId]: {
        ...(current[memberId] ?? {
          person: memberId,
          checkInTime: null,
          notes: "",
        }),
        person: memberId,
        status,
      },
    }));
  };

  /*
   * Mark everybody present.
   */
  const markAllPresent = () => {
    setMemberAttendance((current) => {
      const updated = {
        ...current,
      };

      members.forEach((member) => {
        updated[member._id] = {
          ...(updated[member._id] ?? {
            person: member._id,
            checkInTime: null,
            notes: "",
          }),
          person: member._id,
          status: "present",
        };
      });

      return updated;
    });
  };

  /*
   * Reset attendance form.
   */
  const resetForm = () => {
    const initial: Record<
      string,
      MemberAttendance
    > = {};

    members.forEach((member) => {
      initial[member._id] = {
        person: member._id,
        status: "present",
        checkInTime: null,
        notes: "",
      };
    });

    setMemberAttendance(initial);

    setForm({
      event:
        events.length === 1
          ? events[0]._id
          : "",
      serviceType: "sunday_service",
      date: new Date()
        .toISOString()
        .slice(0, 10),
      visitorCount: "0",
      childrenCount: "0",
      onlineCount: "0",
    });

    setError("");
  };

  /*
   * Save attendance.
   */
  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setError("");

    /*
     * Attendance model requires an event.
     */
    if (!form.event) {
      setError(
        "Please select an event before recording attendance."
      );
      return;
    }

    /*
     * Attendance records are required by the backend.
     */
    if (members.length === 0) {
      setError(
        "There are no members available to record attendance."
      );
      return;
    }

    const records = members.map((member) => {
      const attendance =
        memberAttendance[member._id];

      return {
        person: member._id,
        status:
          attendance?.status ?? "present",
        checkInTime:
          attendance?.checkInTime ?? null,
        notes:
          attendance?.notes ?? "",
      };
    });

    try {
      setSaving(true);

      await attendanceService.create({
        event: form.event,

        serviceType:
          form.serviceType,

        records,

        visitorCount:
          Number(form.visitorCount) || 0,

        childrenCount:
          Number(form.childrenCount) || 0,

        onlineCount:
          Number(form.onlineCount) || 0,

        date: form.date,
      });

      await loadAttendance();

      resetForm();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save attendance"
      );
    } finally {
      setSaving(false);
    }
  };

  const presentCount = members.filter(
    (member) =>
      memberAttendance[member._id]?.status ===
      "present"
  ).length;

  const absentCount = members.filter(
    (member) =>
      memberAttendance[member._id]?.status ===
      "absent"
  ).length;

  const lateCount = members.filter(
    (member) =>
      memberAttendance[member._id]?.status ===
      "late"
  ).length;

  const excusedCount = members.filter(
    (member) =>
      memberAttendance[member._id]?.status ===
      "excused"
  ).length;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* ===================================================== */}
        {/* PAGE HEADER                                           */}
        {/* ===================================================== */}

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--primary)]">
            Attendance
          </p>

          <h1 className="mt-2 text-3xl font-semibold">
            Track church attendance
          </h1>

          <p className="mt-2 text-sm text-[var(--muted)]">
            Record member attendance and service
            attendance with quick summaries.
          </p>
        </div>

        {/* ===================================================== */}
        {/* ERROR                                                 */}
        {/* ===================================================== */}

        {error ? (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        ) : null}

        {/* ===================================================== */}
        {/* STATISTICS                                             */}
        {/* ===================================================== */}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <Card
            title="Present"
            description="Members marked present"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--surface-2)]">
                <Check
                  size={20}
                  className="text-green-400"
                />
              </div>

              <div className="text-3xl font-semibold">
                {stats?.present ?? presentCount}
              </div>
            </div>
          </Card>

          <Card
            title="Absent"
            description="Absences recorded"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--surface-2)]">
                <UserX
                  size={20}
                  className="text-red-400"
                />
              </div>

              <div className="text-3xl font-semibold">
                {stats?.absent ?? absentCount}
              </div>
            </div>
          </Card>

          <Card
            title="Late"
            description="Late arrivals"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--surface-2)]">
                <Clock
                  size={20}
                  className="text-yellow-400"
                />
              </div>

              <div className="text-3xl font-semibold">
                {stats?.late ?? lateCount}
              </div>
            </div>
          </Card>

          <Card
            title="Excused"
            description="Excused absences"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--surface-2)]">
                <Users
                  size={20}
                  className="text-blue-400"
                />
              </div>

              <div className="text-3xl font-semibold">
                {stats?.excused ?? excusedCount}
              </div>
            </div>
          </Card>
        </div>

        {/* ===================================================== */}
        {/* ATTENDANCE FORM                                        */}
        {/* ===================================================== */}

        <Card
          title="Mark attendance"
          description="Select the service and mark each member's attendance."
        >
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Event / Service / Date */}
            <div className="grid gap-4 lg:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Event
                </label>

                {eventsLoading ? (
                  <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-sm text-[var(--muted)]">
                    Loading events...
                  </div>
                ) : (
                  <select
                    value={form.event}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        event: e.target.value,
                      })
                    }
                    required
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-sm outline-none transition focus:border-[var(--primary)]"
                  >
                    <option value="">
                      Select an event
                    </option>

                    {events.map((event) => (
                      <option
                        key={event._id}
                        value={event._id}
                      >
                        {getEventName(event)}
                        {event.startDate
                          ? ` — ${new Date(
                            event.startDate
                          ).toLocaleDateString()}`
                          : ""}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Service type
                </label>

                <select
                  value={form.serviceType}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      serviceType:
                        e.target.value,
                    })
                  }
                  required
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-sm outline-none transition focus:border-[var(--primary)]"
                >
                  <option value="sunday_service">
                    Sunday Service
                  </option>

                  <option value="midweek_service">
                    Midweek Service
                  </option>

                  <option value="special_service">
                    Special Service
                  </option>

                  <option value="prayer_meeting">
                    Prayer Meeting
                  </option>

                  <option value="other">
                    Other
                  </option>
                </select>
              </div>

              <Input
                label="Attendance date"
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm({
                    ...form,
                    date: e.target.value,
                  })
                }
                required
              />
            </div>

            {/* Member status summary */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold">
                    Member attendance
                  </p>

                  <p className="mt-1 text-xs text-[var(--muted)]">
                    {members.length} member
                    {members.length === 1
                      ? ""
                      : "s"} available
                  </p>
                </div>

                <Button
                  type="button"
                  variant="secondary"
                  onClick={markAllPresent}
                  disabled={
                    membersLoading ||
                    members.length === 0
                  }
                >
                  <Check
                    size={16}
                    className="mr-2"
                  />
                  Mark all present
                </Button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-lg bg-[var(--surface)] p-3">
                  <p className="text-xs text-[var(--muted)]">
                    Present
                  </p>
                  <p className="mt-1 text-lg font-semibold text-green-400">
                    {presentCount}
                  </p>
                </div>

                <div className="rounded-lg bg-[var(--surface)] p-3">
                  <p className="text-xs text-[var(--muted)]">
                    Absent
                  </p>
                  <p className="mt-1 text-lg font-semibold text-red-400">
                    {absentCount}
                  </p>
                </div>

                <div className="rounded-lg bg-[var(--surface)] p-3">
                  <p className="text-xs text-[var(--muted)]">
                    Late
                  </p>
                  <p className="mt-1 text-lg font-semibold text-yellow-400">
                    {lateCount}
                  </p>
                </div>

                <div className="rounded-lg bg-[var(--surface)] p-3">
                  <p className="text-xs text-[var(--muted)]">
                    Excused
                  </p>
                  <p className="mt-1 text-lg font-semibold text-blue-400">
                    {excusedCount}
                  </p>
                </div>
              </div>
            </div>

            {/* Members */}
            {membersLoading ? (
              <Loader label="Loading members" />
            ) : members.length === 0 ? (
              <EmptyState
                title="No members available"
                description="Add members before recording member attendance."
              />
            ) : (
              <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-[var(--surface-2)] text-[var(--muted)]">
                    <tr>
                      <th className="px-4 py-3">
                        Member
                      </th>

                      <th className="px-4 py-3">
                        Present
                      </th>

                      <th className="px-4 py-3">
                        Absent
                      </th>

                      <th className="px-4 py-3">
                        Late
                      </th>

                      <th className="px-4 py-3">
                        Excused
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {members.map((member) => {
                      const selected =
                        memberAttendance[
                          member._id
                        ]?.status;

                      return (
                        <tr
                          key={member._id}
                          className="border-t border-[var(--border)]/70"
                        >
                          <td className="px-4 py-3">
                            <div className="font-medium">
                              {getMemberName(
                                member
                              )}
                            </div>

                            {member.phone ? (
                              <div className="mt-0.5 text-xs text-[var(--muted)]">
                                {member.phone}
                              </div>
                            ) : null}
                          </td>

                          <td className="px-4 py-3">
                            <button
                              type="button"
                              aria-label={`Mark ${getMemberName(
                                member
                              )} present`}
                              onClick={() =>
                                setMemberStatus(
                                  member._id,
                                  "present"
                                )
                              }
                              className={`flex h-9 w-9 items-center justify-center rounded-lg border transition ${selected ===
                                  "present"
                                  ? "border-green-500 bg-green-500/20 text-green-400"
                                  : "border-[var(--border)] text-[var(--muted)] hover:border-green-500/50"
                                }`}
                            >
                              <Check
                                size={16}
                              />
                            </button>
                          </td>

                          <td className="px-4 py-3">
                            <button
                              type="button"
                              aria-label={`Mark ${getMemberName(
                                member
                              )} absent`}
                              onClick={() =>
                                setMemberStatus(
                                  member._id,
                                  "absent"
                                )
                              }
                              className={`flex h-9 w-9 items-center justify-center rounded-lg border transition ${selected ===
                                  "absent"
                                  ? "border-red-500 bg-red-500/20 text-red-400"
                                  : "border-[var(--border)] text-[var(--muted)] hover:border-red-500/50"
                                }`}
                            >
                              <UserX
                                size={16}
                              />
                            </button>
                          </td>

                          <td className="px-4 py-3">
                            <button
                              type="button"
                              aria-label={`Mark ${getMemberName(
                                member
                              )} late`}
                              onClick={() =>
                                setMemberStatus(
                                  member._id,
                                  "late"
                                )
                              }
                              className={`flex h-9 w-9 items-center justify-center rounded-lg border transition ${selected ===
                                  "late"
                                  ? "border-yellow-500 bg-yellow-500/20 text-yellow-400"
                                  : "border-[var(--border)] text-[var(--muted)] hover:border-yellow-500/50"
                                }`}
                            >
                              <Clock
                                size={16}
                              />
                            </button>
                          </td>

                          <td className="px-4 py-3">
                            <button
                              type="button"
                              aria-label={`Mark ${getMemberName(
                                member
                              )} excused`}
                              onClick={() =>
                                setMemberStatus(
                                  member._id,
                                  "excused"
                                )
                              }
                              className={`flex h-9 w-9 items-center justify-center rounded-lg border transition ${selected ===
                                  "excused"
                                  ? "border-blue-500 bg-blue-500/20 text-blue-400"
                                  : "border-[var(--border)] text-[var(--muted)] hover:border-blue-500/50"
                                }`}
                            >
                              <Users
                                size={16}
                              />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Additional attendance counts */}
            <div>
              <p className="mb-3 text-sm font-semibold">
                Additional attendance
              </p>

              <div className="grid gap-4 sm:grid-cols-3">
                <Input
                  label="Visitors"
                  type="number"
                  min="0"
                  value={
                    form.visitorCount
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      visitorCount:
                        e.target.value,
                    })
                  }
                />

                <Input
                  label="Children"
                  type="number"
                  min="0"
                  value={
                    form.childrenCount
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      childrenCount:
                        e.target.value,
                    })
                  }
                />

                <Input
                  label="Online"
                  type="number"
                  min="0"
                  value={
                    form.onlineCount
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      onlineCount:
                        e.target.value,
                    })
                  }
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={resetForm}
                disabled={saving}
              >
                <RotateCcw
                  size={16}
                  className="mr-2"
                />
                Reset
              </Button>

              <Button
                type="submit"
                disabled={
                  saving ||
                  membersLoading ||
                  eventsLoading ||
                  members.length === 0 ||
                  !form.event
                }
              >
                <Check
                  size={16}
                  className="mr-2"
                />

                {saving
                  ? "Saving attendance…"
                  : "Save attendance"}
              </Button>
            </div>
          </form>
        </Card>

        {/* ===================================================== */}
        {/* ATTENDANCE HISTORY                                     */}
        {/* ===================================================== */}

        <Card
          title="Attendance records"
          description="Recent attendance captures"
        >
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
                    <th className="px-3 py-3">
                      Date
                    </th>

                    <th className="px-3 py-3">
                      Service
                    </th>

                    <th className="px-3 py-3">
                      Members
                    </th>

                    <th className="px-3 py-3">
                      Visitors
                    </th>

                    <th className="px-3 py-3">
                      Children
                    </th>

                    <th className="px-3 py-3">
                      Online
                    </th>

                    <th className="px-3 py-3">
                      Total
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {records.map(
                    (record, index) => (
                      <tr
                        key={
                          record._id ||
                          `${record.date ||
                          "attendance"
                          }-${index}`
                        }
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
                          {record.serviceType
                            ? record.serviceType
                              .replace(
                                /_/g,
                                " "
                              )
                              .replace(
                                /\b\w/g,
                                (char) =>
                                  char.toUpperCase()
                              )
                            : "—"}
                        </td>

                        <td className="px-3 py-3">
                          {record.memberCount ??
                            0}
                        </td>

                        <td className="px-3 py-3">
                          {record.visitorCount ??
                            0}
                        </td>

                        <td className="px-3 py-3">
                          {record.childrenCount ??
                            0}
                        </td>

                        <td className="px-3 py-3">
                          {record.onlineCount ??
                            0}
                        </td>

                        <td className="px-3 py-3 font-semibold">
                          {record.totalCount ??
                            0}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </AppLayout>
  );
}