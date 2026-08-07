"use client";

import { useState } from "react";
import { User, Church, Bell, Lock, Save } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/auth.service";
import { toast } from "@/components/ui/Toast";
import { getDisplayName } from "@/utils/helpers";
import { cn } from "@/lib/utils";

type TabKey = "profile" | "church" | "notifications" | "security";

const TABS: { key: TabKey; label: string; icon: typeof User }[] = [
  { key: "profile", label: "Profile", icon: User },
  { key: "church", label: "Church", icon: Church },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "security", label: "Security", icon: Lock },
];

interface ToggleProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

function Toggle({ label, description, checked, onChange }: ToggleProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="mt-0.5 text-xs text-[var(--muted)]">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-[var(--primary)]" : "bg-[var(--surface-hover)]"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform",
            checked ? "translate-x-[22px]" : "translate-x-0.5"
          )}
        />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<TabKey>("profile");
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    email: user?.email ?? "",
  });

  const [church, setChurch] = useState({
    name: "MinistryFlow Community Church",
    address: "Accra, Ghana",
    phone: "+233 000 000 000",
    currency: "GHS",
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    weeklyDigest: true,
    donationAlerts: true,
  });

  const [security, setSecurity] = useState({ currentPassword: "", newPassword: "" });

  const handleProfileSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      await authService.updateProfile(profile);
      toast.success("Profile updated");
    } catch {
      toast.error("Unable to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleSecuritySave = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      await authService.changePassword(security);
      toast.success("Password changed");
      setSecurity({ currentPassword: "", newPassword: "" });
    } catch {
      toast.error("Unable to change password");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--primary)]">Settings</p>
          <h1 className="mt-2 text-3xl font-semibold">Workspace settings</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Manage {getDisplayName(user)}&apos;s profile, church details, and preferences.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          {/* Tabs */}
          <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={cn(
                  "flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition",
                  tab === key
                    ? "bg-[var(--primary)] text-white"
                    : "text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-white"
                )}
              >
                <Icon size={18} /> {label}
              </button>
            ))}
          </nav>

          {/* Panels */}
          <div>
            {tab === "profile" ? (
              <Card title="Profile settings" description="Update your personal account information.">
                <form onSubmit={handleProfileSave} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="First name"
                      value={profile.firstName}
                      onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                    />
                    <Input
                      label="Last name"
                      value={profile.lastName}
                      onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                    />
                  </div>
                  <Input
                    label="Email address"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                  <div className="flex justify-end">
                    <Button type="submit" disabled={saving}>
                      <Save size={16} className="mr-2" /> {saving ? "Saving…" : "Save changes"}
                    </Button>
                  </div>
                </form>
              </Card>
            ) : null}

            {tab === "church" ? (
              <Card title="Church settings" description="Configure your organization details.">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    toast.success("Church details saved");
                  }}
                  className="space-y-4"
                >
                  <Input
                    label="Church name"
                    value={church.name}
                    onChange={(e) => setChurch({ ...church, name: e.target.value })}
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="Address"
                      value={church.address}
                      onChange={(e) => setChurch({ ...church, address: e.target.value })}
                    />
                    <Input
                      label="Phone"
                      value={church.phone}
                      onChange={(e) => setChurch({ ...church, phone: e.target.value })}
                    />
                  </div>
                  <Input
                    label="Default currency"
                    value={church.currency}
                    onChange={(e) => setChurch({ ...church, currency: e.target.value })}
                  />
                  <div className="flex justify-end">
                    <Button type="submit">
                      <Save size={16} className="mr-2" /> Save changes
                    </Button>
                  </div>
                </form>
              </Card>
            ) : null}

            {tab === "notifications" ? (
              <Card title="Notification settings" description="Choose how you want to stay informed.">
                <div className="space-y-3">
                  <Toggle
                    label="Email notifications"
                    description="Receive activity updates via email."
                    checked={notifications.email}
                    onChange={(v) => setNotifications({ ...notifications, email: v })}
                  />
                  <Toggle
                    label="Push notifications"
                    description="Get real-time alerts in your browser."
                    checked={notifications.push}
                    onChange={(v) => setNotifications({ ...notifications, push: v })}
                  />
                  <Toggle
                    label="Weekly digest"
                    description="A summary of church activity every Monday."
                    checked={notifications.weeklyDigest}
                    onChange={(v) => setNotifications({ ...notifications, weeklyDigest: v })}
                  />
                  <Toggle
                    label="Donation alerts"
                    description="Be notified when new gifts are recorded."
                    checked={notifications.donationAlerts}
                    onChange={(v) => setNotifications({ ...notifications, donationAlerts: v })}
                  />
                  <div className="flex justify-end pt-1">
                    <Button onClick={() => toast.success("Preferences saved")}>
                      <Save size={16} className="mr-2" /> Save preferences
                    </Button>
                  </div>
                </div>
              </Card>
            ) : null}

            {tab === "security" ? (
              <Card title="Security" description="Update your password to keep your account secure.">
                <form onSubmit={handleSecuritySave} className="space-y-4">
                  <Input
                    label="Current password"
                    type="password"
                    value={security.currentPassword}
                    onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
                    placeholder="••••••••"
                  />
                  <Input
                    label="New password"
                    type="password"
                    value={security.newPassword}
                    onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                    placeholder="••••••••"
                  />
                  <div className="flex justify-end">
                    <Button type="submit" disabled={saving}>
                      <Lock size={16} className="mr-2" /> {saving ? "Updating…" : "Update password"}
                    </Button>
                  </div>
                </form>
              </Card>
            ) : null}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
