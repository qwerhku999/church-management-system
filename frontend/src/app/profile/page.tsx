"use client";

import Link from "next/link";
import { Mail, Shield, Settings as SettingsIcon, Calendar } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { getDisplayName, getInitials } from "@/utils/helpers";
import { ROLE_LABELS, type Role } from "@/constants/roles";

export default function ProfilePage() {
  const { user } = useAuth();
  const name = getDisplayName(user);
  const roleLabel = ROLE_LABELS[(user?.role as Role) ?? "member"] ?? "Member";

  const details = [
    { icon: Mail, label: "Email", value: user?.email ?? "—" },
    { icon: Shield, label: "Role", value: roleLabel },
    { icon: Calendar, label: "Member since", value: "2026" },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--primary)]">Profile</p>
          <h1 className="mt-2 text-3xl font-semibold">Your account</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">A quick overview of your MinistryFlow identity.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <Card className="flex flex-col items-center text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-3xl font-bold text-white shadow-lg shadow-[var(--primary)]/25">
              {getInitials(name)}
            </div>
            <h2 className="mt-4 font-display text-xl font-bold">{name}</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">{user?.email ?? "—"}</p>
            <span className="mt-3 rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1 text-xs font-medium uppercase tracking-wide text-[var(--primary)]">
              {roleLabel}
            </span>
            <Link href="/settings" className="mt-6 w-full">
              <Button variant="secondary" className="w-full">
                <SettingsIcon size={16} className="mr-2" /> Edit in settings
              </Button>
            </Link>
          </Card>

          <Card title="Account details" description="Information linked to your account.">
            <div className="space-y-3">
              {details.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--primary)]">
                    <Icon size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wide text-[var(--muted)]">{label}</p>
                    <p className="truncate text-sm font-medium">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
