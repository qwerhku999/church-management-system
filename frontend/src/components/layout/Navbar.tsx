"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Search, Menu, ChevronDown, User, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { NAV_ITEMS, ROLE_LABELS, type Role } from "@/constants/roles";
import { getDisplayName, getInitials } from "@/utils/helpers";

function usePageTitle() {
  const pathname = usePathname();
  if (pathname === "/") return "Dashboard";
  const match = NAV_ITEMS.find((i) => i.href !== "/" && pathname.startsWith(i.href));
  if (match) return match.title;
  const seg = pathname.split("/").filter(Boolean)[0] ?? "";
  return seg.charAt(0).toUpperCase() + seg.slice(1);
}

export default function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
  const title = usePageTitle();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const name = getDisplayName(user);
  const roleLabel = ROLE_LABELS[(user?.role as Role) ?? "member"] ?? "Member";

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-[#070b17]/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between gap-4 px-4 lg:px-8">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/5 bg-[#0F172A] text-slate-300 transition hover:border-indigo-500/50 lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>
          <div>
            <h1 className="font-display text-lg font-bold tracking-tight text-white lg:text-xl">{title}</h1>
            <p className="hidden text-xs text-[var(--muted)] sm:block">Welcome back, {name.split(" ")[0]}</p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative hidden xl:block">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search members, events..."
              className="h-10 w-72 rounded-xl border border-white/5 bg-[#0F172A] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            />
          </div>

          <Link
            href="/notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/5 bg-[#0F172A] text-slate-300 transition hover:border-indigo-500/50 hover:text-white"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-[#070b17]" />
          </Link>

          {/* User menu */}
          <div className="relative" ref={ref}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 rounded-xl border border-white/5 bg-[#0F172A] py-1.5 pl-1.5 pr-2 transition hover:border-indigo-500/50 sm:pr-3"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 text-xs font-bold text-white">
                {getInitials(name)}
              </div>
              <div className="hidden text-left lg:block">
                <p className="text-sm font-semibold leading-tight text-white">{name}</p>
                <p className="text-xs leading-tight text-slate-400">{roleLabel}</p>
              </div>
              <ChevronDown size={15} className="hidden text-slate-500 lg:block" />
            </button>

            {menuOpen ? (
              <div className="absolute right-0 mt-2 w-56 origin-top-right animate-fade-in rounded-2xl border border-white/10 bg-[#0F172A] p-2 shadow-2xl">
                <div className="border-b border-white/5 px-3 py-2">
                  <p className="truncate text-sm font-semibold text-white">{name}</p>
                  <p className="truncate text-xs text-slate-400">{user?.email ?? "—"}</p>
                </div>
                <div className="mt-1 space-y-0.5">
                  <Link href="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white">
                    <User size={16} /> Profile
                  </Link>
                  <Link href="/settings" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white">
                    <Settings size={16} /> Settings
                  </Link>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      logout();
                      router.push("/login");
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
                  >
                    <LogOut size={16} /> Log out
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
