"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { filterNavByRole, NAV_GROUPS, ROLE_LABELS, type Role } from "@/constants/roles";
import { getDisplayName, getInitials } from "@/utils/helpers";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const items = filterNavByRole(user?.role);
  const name = getDisplayName(user);
  const roleLabel = ROLE_LABELS[(user?.role as Role) ?? "member"] ?? "Member";

  return (
    <>
      {/* Mobile overlay */}
      {open ? (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-screen w-[272px] shrink-0 flex-col border-r border-white/5 bg-[#0A0F1D] transition-transform duration-300 lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 pb-6 pt-7">
          <Link href="/" className="flex items-center gap-3" onClick={onClose}>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 text-lg font-bold text-white shadow-lg shadow-indigo-500/25">
              M
            </div>
            <div>
              <h1 className="font-display text-lg font-bold tracking-tight text-white">MinistryFlow</h1>
              <p className="text-xs text-slate-500">Church OS</p>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mx-5 h-px bg-white/5" />

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-5">
          {NAV_GROUPS.map((group) => {
            const groupItems = items.filter((i) => i.group === group);
            if (groupItems.length === 0) return null;
            return (
              <div key={group} className="mb-5">
                <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                  {group}
                </p>
                <div className="space-y-1">
                  {groupItems.map((item) => {
                    const Icon = item.icon;
                    const active =
                      pathname === item.href ||
                      (item.href !== "/" && pathname.startsWith(item.href));
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                          active
                            ? "bg-gradient-to-r from-indigo-500/90 to-blue-600/90 text-white shadow-lg shadow-indigo-500/20"
                            : "text-slate-400 hover:bg-white/5 hover:text-white"
                        )}
                      >
                        <Icon size={18} className={active ? "text-white" : "text-slate-500 group-hover:text-white"} />
                        <span>{item.title}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Footer / user */}
        <div className="border-t border-white/5 p-4">
          <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-sm font-bold text-white">
              {getInitials(name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">{name}</p>
              <p className="truncate text-xs text-slate-400">{roleLabel}</p>
            </div>
            <button
              onClick={logout}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
              aria-label="Log out"
            >
              <LogOut size={16} />
            </button>
          </div>
          <p className="mt-3 text-center text-[11px] text-slate-600">
            MinistryFlow v1.0 · © 2026
          </p>
        </div>
      </aside>
    </>
  );
}
