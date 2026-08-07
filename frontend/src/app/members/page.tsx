"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Trash2, Pencil } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Loader from "@/components/ui/Loader";
import EmptyState from "@/components/ui/EmptyState";
import Modal from "@/components/ui/Modal";
import { memberService } from "@/services/member.service";

interface MemberRecord {
  _id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  membershipStatus?: string;
  createdAt?: string;
}

export default function MembersPage() {
  const [members, setMembers] = useState<MemberRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<MemberRecord | null>(null);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", membershipStatus: "active" });
  const [error, setError] = useState("");

  const loadMembers = async () => {
    try {
      setLoading(true);
      const response = await memberService.list();
      const items =
        (response?.data as any)?.members ??
        response?.data ??
        [];
      setMembers(Array.isArray(items) ? items : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadMembers();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const filteredMembers = members.filter((member) => {
    const haystack = `${member.firstName ?? ""} ${member.lastName ?? ""} ${member.email ?? ""}`.toLowerCase();
    return haystack.includes(query.toLowerCase());
  });

  const resetForm = () => {
    setForm({ firstName: "", lastName: "", email: "", phone: "", membershipStatus: "active" });
    setEditing(null);
  };

  const openCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEdit = (member: MemberRecord) => {
    setEditing(member);
    setForm({
      firstName: member.firstName ?? "",
      lastName: member.lastName ?? "",
      email: member.email ?? "",
      phone: member.phone ?? "",
      membershipStatus: member.membershipStatus ?? "active",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (editing?._id) {
        await memberService.update(editing._id, form);
      } else {
        await memberService.create(form);
      }
      setIsModalOpen(false);
      resetForm();
      await loadMembers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!window.confirm("Delete this member?")) return;
    try {
      await memberService.remove(id);
      await loadMembers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--primary)]">Members</p>
            <h1 className="mt-2 text-3xl font-semibold">Church member directory</h1>
            <p className="mt-2 text-sm text-[var(--muted)]">Search, manage, and keep your membership records current.</p>
          </div>
          <Button onClick={openCreate} className="w-fit">
            <Plus size={16} className="mr-2" /> Add member
          </Button>
        </div>

        <Card>
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={18} />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or email" className="pl-10" />
            </div>
            <div className="text-sm text-[var(--muted)]">{filteredMembers.length} records</div>
          </div>

          {error ? <p className="mb-4 text-sm text-red-400">{error}</p> : null}

          {loading ? (
            <Loader label="Loading members" />
          ) : filteredMembers.length === 0 ? (
            <EmptyState title="No members found" description="Create a member to get started." action={<Button onClick={openCreate}>Create member</Button>} />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="text-[var(--muted)]">
                  <tr className="border-b border-[var(--border)]">
                    <th className="px-3 py-3">Name</th>
                    <th className="px-3 py-3">Email</th>
                    <th className="px-3 py-3">Phone</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((member) => (
                    <tr key={member._id} className="border-b border-[var(--border)]/70">
                      <td className="px-3 py-3 font-medium">{member.firstName} {member.lastName}</td>
                      <td className="px-3 py-3 text-[var(--muted)]">{member.email || "—"}</td>
                      <td className="px-3 py-3 text-[var(--muted)]">{member.phone || "—"}</td>
                      <td className="px-3 py-3">
                        <span className="rounded-full bg-[var(--surface-2)] px-3 py-1 text-xs uppercase tracking-wide text-[var(--muted)]">{member.membershipStatus || "active"}</span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => openEdit(member)} className="rounded-lg p-2 text-[var(--muted)] hover:bg-[var(--surface-hover)]"><Pencil size={16} /></button>
                          <button onClick={() => handleDelete(member._id)} className="rounded-lg p-2 text-red-400 hover:bg-red-500/10"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Modal open={isModalOpen} onClose={() => { setIsModalOpen(false); resetForm(); }} title={editing ? "Edit member" : "Add member"}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="First name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
              <Input label="Last name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required />
            </div>
            <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <Input label="Membership status" value={form.membershipStatus} onChange={(e) => setForm({ ...form, membershipStatus: e.target.value })} />
            <div className="flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={() => { setIsModalOpen(false); resetForm(); }}>Cancel</Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Modal>
      </div>
    </AppLayout>
  );
}
