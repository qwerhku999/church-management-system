"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, LogOut, Church } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import {
  filterNavByRole,
  NAV_GROUPS,
  ROLE_LABELS,
  type Role,
} from "@/constants/roles";
import { getDisplayName, getInitials } from "@/utils/helpers";
import churchSettingsService, {
  ChurchSettings,
} from "@/services/churchSettings.service";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(
    /\/api\/?$/,
    ""
  ) || "http://localhost:5000";

function getLogoUrl(logo?: string | null) {
  if (!logo) {
    return "";
  }

  let value = String(logo).trim();

  if (!value) {
    return "";
  }

  value = value.replace(/\\/g, "/");

  if (
    value.startsWith("data:") ||
    value.startsWith("blob:")
  ) {
    return value;
  }

  if (
    value.startsWith("http://") ||
    value.startsWith("https://")
  ) {
    try {
      const url = new URL(value);

      if (url.pathname.includes("/uploads/")) {
        const uploadsIndex =
          url.pathname.indexOf("/uploads/");

        return `${BACKEND_URL}${url.pathname.substring(
          uploadsIndex
        )}${url.search}`;
      }

      return value;
    } catch {
      return value;
    }
  }

  const uploadsIndex = value.indexOf("/uploads/");

  if (uploadsIndex !== -1) {
    return `${BACKEND_URL}${value.substring(
      uploadsIndex
    )}`;
  }

  if (value.startsWith("uploads/")) {
    return `${BACKEND_URL}/${value}`;
  }

  if (value.startsWith("/")) {
    return `${BACKEND_URL}${value}`;
  }

  return `${BACKEND_URL}/uploads/${value}`;
}

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({
  open,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const [church, setChurch] =
    useState<ChurchSettings | null>(null);

  const [logoUrl, setLogoUrl] = useState("");

  const items = filterNavByRole(user?.role);

  const name = getDisplayName(user);

  const roleLabel =
    ROLE_LABELS[(user?.role as Role) ?? "member"] ??
    "Member";

  const loadChurchSettings = async () => {
    try {
      const settings =
        await churchSettingsService.getSettings();

      setChurch(settings);
    } catch {
      setChurch(null);
    }
  };

  /*
   * Load church settings.
   */
  useEffect(() => {
    loadChurchSettings();

    const handleChurchSettingsUpdated = () => {
      loadChurchSettings();
    };

    window.addEventListener(
      "ministryflow:church-settings-updated",
      handleChurchSettingsUpdated
    );

    return () => {
      window.removeEventListener(
        "ministryflow:church-settings-updated",
        handleChurchSettingsUpdated
      );
    };
  }, []);

  /*
   * Fetch the logo as a Blob so the sidebar
   * does not depend on the browser rendering
   * the backend upload URL directly.
   */
  useEffect(() => {
    let cancelled = false;
    let objectUrl = "";

    const loadLogo = async () => {
      if (!church?.logo) {
        setLogoUrl("");
        return;
      }

      const url = getLogoUrl(church.logo);

      if (!url) {
        setLogoUrl("");
        return;
      }

      try {
        const response = await fetch(url, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(
            `Logo request failed: ${response.status}`
          );
        }

        const blob = await response.blob();

        if (!blob.type.startsWith("image/")) {
          throw new Error(
            "Backend did not return an image."
          );
        }

        objectUrl = URL.createObjectURL(blob);

        if (!cancelled) {
          setLogoUrl(objectUrl);
        }
      } catch {
        if (!cancelled) {
          setLogoUrl("");
        }
      }
    };

    loadLogo();

    return () => {
      cancelled = true;

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [church?.logo]);

  return (
    <>
      {open ? (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-screen w-[264px] shrink-0 flex-col border-r border-[var(--border)] bg-[var(--surface)] transition-transform duration-300 lg:static lg:translate-x-0",
          open
            ? "translate-x-0"
            : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 pb-5 pt-6">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-3"
            onClick={onClose}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[var(--primary)] text-base font-bold text-white">
              {logoUrl ? (
                <img
                  key={logoUrl}
                  src={logoUrl}
                  alt={
                    church?.churchName ||
                    "Church logo"
                  }
                  className="h-full w-full object-cover"
                />
              ) : (
                <Church size={20} />
              )}
            </div>

            <div className="min-w-0">
              <h1 className="truncate font-display text-[15px] font-bold tracking-tight text-[var(--text)]">
                {church?.churchName ||
                  "MinistryFlow"}
              </h1>

              <p className="truncate text-[11px] text-[var(--muted)]">
                Church OS
              </p>
            </div>
          </Link>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--text)] lg:hidden"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mx-5 h-px bg-[var(--border)]" />

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-5">
          {NAV_GROUPS.map((group) => {
            const groupItems = items.filter(
              (i) => i.group === group
            );

            if (groupItems.length === 0) {
              return null;
            }

            return (
              <div
                key={group}
                className="mb-5"
              >
                <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]/70">
                  {group}
                </p>

                <div className="space-y-0.5">
                  {groupItems.map((item) => {
                    const Icon = item.icon;

                    const active =
                      pathname === item.href ||
                      (item.href !== "/" &&
                        pathname.startsWith(
                          item.href
                        ));

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150",
                          active
                            ? "bg-[var(--primary-soft)] text-[var(--text)]"
                            : "text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--text)]"
                        )}
                      >
                        {active ? (
                          <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-[var(--primary)]" />
                        ) : null}

                        <Icon
                          size={18}
                          className={
                            active
                              ? "text-[var(--primary)]"
                              : "text-[var(--muted)] group-hover:text-[var(--text)]"
                          }
                        />

                        <span>
                          {item.title}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Footer / user */}
        <div className="border-t border-[var(--border)] p-3">
          <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--surface-hover)] text-sm font-semibold text-[var(--muted-strong)]">
              {getInitials(name)}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[var(--text)]">
                {name}
              </p>

              <p className="truncate text-xs text-[var(--muted)]">
                {roleLabel}
              </p>
            </div>

            <button
              onClick={logout}
              className="rounded-lg p-2 text-[var(--muted)] transition hover:bg-[var(--danger)]/10 hover:text-[var(--danger)]"
              aria-label="Log out"
            >
              <LogOut size={16} />
            </button>
          </div>

          <p className="mt-2.5 text-center text-[11px] text-[var(--muted)]/60">
            MinistryFlow v1.0 · © 2026
          </p>
        </div>
      </aside>
    </>
  );
}