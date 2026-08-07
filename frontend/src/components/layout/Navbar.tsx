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
    <header className="glass sticky top-0 z-30 border-b border-[var(--border)]">
      <div className="flex h-16 items-center justify-between gap-4 px-4 lg:px-8">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] transition hover:border-[var(--border-strong)] hover:text-[var(--text)] lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>
          <div>
            <h1 className="font-display text-lg font-bold tracking-tight text-[var(--text)]">{title}</h1>
            <p className="hidden text-xs text-[var(--muted)] sm:block">Welcome back, {name.split(" ")[0]}</p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative hidden xl:block">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
            <input
              type="text"
              placeholder="Search members, events..."
              className="focus-ring h-10 w-72 rounded-lg border border-[var(--border)] bg-[var(--surface)] pl-10 pr-4 text-sm text-[var(--text)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--primary)]"
            />
          </div>

          <Link
            href="/notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] transition hover:border-[var(--border-strong)] hover:text-[var(--text)]"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-[var(--danger)] ring-2 ring-[var(--bg)]" />
          </Link>

          {/* User menu */}
          <div className="relative" ref={ref}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] py-1.5 pl-1.5 pr-2 transition hover:border-[var(--border-strong)] sm:pr-3"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--surface-hover)] text-xs font-semibold text-[var(--muted-strong)]">
                {getInitials(name)}
              </div>
              <div className="hidden text-left lg:block">
                <p className="text-sm font-semibold leading-tight text-[var(--text)]">{name}</p>
                <p className="text-xs leading-tight text-[var(--muted)]">{roleLabel}</p>
              </div>
              <ChevronDown size={15} className="hidden text-[var(--muted)] lg:block" />
            </button>

            {menuOpen ? (
              <div className="absolute right-0 mt-2 w-56 origin-top-right animate-fade-in rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-1.5 shadow-[var(--shadow)]">
                <div className="border-b border-[var(--border)] px-3 py-2">
                  <p className="truncate text-sm font-semibold text-[var(--text)]">{name}</p>
                  <p className="truncate text-xs text-[var(--muted)]">{user?.email ?? "—"}</p>
                </div>
                <div className="mt-1 space-y-0.5">
                  <Link href="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-[var(--muted-strong)] hover:bg-[var(--surface-hover)] hover:text-[var(--text)]">
                    <User size={16} /> Profile
                  </Link>
                  <Link href="/settings" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-[var(--muted-strong)] hover:bg-[var(--surface-hover)] hover:text-[var(--text)]">
                    <Settings size={16} /> Settings
                  </Link>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      logout();
                      router.push("/login");
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-[var(--danger)] hover:bg-[var(--danger)]/10"
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
