"use client";

import { useEffect, useState } from "react";
import {
  User,
  Church,
  Bell,
  Lock,
  Save,
  Shield,
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/auth.service";
import churchSettingsService, {
  ChurchSettings,
} from "@/services/churchSettings.service";
import { toast } from "@/components/ui/Toast";
import UserManagement from "@/components/settings/UserManagement";
import { getDisplayName } from "@/utils/helpers";
import { cn } from "@/lib/utils";

type TabKey =
  | "profile"
  | "church"
  | "notifications"
  | "security"
  | "users";

const TABS: {
  key: TabKey;
  label: string;
  icon: typeof User;
}[] = [
    {
      key: "profile",
      label: "Profile",
      icon: User,
    },
    {
      key: "church",
      label: "Church",
      icon: Church,
    },
    {
      key: "notifications",
      label: "Notifications",
      icon: Bell,
    },
    {
      key: "security",
      label: "Security",
      icon: Lock,
    },
    {
      key: "users",
      label: "User Management",
      icon: Shield,
    },
  ];

interface ToggleProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

interface NotificationPreferences {
  email: boolean;
  push: boolean;
  weeklyDigest: boolean;
  donationAlerts: boolean;
}

const DEFAULT_NOTIFICATIONS: NotificationPreferences = {
  email: true,
  push: false,
  weeklyDigest: true,
  donationAlerts: true,
};

function Toggle({
  label,
  description,
  checked,
  onChange,
}: ToggleProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="mt-0.5 text-xs text-[var(--muted)]">
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          checked
            ? "bg-[var(--primary)]"
            : "bg-[var(--surface-hover)]"
        )}
      >
        <span
          className={cn(
            "absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform duration-200 ease-in-out",
            checked
              ? "translate-x-5"
              : "translate-x-0"
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
  const [notificationsSaving, setNotificationsSaving] =
    useState(false);

  const [profile, setProfile] = useState({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    email: user?.email ?? "",
  });

  const [church, setChurch] =
    useState<ChurchSettings>({
      churchName: "MinistryFlow Community Church",
      logo: "",
      address: "Accra, Ghana",
      phone: "+233 000 000 000",
      currency: "GHS",
      reportFooter:
        "Official MinistryFlow Report",
    });

  const [churchLoading, setChurchLoading] =
    useState(false);

  const [logoUploading, setLogoUploading] =
    useState(false);

  const [notifications, setNotifications] =
    useState<NotificationPreferences>(
      DEFAULT_NOTIFICATIONS
    );

  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
  });

  /*
   * Load saved notification preferences.
   * These are currently stored locally until the
   * backend notification-preferences API is connected.
   */
  useEffect(() => {
    try {
      const saved =
        window.localStorage.getItem(
          "ministryflow_notification_preferences"
        );

      if (!saved) return;

      const parsed = JSON.parse(saved);

      setNotifications({
        ...DEFAULT_NOTIFICATIONS,
        ...parsed,
      });
    } catch {
      setNotifications(DEFAULT_NOTIFICATIONS);
    }
  }, []);

  /*
   * Keep profile state synchronized when the
   * authenticated user becomes available.
   */
  useEffect(() => {
    if (!user) return;

    setProfile({
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      email: user.email ?? "",
    });
  }, [user]);

  const handleProfileSave = async (
    event: React.FormEvent
  ) => {
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

  const handleNotificationChange = (
    key: keyof NotificationPreferences,
    value: boolean
  ) => {
    setNotifications((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleNotificationSave = () => {
    setNotificationsSaving(true);

    try {
      window.localStorage.setItem(
        "ministryflow_notification_preferences",
        JSON.stringify(notifications)
      );

      toast.success("Notification preferences saved");
    } catch {
      toast.error(
        "Unable to save notification preferences"
      );
    } finally {
      setNotificationsSaving(false);
    }
  };

  const handleSecuritySave = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setSaving(true);

    try {
      await authService.changePassword(security);

      toast.success("Password changed");

      setSecurity({
        currentPassword: "",
        newPassword: "",
      });
    } catch {
      toast.error("Unable to change password");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const loadChurchSettings =
      async () => {
        try {
          setChurchLoading(true);

          const settings =
            await churchSettingsService.getSettings();

          setChurch(settings);
        } catch {
          toast.error(
            "Unable to load church settings"
          );
        } finally {
          setChurchLoading(false);
        }
      };

    loadChurchSettings();
  }, []);

  const canManageUsers =
    user?.role === "super_admin" ||
    user?.role === "admin";

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--primary)]">
            Settings
          </p>

          <h1 className="mt-2 text-3xl font-semibold">
            Workspace settings
          </h1>

          <p className="mt-2 text-sm text-[var(--muted)]">
            Manage {getDisplayName(user)}
            &apos;s profile, church details, and preferences.
          </p>
        </div>

        <div className="grid min-w-0 gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
          {/* Tabs */}
          <nav className="flex gap-2 overflow-x-auto lg:sticky lg:top-24 lg:flex-col lg:overflow-visible">
            {TABS.filter(
              ({ key }) =>
                key !== "users" || canManageUsers
            ).map(
              ({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTab(key)}
                  className={cn(
                    "flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition",
                    tab === key
                      ? "bg-[var(--primary)] text-white"
                      : "text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-white"
                  )}
                >
                  <Icon size={18} />
                  {label}
                </button>
              )
            )}
          </nav>

          {/* Panels */}
          <div className="min-w-0 lg:max-h-[calc(100vh-10rem)] lg:overflow-y-auto lg:pr-3">
            {/* Profile */}
            {tab === "profile" ? (
              <Card
                title="Profile settings"
                description="Update your personal account information."
              >
                <form
                  onSubmit={handleProfileSave}
                  className="space-y-4"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="First name"
                      value={profile.firstName}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          firstName: e.target.value,
                        })
                      }
                    />

                    <Input
                      label="Last name"
                      value={profile.lastName}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          lastName: e.target.value,
                        })
                      }
                    />
                  </div>

                  <Input
                    label="Email address"
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        email: e.target.value,
                      })
                    }
                    disabled
                  />

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={saving}
                    >
                      <Save
                        size={16}
                        className="mr-2"
                      />

                      {saving
                        ? "Saving…"
                        : "Save changes"}
                    </Button>
                  </div>
                </form>
              </Card>
            ) : null}

            {/* Church */}
            {/* Church */}
            {tab === "church" ? (
              <Card
                title="Church settings"
                description="Configure your organization details."
              >
                <form
                  onSubmit={(e) => {
                    e.preventDefault();

                    toast.success(
                      "Church details saved"
                    );
                  }}
                  className="space-y-4"
                >
                  <Input
                    label="Church name"
                    value={church.churchName}
                    onChange={(e) =>
                      setChurch({
                        ...church,
                        churchName: e.target.value,
                      })
                    }
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="Address"
                      value={church.address}
                      onChange={(e) =>
                        setChurch({
                          ...church,
                          address: e.target.value,
                        })
                      }
                    />

                    <Input
                      label="Phone"
                      value={church.phone}
                      onChange={(e) =>
                        setChurch({
                          ...church,
                          phone: e.target.value,
                        })
                      }
                    />
                  </div>

                  <Input
                    label="Default currency"
                    value={church.currency}
                    onChange={(e) =>
                      setChurch({
                        ...church,
                        currency: e.target.value,
                      })
                    }
                  />

                  <Input
                    label="Report footer"
                    value={church.reportFooter}
                    onChange={(e) =>
                      setChurch({
                        ...church,
                        reportFooter: e.target.value,
                      })
                    }
                  />

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={churchLoading}
                    >
                      <Save
                        size={16}
                        className="mr-2"
                      />

                      {churchLoading
                        ? "Loading…"
                        : "Save changes"}
                    </Button>
                  </div>
                </form>
              </Card>
            ) : null}

            {/* Notifications */}
            {tab === "notifications" ? (
              <Card
                title="Notification settings"
                description="Choose how you want to stay informed."
              >
                <div className="space-y-3">
                  <Toggle
                    label="Email notifications"
                    description="Receive activity updates via email."
                    checked={notifications.email}
                    onChange={(value) =>
                      handleNotificationChange(
                        "email",
                        value
                      )
                    }
                  />

                  <Toggle
                    label="Push notifications"
                    description="Get real-time alerts in your browser."
                    checked={notifications.push}
                    onChange={(value) =>
                      handleNotificationChange(
                        "push",
                        value
                      )
                    }
                  />

                  <Toggle
                    label="Weekly digest"
                    description="A summary of church activity every Monday."
                    checked={notifications.weeklyDigest}
                    onChange={(value) =>
                      handleNotificationChange(
                        "weeklyDigest",
                        value
                      )
                    }
                  />

                  <Toggle
                    label="Donation alerts"
                    description="Be notified when new gifts are recorded."
                    checked={
                      notifications.donationAlerts
                    }
                    onChange={(value) =>
                      handleNotificationChange(
                        "donationAlerts",
                        value
                      )
                    }
                  />

                  <div className="flex justify-end pt-2">
                    <Button
                      type="button"
                      onClick={
                        handleNotificationSave
                      }
                      disabled={notificationsSaving}
                    >
                      <Save
                        size={16}
                        className="mr-2"
                      />

                      {notificationsSaving
                        ? "Saving…"
                        : "Save preferences"}
                    </Button>
                  </div>
                </div>
              </Card>
            ) : null}

            {/* Security */}
            {tab === "security" ? (
              <Card
                title="Security"
                description="Update your password to keep your account secure."
              >
                <form
                  onSubmit={handleSecuritySave}
                  className="space-y-4"
                >
                  <Input
                    label="Current password"
                    type="password"
                    value={
                      security.currentPassword
                    }
                    onChange={(e) =>
                      setSecurity({
                        ...security,
                        currentPassword:
                          e.target.value,
                      })
                    }
                    placeholder="••••••••"
                  />

                  <Input
                    label="New password"
                    type="password"
                    value={security.newPassword}
                    onChange={(e) =>
                      setSecurity({
                        ...security,
                        newPassword:
                          e.target.value,
                      })
                    }
                    placeholder="••••••••"
                  />

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={saving}
                    >
                      <Lock
                        size={16}
                        className="mr-2"
                      />

                      {saving
                        ? "Updating…"
                        : "Update password"}
                    </Button>
                  </div>
                </form>
              </Card>
            ) : null}

            {/* User Management */}
            {tab === "users" && canManageUsers ? (
              <UserManagement />
            ) : null}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

