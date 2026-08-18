"use client";

import { useEffect, useState } from "react";
import {
  User,
  Church,
  Bell,
  Lock,
  Save,
  Shield,
  Upload,
  Trash2,
  Image as ImageIcon,
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

  const [churchSaving, setChurchSaving] =
    useState(false);

  const [churchLoading, setChurchLoading] =
    useState(false);

  const [logoUploading, setLogoUploading] =
    useState(false);

  const [logoRemoving, setLogoRemoving] =
    useState(false);

  const [logoUrl, setLogoUrl] = useState("");

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

  const [notifications, setNotifications] =
    useState<NotificationPreferences>(
      DEFAULT_NOTIFICATIONS
    );

  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
  });

  /*
   * Load the logo as a browser Blob URL.
   *
   * This avoids relying on the browser directly
   * rendering the backend /uploads URL.
   */
  useEffect(() => {
    let cancelled = false;
    let objectUrl = "";

    const loadLogo = async () => {
      if (!church.logo) {
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
  }, [church.logo]);

  /*
   * Load saved notification preferences.
   */
  useEffect(() => {
    try {
      const saved =
        window.localStorage.getItem(
          "ministryflow_notification_preferences"
        );

      if (!saved) {
        return;
      }

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
   * Keep profile state synchronized with
   * authenticated user.
   */
  useEffect(() => {
    if (!user) {
      return;
    }

    setProfile({
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      email: user.email ?? "",
    });
  }, [user]);

  /*
   * Load church settings from backend.
   */
  useEffect(() => {
    const loadChurchSettings = async () => {
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

  const notifyChurchSettingsChanged = () => {
    window.dispatchEvent(
      new Event(
        "ministryflow:church-settings-updated"
      )
    );
  };

  /*
   * Save profile.
   */
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

  /*
   * Save church settings.
   */
  const handleChurchSave = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setChurchSaving(true);

    try {
      const updated =
        await churchSettingsService.updateSettings({
          churchName: church.churchName,
          address: church.address,
          phone: church.phone,
          currency: church.currency,
          reportFooter: church.reportFooter,
        });

      setChurch(updated);

      notifyChurchSettingsChanged();

      toast.success(
        "Church details saved successfully"
      );
    } catch {
      toast.error(
        "Unable to save church settings"
      );
    } finally {
      setChurchSaving(false);
    }
  };

  /*
   * Upload church logo.
   */
  const handleLogoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Only JPG, PNG, and WebP images are allowed."
      );
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error(
        "Logo must be smaller than 2MB."
      );
      return;
    }

    setLogoUploading(true);

    try {
      const updated =
        await churchSettingsService.uploadLogo(
          file
        );

      setChurch(updated);

      notifyChurchSettingsChanged();

      toast.success(
        "Church logo uploaded successfully"
      );
    } catch {
      toast.error(
        "Unable to upload church logo"
      );
    } finally {
      setLogoUploading(false);
    }
  };

  /*
   * Remove church logo.
   */
  const handleLogoRemove = async () => {
    if (!church.logo) {
      return;
    }

    setLogoRemoving(true);

    try {
      const updated =
        await churchSettingsService.removeLogo();

      setChurch(updated);
      setLogoUrl("");

      notifyChurchSettingsChanged();

      toast.success(
        "Church logo removed successfully"
      );
    } catch {
      toast.error(
        "Unable to remove church logo"
      );
    } finally {
      setLogoRemoving(false);
    }
  };

  /*
   * Notification changes.
   */
  const handleNotificationChange = (
    key: keyof NotificationPreferences,
    value: boolean
  ) => {
    setNotifications((current) => ({
      ...current,
      [key]: value,
    }));
  };

  /*
   * Save notification preferences.
   */
  const handleNotificationSave = () => {
    setNotificationsSaving(true);

    try {
      window.localStorage.setItem(
        "ministryflow_notification_preferences",
        JSON.stringify(notifications)
      );

      toast.success(
        "Notification preferences saved"
      );
    } catch {
      toast.error(
        "Unable to save notification preferences"
      );
    } finally {
      setNotificationsSaving(false);
    }
  };

  /*
   * Change password.
   */
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
      toast.error(
        "Unable to change password"
      );
    } finally {
      setSaving(false);
    }
  };

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
            &apos;s profile, church details, and
            preferences.
          </p>
        </div>

        <div className="grid min-w-0 gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
          <nav className="flex gap-2 overflow-x-auto lg:sticky lg:top-24 lg:flex-col lg:overflow-visible">
            {TABS.filter(
              ({ key }) =>
                key !== "users" ||
                canManageUsers
            ).map(
              ({
                key,
                label,
                icon: Icon,
              }) => (
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

          <div className="min-w-0 lg:max-h-[calc(100vh-10rem)] lg:overflow-y-auto lg:pr-3">
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
                          firstName:
                            e.target.value,
                        })
                      }
                    />

                    <Input
                      label="Last name"
                      value={profile.lastName}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          lastName:
                            e.target.value,
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
                        email:
                          e.target.value,
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

            {tab === "church" ? (
              <Card
                title="Church settings"
                description="Configure your organization details."
              >
                <form
                  onSubmit={handleChurchSave}
                  className="space-y-6"
                >
                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-5">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
                          {logoUrl ? (
                            <img
                              key={logoUrl}
                              src={logoUrl}
                              alt={`${church.churchName} logo`}
                              className="h-full w-full object-contain p-2"
                            />
                          ) : (
                            <ImageIcon
                              size={32}
                              className="text-[var(--muted)]"
                            />
                          )}
                        </div>

                        <div>
                          <p className="text-sm font-semibold">
                            Church logo
                          </p>

                          <p className="mt-1 max-w-md text-xs text-[var(--muted)]">
                            Upload a JPG, PNG, or
                            WebP image. Maximum
                            size is 2MB.
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <label
                          htmlFor="church-logo-upload"
                          className={cn(
                            "inline-flex cursor-pointer items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition",
                            "bg-[var(--primary)] text-white hover:opacity-90",
                            logoUploading &&
                            "pointer-events-none opacity-60"
                          )}
                        >
                          <Upload
                            size={14}
                            className="mr-2"
                          />

                          {logoUploading
                            ? "Uploading…"
                            : church.logo
                              ? "Change logo"
                              : "Upload logo"}
                        </label>

                        <input
                          id="church-logo-upload"
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                          onChange={
                            handleLogoUpload
                          }
                          disabled={
                            logoUploading ||
                            logoRemoving
                          }
                        />

                        {church.logo ? (
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={
                              handleLogoRemove
                            }
                            disabled={
                              logoRemoving ||
                              logoUploading
                            }
                          >
                            <Trash2
                              size={16}
                              className="mr-2"
                            />

                            {logoRemoving
                              ? "Removing…"
                              : "Remove"}
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <Input
                    label="Church name"
                    value={church.churchName}
                    onChange={(e) =>
                      setChurch({
                        ...church,
                        churchName:
                          e.target.value,
                      })
                    }
                    disabled={churchLoading}
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="Address"
                      value={church.address}
                      onChange={(e) =>
                        setChurch({
                          ...church,
                          address:
                            e.target.value,
                        })
                      }
                      disabled={churchLoading}
                    />

                    <Input
                      label="Phone"
                      value={church.phone}
                      onChange={(e) =>
                        setChurch({
                          ...church,
                          phone:
                            e.target.value,
                        })
                      }
                      disabled={churchLoading}
                    />
                  </div>

                  <Input
                    label="Default currency"
                    value={church.currency}
                    onChange={(e) =>
                      setChurch({
                        ...church,
                        currency:
                          e.target.value,
                      })
                    }
                    disabled={churchLoading}
                  />

                  <Input
                    label="Report footer"
                    value={church.reportFooter}
                    onChange={(e) =>
                      setChurch({
                        ...church,
                        reportFooter:
                          e.target.value,
                      })
                    }
                    disabled={churchLoading}
                  />

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={
                        churchLoading ||
                        churchSaving ||
                        logoUploading ||
                        logoRemoving
                      }
                    >
                      <Save
                        size={16}
                        className="mr-2"
                      />

                      {churchSaving
                        ? "Saving…"
                        : churchLoading
                          ? "Loading…"
                          : "Save changes"}
                    </Button>
                  </div>
                </form>
              </Card>
            ) : null}

            {tab === "notifications" ? (
              <Card
                title="Notification settings"
                description="Choose how you want to stay informed."
              >
                <div className="space-y-3">
                  <Toggle
                    label="Email notifications"
                    description="Receive activity updates via email."
                    checked={
                      notifications.email
                    }
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
                    checked={
                      notifications.push
                    }
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
                    checked={
                      notifications.weeklyDigest
                    }
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
                      disabled={
                        notificationsSaving
                      }
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
                    value={
                      security.newPassword
                    }
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

            {tab === "users" &&
              canManageUsers ? (
              <UserManagement />
            ) : null}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}