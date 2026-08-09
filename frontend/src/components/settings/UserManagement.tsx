"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Shield,
  UserCheck,
  UserX,
  RefreshCw,
  ChevronDown,
  Users,
} from "lucide-react";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import { useAuth } from "@/hooks/useAuth";
import {
  ROLE_LABELS,
  type Role,
} from "@/constants/roles";
import {
  usersService,
  type ManagedUser,
} from "@/services/users.service";
import { cn } from "@/lib/utils";

const ROLE_OPTIONS: Role[] = [
  "super_admin",
  "admin",
  "pastor",
  "secretary",
  "treasurer",
  "finance_officer",
  "ministry_leader",
  "volunteer",
  "member",
];

function initials(user: ManagedUser) {
  return `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();
}

function roleBadge(role: Role) {
  if (role === "super_admin") {
    return "bg-purple-500/10 text-purple-300 border-purple-500/20";
  }

  if (role === "admin") {
    return "bg-blue-500/10 text-blue-300 border-blue-500/20";
  }

  if (role === "pastor") {
    return "bg-amber-500/10 text-amber-300 border-amber-500/20";
  }

  return "bg-[var(--surface-hover)] text-[var(--muted-strong)] border-[var(--border)]";
}

export default function UserManagement() {
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const loadUsers = async () => {
    setLoading(true);

    try {
      const response = await usersService.getUsers({
        limit: 100,
      });

      const data =
        response?.data ??
        response?.users ??
        [];

      setUsers(data);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((item) => {
      const matchesSearch =
        !query ||
        `${item.firstName} ${item.lastName}`
          .toLowerCase()
          .includes(query) ||
        item.email.toLowerCase().includes(query);

      const matchesRole =
        roleFilter === "all" ||
        item.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const handleRoleChange = async (
    targetUser: ManagedUser,
    role: Role
  ) => {
    if (targetUser._id === currentUser?._id) {
      toast.error("You cannot change your own role.");
      return;
    }

    if (targetUser.role === role) return;

    const confirmed = window.confirm(
      `Change ${targetUser.firstName} ${targetUser.lastName}'s role from ${ROLE_LABELS[targetUser.role]} to ${ROLE_LABELS[role]}?`
    );

    if (!confirmed) return;

    setSavingId(targetUser._id);

    try {
      const response = await usersService.updateRole(
        targetUser._id,
        role
      );

      const updated =
        response?.data?.user;

      setUsers((current) =>
        current.map((item) =>
          item._id === targetUser._id
            ? updated ?? { ...item, role }
            : item
        )
      );

      toast.success("User role updated");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to update role"
      );
    } finally {
      setSavingId(null);
    }
  };

  const handleStatusChange = async (
    targetUser: ManagedUser
  ) => {
    if (targetUser._id === currentUser?._id) {
      toast.error("You cannot deactivate your own account.");
      return;
    }

    const action = targetUser.isActive
      ? "deactivate"
      : "activate";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${targetUser.firstName} ${targetUser.lastName}'s account?`
    );

    if (!confirmed) return;

    setSavingId(targetUser._id);

    try {
      const response =
        await usersService.toggleStatus(
          targetUser._id
        );

      const updated =
        response?.data?.user;

      setUsers((current) =>
        current.map((item) =>
          item._id === targetUser._id
            ? updated ?? {
                ...item,
                isActive: !item.isActive,
              }
            : item
        )
      );

      toast.success(
        `User ${action}d successfully`
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : `Unable to ${action} user`
      );
    } finally {
      setSavingId(null);
    }
  };

  if (currentUser?.role !== "super_admin") {
    return null;
  }

  return (
    <Card
      title="User Management"
      description="Manage accounts, roles, and access across MinistryFlow."
    >
      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
            <Users size={16} />
            <span>
              {users.length} user
              {users.length === 1 ? "" : "s"}
            </span>
          </div>

          <Button
            variant="secondary"
            onClick={() => void loadUsers()}
            disabled={loading}
          >
            <RefreshCw
              size={16}
              className={cn(
                "mr-2",
                loading && "animate-spin"
              )}
            />
            Refresh
          </Button>
        </div>

        {/* Filters */}
        <div className="grid gap-3 sm:grid-cols-[1fr_220px]">
          <div className="relative">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
            />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search users..."
              className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] pl-10 pr-4 text-sm outline-none transition focus:border-[var(--primary)]"
            />
          </div>

          <div className="relative">
            <select
              value={roleFilter}
              onChange={(event) =>
                setRoleFilter(event.target.value)
              }
              className="h-11 w-full appearance-none rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 pr-10 text-sm outline-none focus:border-[var(--primary)]"
            >
              <option value="all">
                All roles
              </option>

              {ROLE_OPTIONS.map((role) => (
                <option
                  key={role}
                  value={role}
                >
                  {ROLE_LABELS[role]}
                </option>
              ))}
            </select>

            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
            />
          </div>
        </div>

        {/* Users */}
        <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
          {loading ? (
            <div className="flex min-h-[220px] items-center justify-center">
              <RefreshCw
                size={22}
                className="animate-spin text-[var(--primary)]"
              />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex min-h-[220px] flex-col items-center justify-center px-6 text-center">
              <Users
                size={30}
                className="mb-3 text-[var(--muted)]"
              />
              <p className="font-medium">
                No users found
              </p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Try changing your search or role filter.
              </p>
            </div>
          ) : (
            <table className="w-full min-w-[900px] text-left">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--surface-2)]">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                    User
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                    Role
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                    Status
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                    Last Login
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((item) => {
                  const isCurrentUser =
                    item._id === currentUser?._id;

                  const isSaving =
                    savingId === item._id;

                  return (
                    <tr
                      key={item._id}
                      className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-hover)]/40"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-sm font-semibold text-[var(--primary)]">
                            {initials(item)}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="truncate text-sm font-semibold">
                                {item.firstName}{" "}
                                {item.lastName}
                              </p>

                              {isCurrentUser ? (
                                <span className="rounded-full bg-[var(--primary-soft)] px-2 py-0.5 text-[10px] font-semibold text-[var(--primary)]">
                                  You
                                </span>
                              ) : null}
                            </div>

                            <p className="truncate text-xs text-[var(--muted)]">
                              {item.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          {item.role === "super_admin" ? (
                            <Shield
                              size={15}
                              className="text-purple-400"
                            />
                          ) : null}

                          <select
                            value={item.role}
                            disabled={
                              isCurrentUser ||
                              isSaving
                            }
                            onChange={(event) =>
                              void handleRoleChange(
                                item,
                                event.target
                                  .value as Role
                              )
                            }
                            className={cn(
                              "rounded-lg border px-3 py-2 text-xs font-semibold outline-none",
                              roleBadge(item.role),
                              (isCurrentUser ||
                                isSaving) &&
                                "cursor-not-allowed opacity-60"
                            )}
                          >
                            {ROLE_OPTIONS.map(
                              (role) => (
                                <option
                                  key={role}
                                  value={role}
                                >
                                  {ROLE_LABELS[role]}
                                </option>
                              )
                            )}
                          </select>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={cn(
                            "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-semibold",
                            item.isActive
                              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                              : "border-red-500/20 bg-red-500/10 text-red-300"
                          )}
                        >
                          <span
                            className={cn(
                              "h-1.5 w-1.5 rounded-full",
                              item.isActive
                                ? "bg-emerald-400"
                                : "bg-red-400"
                            )}
                          />
                          {item.isActive
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-sm text-[var(--muted)]">
                        {item.lastLogin
                          ? new Date(
                              item.lastLogin
                            ).toLocaleDateString(
                              "en-GB"
                            )
                          : "Never"}
                      </td>

                      <td className="px-4 py-4 text-right">
                        <button
                          type="button"
                          disabled={
                            isCurrentUser ||
                            isSaving
                          }
                          onClick={() =>
                            void handleStatusChange(
                              item
                            )
                          }
                          className={cn(
                            "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition",
                            item.isActive
                              ? "text-red-300 hover:bg-red-500/10"
                              : "text-emerald-300 hover:bg-emerald-500/10",
                            (isCurrentUser ||
                              isSaving) &&
                              "cursor-not-allowed opacity-40"
                          )}
                        >
                          {item.isActive ? (
                            <>
                              <UserX size={15} />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <UserCheck size={15} />
                              Activate
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="rounded-xl border border-[var(--primary)]/10 bg-[var(--primary-soft)] p-4">
          <div className="flex gap-3">
            <Shield
              size={18}
              className="mt-0.5 shrink-0 text-[var(--primary)]"
            />

            <div>
              <p className="text-sm font-semibold">
                Super Admin controls
              </p>
              <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
                Role changes are protected by the backend.
                Only Super Admin accounts can promote or
                demote users. The final active Super Admin
                cannot be removed or deactivated.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}