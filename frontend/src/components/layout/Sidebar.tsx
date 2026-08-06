"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  CalendarDays,
  Building2,
  Wallet,
  HeartHandshake,
  FileText,
  Bell,
  BarChart3,
  Settings,
  ChevronRight,
} from "lucide-react";

const menu = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Members", href: "/members", icon: Users },
  { title: "Attendance", href: "/attendance", icon: UserCheck },
  { title: "Events", href: "/events", icon: CalendarDays },
  { title: "Ministries", href: "/ministries", icon: Building2 },
  { title: "Finance", href: "/finance", icon: Wallet },
  { title: "Prayer Requests", href: "/prayers", icon: HeartHandshake },
  { title: "Documents", href: "/documents", icon: FileText },
  { title: "Notifications", href: "/notifications", icon: Bell },
  { title: "Reports", href: "/reports", icon: BarChart3 },
  { title: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-[270px] shrink-0 flex-col border-r border-white/5 bg-[#0A0F1D]">

      {/* Logo */}

      <div className="px-7 pt-8 pb-7">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-500 text-xl font-bold text-white shadow-lg">
            M
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              MinistryFlow
            </h1>

            <p className="text-xs text-slate-500">
              Church Management
            </p>
          </div>
        </div>
      </div>

      <div className="mx-5 h-px bg-white/5" />

      {/* Navigation */}

      <nav className="flex-1 overflow-y-auto px-5 py-6">
        <div className="space-y-1.5">
          {menu.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.title}
                href={item.href}
                className={`group flex items-center justify-between rounded-2xl px-4 py-3 transition-all duration-200 ${
                  active
                    ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/20"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-4">
                  <Icon size={19} />
                  <span className="text-sm font-medium">
                    {item.title}
                  </span>
                </div>

                {active && <ChevronRight size={16} />}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}

      <div className="border-t border-white/5 p-5">

        <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-600 font-bold text-white">
              A
            </div>

            <div>
              <h3 className="font-semibold text-white">
                Administrator
              </h3>

              <p className="text-xs text-slate-400">
                Super Admin
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 text-center">
          <p className="text-xs font-semibold text-slate-300">
            MinistryFlow v1.0.0
          </p>

          <p className="mt-1 text-[11px] text-slate-500">
            © 2026
          </p>

          <p className="text-[11px] text-slate-500">
            Developed by
          </p>

          <p className="text-xs font-semibold text-indigo-400">
            N.K. AMMONOH
          </p>
        </div>
      </div>
    </aside>
  );
}