import AttendanceChart from "./AttendanceChart";
import DonationChart from "./DonationChart";
import RecentMembers from "./RecentMembers";
import {
  ArrowUpRight,
  CalendarDays,
  Clock3,
} from "lucide-react";

export default function DashboardGrid() {
  return (
    <section className="mt-8 space-y-6">

      {/* Top Row */}

      <div className="grid gap-6 xl:grid-cols-12">

        {/* Attendance */}

        <div className="card hover-card xl:col-span-8 p-6">

          <div className="mb-6 flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-slate-400">
                Analytics
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                Attendance Overview
              </h2>

            </div>

            <button className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500">
              This Week
            </button>

          </div>

          <AttendanceChart />

        </div>

        {/* Right Panel */}

        <div className="space-y-6 xl:col-span-4">

          {/* Donations */}

          <div className="card hover-card p-6">

            <div className="mb-5 flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-400">
                  Finance
                </p>

                <h2 className="text-xl font-bold">
                  Donations
                </h2>

              </div>

              <ArrowUpRight className="text-emerald-400" />

            </div>

            <DonationChart />

          </div>

          {/* Quick Actions */}

          <div className="card p-6">

            <h2 className="mb-5 text-xl font-bold">
              Quick Actions
            </h2>

            <div className="grid grid-cols-2 gap-3">

              <button className="rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold transition hover:bg-indigo-500">
                Add Member
              </button>

              <button className="rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-sm transition hover:bg-white/10">
                New Event
              </button>

              <button className="rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-sm transition hover:bg-white/10">
                Attendance
              </button>

              <button className="rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-sm transition hover:bg-white/10">
                Reports
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* Bottom */}

      <div className="grid gap-6 xl:grid-cols-12">

        {/* Members */}

        <div className="card hover-card xl:col-span-8 p-6">

          <RecentMembers />

        </div>

        {/* Events */}

        <div className="card hover-card xl:col-span-4 p-6">

          <div className="mb-6 flex items-center justify-between">

            <h2 className="text-xl font-bold">
              Upcoming Events
            </h2>

            <CalendarDays
              size={20}
              className="text-indigo-400"
            />

          </div>

          <div className="space-y-4">

            {[
              {
                title: "Sunday Worship",
                time: "Sunday • 8:00 AM",
              },
              {
                title: "Youth Fellowship",
                time: "Friday • 6:00 PM",
              },
              {
                title: "Choir Rehearsal",
                time: "Saturday • 4:00 PM",
              },
            ].map((event) => (
              <div
                key={event.title}
                className="rounded-2xl border border-white/5 bg-white/5 p-4 transition hover:border-indigo-500/30 hover:bg-white/10"
              >
                <h3 className="font-semibold">
                  {event.title}
                </h3>

                <div className="mt-2 flex items-center gap-2 text-sm text-slate-400">
                  <Clock3 size={14} />
                  {event.time}
                </div>
              </div>
            ))}

          </div>

        </div>

      </div>

    </section>
  );
}