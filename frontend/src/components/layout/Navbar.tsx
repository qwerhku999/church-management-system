"use client";

import {
  Bell,
  Search,
  Settings,
  ChevronDown,
} from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-[var(--background)]/90 backdrop-blur-2xl">

      <div className="flex h-16 items-center justify-between px-6 lg:px-8">

        {/* Left */}

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Dashboard
          </h1>

          <p className="mt-0.5 text-xs text-[var(--muted)]">
            Welcome back, Administrator
          </p>
        </div>

        {/* Right */}

        <div className="flex items-center gap-3">

          {/* Search */}

          <div className="relative hidden xl:block">

            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              type="text"
              placeholder="Search..."
              className="h-11 w-80 rounded-2xl border border-white/5 bg-[#0F172A] pl-11 pr-4 text-sm text-white outline-none transition-all duration-200 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            />

          </div>

          {/* Notification */}

          <button className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/5 bg-[#0F172A] transition-all duration-200 hover:border-indigo-500 hover:bg-indigo-500/10">

            <Bell size={18} />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />

          </button>

          {/* Settings */}

          <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/5 bg-[#0F172A] transition-all duration-200 hover:border-indigo-500 hover:bg-indigo-500/10">
            <Settings size={18} />
          </button>

          {/* User */}

          <button className="flex items-center gap-3 rounded-2xl border border-white/5 bg-[#0F172A] px-3 py-2 transition-all duration-200 hover:border-indigo-500">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-blue-500 font-semibold text-white">
              A
            </div>

            <div className="hidden text-left lg:block">
              <p className="text-sm font-semibold text-white">
                Administrator
              </p>

              <p className="text-xs text-slate-400">
                Super Admin
              </p>
            </div>

            <ChevronDown
              size={16}
              className="hidden text-slate-500 lg:block"
            />

          </button>

        </div>

      </div>

    </header>
  );
}