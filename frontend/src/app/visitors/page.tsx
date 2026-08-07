"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, UserPlus, Phone } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Loader from "@/components/ui/Loader";
import EmptyState from "@/components/ui/EmptyState";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import { visitorService } from "@/services/visitor.service";
import { formatDate } from "@/utils/helpers";
import { toast } from "@/components/ui/Toast";

interface VisitorRecord {
  _id?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  phone?: string;
  contact?: string;
  invitedBy?: string;
  visitDate?: string;
  followUpStatus?: string;
}

const STATUS_TONES: Record<string, "warning" | "info" | "success" | "muted"> = {
  pending: "warning",
  contacted: "info",
  joined: "success",
  inactive: "muted",
};

export default function VisitorsPage() {
  const [visitors, setVisitors] = useState<VisitorRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<VisitorRecord | null>(null);
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", invitedBy: "", followUpStatus: "pending" });
  const [error, setError] = useState("");

  const loadVisitors = async () => {
    try {
      setLoading(true);
      const response = await visitorService.list();
      const items =
        (response?.data as Record<string, unknown>)?.visitors ??
        response?.data ??
        [];
      setVisitors(Array.isArray(items) ? (items as VisitorRecord[]) : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load visitors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadVisitors();
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const fullName = (v: VisitorRecord) => v.name ?? (`${v.firstName ?? ""} ${v.lastName ?? ""}`.trim() || "Visitor");
  const contactInfo = (v: VisitorRecord) => v.contact ?? v.phone ?? "No contact info";

  const resetForm = () => {
    setForm({ firstName: "", lastName: "", phone: "", invitedBy: "", followUpStatus: "pending" });
    setEditing(null);
  };

  const openCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEdit = (visitor: VisitorRecord) => {
    setEditing(visitor);
    setForm({
      firstName: visitor.firstName ?? "",
      lastName: visitor.lastName ?? "",
      phone: visitor.phone ?? visitor.contact ?? "",
      invitedBy: visitor.invitedBy ?? "",
      followUpStatus: visitor.followUpStatus ?? "pending",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (editing?._id) {
        await visitorService.update(editing._id, form);
        toast.success("Visitor updated");
      } else {
        await visitorService.create(form);
        toast.success("Visitor added");
      }
      setIsModalOpen(false);
      resetForm();
      await loadVisitors();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Save failed";
      setError(message);
      toast.error(message);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!window.confirm("Delete this visitor?")) return;
    try {
      await visitorService.remove(id);
      toast.success("Visitor deleted");
      await loadVisitors();
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
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--primary)]">Visitors</p>
            <h1 className="mt-2 text-3xl font-semibold">Visitor follow-up tracking</h1>
            <p className="mt-2 text-sm text-[var(--muted)]">Log guests and keep follow-up progress visible.</p>
          </div>
          <Button onClick={openCreate} className="w-fit">
            <Plus size={16} className="mr-2" /> Add visitor
          </Button>
        </div>

        {error ? <p className="text-sm text-red-400">{error}</p> : null}

        <Card>
          {loading ? (
            <Loader label="Loading visitors" />
          ) : visitors.length === 0 ? (
            <EmptyState
              title="No visitors recorded"
              description="Add a visitor to begin tracking follow-up."
              action={<Button onClick={openCreate}>Add visitor</Button>}
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {visitors.map((visitor) => (
                <div
                  key={visitor._id}
                  className="group rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-5 transition-colors hover:border-[var(--border-strong)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--primary-soft)] text-[var(--primary)]">
                        <UserPlus size={18} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[var(--text)]">{fullName(visitor)}</h3>
                        {visitor.invitedBy ? (
                          <p className="text-xs text-[var(--muted)]">Invited by {visitor.invitedBy}</p>
                        ) : null}
                      </div>
                    </div>
                    <Badge tone={STATUS_TONES[visitor.followUpStatus ?? "pending"] ?? "warning"}>
                      {visitor.followUpStatus ?? "pending"}
                    </Badge>
                  </div>

                  <div className="mt-3 space-y-1.5 text-sm text-[var(--muted)]">
                    {visitor.phone || visitor.contact ? (
                      <p className="flex items-center gap-2">
                        <Phone size={14} /> {contactInfo(visitor)}
                      </p>
                    ) : null}
                    {visitor.visitDate ? (
                      <p className="text-[var(--muted)]">Visited {formatDate(visitor.visitDate)}</p>
                    ) : null}
                  </div>

                  <div className="mt-4 flex justify-end gap-1 opacity-0 transition group-hover:opacity-100">
                    <button onClick={() => openEdit(visitor)} className="rounded-lg p-2 text-[var(--muted)] hover:bg-[var(--surface-hover)]" aria-label="Edit visitor">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => handleDelete(visitor._id)} className="rounded-lg p-2 text-red-400 hover:bg-red-500/10" aria-label="Delete visitor">
                      <Trash2 size={15} />
                    </button>
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
          title={editing ? "Edit visitor" : "Add visitor"}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="First name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
              <Input label="Last name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
            </div>
            <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+233 ..." />
            <Input label="Invited by" value={form.invitedBy} onChange={(e) => setForm({ ...form, invitedBy: e.target.value })} placeholder="Who invited them" />
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--text)]">Follow-up status</label>
              <select
                value={form.followUpStatus}
                onChange={(e) => setForm({ ...form, followUpStatus: e.target.value })}
                className="focus-ring w-full rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2.5 text-sm text-[var(--text)] outline-none transition focus:border-[var(--primary)]"
              >
                <option value="pending">Pending</option>
                <option value="contacted">Contacted</option>
                <option value="joined">Joined</option>
              </select>
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={() => { setIsModalOpen(false); resetForm(); }}>
                Cancel
              </Button>
              <Button type="submit">{editing ? "Save changes" : "Add visitor"}</Button>
            </div>
          </form>
        </Modal>
      </div>
    </AppLayout>
  );
}
