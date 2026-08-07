"use client";

import { useEffect, useState } from "react";
import { Bell, Check, Trash2 } from "lucide-react";

import AppLayout from "@/components/layout/AppLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";
import EmptyState from "@/components/ui/EmptyState";

import { notificationService } from "@/services/notification.service";

interface NotificationRecord {
  _id?: string;
  title?: string;
  message?: string;
  type?: string;
  read?: boolean;
  createdAt?: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNotifications = async () => {
    try {
      setLoading(true);

      const response = await notificationService.list();

      const items =
        (response?.data as any)?.notifications ??
        response?.data ??
        [];

      setNotifications(Array.isArray(items) ? items : []);

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load notifications"
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadNotifications();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);


  const markRead = async (id?: string) => {
    if (!id) return;

    try {
      await notificationService.markAsRead(id);
      await loadNotifications();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Update failed"
      );
    }
  };


  const clearAll = async () => {
    try {
      await notificationService.clearAll();
      await loadNotifications();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Clear failed"
      );
    }
  };


  return (
    <AppLayout>

      <div className="space-y-6">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--primary)]">
              Notifications
            </p>

            <h1 className="mt-2 text-3xl font-semibold">
              Notification center
            </h1>

            <p className="mt-2 text-sm text-[var(--muted)]">
              Stay updated with ministry activities.
            </p>
          </div>


          <Button onClick={clearAll}>
            <Trash2 size={16} className="mr-2" />
            Clear all
          </Button>

        </div>


        <Card>

          {error && (
            <p className="mb-4 text-sm text-red-400">
              {error}
            </p>
          )}


          {loading ? (

            <Loader label="Loading notifications" />

          ) : notifications.length === 0 ? (

            <EmptyState
              title="No notifications"
              description="You are all caught up."
            />

          ) : (

            <div className="space-y-3">

              {notifications.map((notification) => (

                <div
                  key={notification._id}
                  className="flex items-center justify-between rounded-xl border border-[var(--border)] p-4"
                >

                  <div className="flex items-start gap-3">

                    <Bell size={20} />

                    <div>

                      <p className="font-medium">
                        {notification.title || "Notification"}
                      </p>

                      <p className="text-sm text-[var(--muted)]">
                        {notification.message || "No message"}
                      </p>

                    </div>

                  </div>


                  {!notification.read && (

                    <Button
                      variant="secondary"
                      onClick={() => markRead(notification._id)}
                    >
                      <Check size={16} />
                    </Button>

                  )}

                </div>

              ))}

            </div>

          )}

        </Card>

      </div>

    </AppLayout>
  );
}