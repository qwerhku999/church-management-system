"use client";

import { useEffect, useState } from "react";
import { Plus, Megaphone, Trash2, Pencil, Pin } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Loader from "@/components/ui/Loader";
import EmptyState from "@/components/ui/EmptyState";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import { announcementService } from "@/services/announcement.service";
import { formatDate, timeAgo } from "@/utils/helpers";
import { toast } from "@/components/ui/Toast";

interface AnnouncementRecord {
  _id?: string;
  title?: string;
  content?: string;
  summary?: string;
  category?: string;
  priority?: string;
  status?: string;
  isPinned?: boolean;
  publishDate?: string;
  createdAt?: string;
}

const PRIORITY_TONES: Record<string, "default" | "warning" | "danger" | "muted"> = {
  low: "muted",
  normal: "default",
  high: "warning",
  urgent: "danger",
};

const STATUS_TONES: Record<string, "success" | "muted" | "info"> = {
  published: "success",
  draft: "muted",
  archived: "muted",
  scheduled: "info",
};

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<AnnouncementRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<AnnouncementRecord | null>(null);
  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "general",
    priority: "normal",
    status: "published",
  });
  const [error, setError] = useState("");

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await announcementService.list();
      const items =
        (response?.data as Record<string, unknown>)?.announcements ??
        response?.data ??
        [];
      setAnnouncements(Array.isArray(items) ? (items as AnnouncementRecord[]) : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load announcements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadAnnouncements();
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const resetForm = () => {
    setForm({ title: "", content: "", category: "general", priority: "normal", status: "published" });
    setEditing(null);
  };

  const openCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEdit = (announcement: AnnouncementRecord) => {
    setEditing(announcement);
    setForm({
      title: announcement.title ?? "",
      content: announcement.content ?? "",
      category: announcement.category ?? "general",
      priority: announcement.priority ?? "normal",
      status: announcement.status ?? "published",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (editing?._id) {
        await announcementService.update(editing._id, form);
        toast.success("Announcement updated");
      } else {
        await announcementService.create(form);
        toast.success("Announcement created");
      }
      setIsModalOpen(false);
      resetForm();
      await loadAnnouncements();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Save failed";
      setError(message);
      toast.error(message);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!window.confirm("Delete this announcement?")) return;
    try {
      await announcementService.remove(id);
      toast.success("Announcement deleted");
      await loadAnnouncements();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Delete failed";
      setError(message);
      toast.error(message);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--primary)]">Announcements</p>
            <h1 className="mt-2 text-3xl font-semibold">Church announcements</h1>
            <p className="mt-2 text-sm text-[var(--muted)]">Share updates, news, and important notices with your community.</p>
          </div>
          <Button onClick={openCreate} className="w-fit">
            <Plus size={16} className="mr-2" /> New announcement
          </Button>
        </div>

        {error ? <p className="text-sm text-red-400">{error}</p> : null}

        <Card>
          {loading ? (
            <Loader label="Loading announcements" />
          ) : announcements.length === 0 ? (
            <EmptyState
              title="No announcements yet"
              description="Create an announcement to share news with your church."
              action={<Button onClick={openCreate}>Create announcement</Button>}
            />
          ) : (
            <div className="space-y-3">
              {announcements.map((announcement) => (
                <div
                  key={announcement._id}
                  className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-5 transition-colors hover:border-[var(--border-strong)]"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {announcement.isPinned ? (
                          <Pin size={14} className="text-[var(--primary)]" />
                        ) : null}
                        <h3 className="font-semibold text-[var(--text)]">{announcement.title || "Untitled announcement"}</h3>
                        <Badge tone={PRIORITY_TONES[announcement.priority ?? "normal"] ?? "default"}>
                          {announcement.priority ?? "normal"}
                        </Badge>
                        <Badge tone={STATUS_TONES[announcement.status ?? "published"] ?? "muted"}>
                          {announcement.status ?? "published"}
                        </Badge>
                      </div>
                      <p className="mt-2 text-sm text-[var(--muted)] line-clamp-2">
                        {announcement.content || announcement.summary || "No content provided."}
                      </p>
                      <p className="mt-3 text-xs text-[var(--muted)]">
                        {announcement.publishDate
                          ? `Published ${formatDate(announcement.publishDate)}`
                          : announcement.createdAt
                            ? `${timeAgo(announcement.createdAt)}`
                            : ""}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button
                        onClick={() => openEdit(announcement)}
                        className="rounded-lg p-2 text-[var(--muted)] transition hover:bg-[var(--surface-hover)] hover:text-white"
                        aria-label="Edit announcement"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(announcement._id)}
                        className="rounded-lg p-2 text-red-400 transition hover:bg-red-500/10"
                        aria-label="Delete announcement"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Modal
          open={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            resetForm();
          }}
          title={editing ? "Edit announcement" : "New announcement"}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--text)]">Content</label>
              <textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="focus-ring min-h-32 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-3 text-sm text-[var(--text)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--primary)]"
                placeholder="Write your announcement..."
                required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
              <Input
                label="Priority"
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
              />
            </div>
            <Input
              label="Status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            />
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button type="submit">{editing ? "Save changes" : "Publish"}</Button>
            </div>
          </form>
        </Modal>
      </div>
    </AppLayout>
  );
}
