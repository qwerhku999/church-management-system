import { ArrowRight, Users } from "lucide-react";

interface RecentMembersProps {
  dashboard?: {
    recent?: {
      members?: Array<{
        firstName?: string;
        lastName?: string;
        createdAt?: string;
      }>;
    };
  };
}

export default function RecentMembers({
  dashboard,
}: RecentMembersProps) {
  const members = dashboard?.recent?.members ?? [];

  return (
    <>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
            Membership
          </p>

          <h2 className="mt-1 font-display text-lg font-bold tracking-tight text-[var(--text)]">
            Recent Members
          </h2>
        </div>

        <button className="focus-ring flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1.5 text-sm font-medium text-[var(--muted-strong)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text)]">
          View All
          <ArrowRight size={15} />
        </button>
      </div>

      {members.length === 0 ? (
        <div className="flex h-72 flex-col items-center justify-center rounded-lg border border-dashed border-[var(--border)]">
          <Users
            size={40}
            className="text-[var(--muted)]/50"
          />

          <h3 className="mt-4 text-base font-semibold text-[var(--text)]">
            No Members Yet
          </h3>

          <p className="mt-1.5 text-sm text-[var(--muted)]">
            Newly registered members will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {members.slice(0, 6).map((member, index) => {
            const name = `${member.firstName ?? "Member"} ${
              member.lastName ?? ""
            }`.trim();

            return (
              <div
                key={`${name}-${index}`}
                className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-3 transition-colors duration-150 hover:border-[var(--border-strong)]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--surface-hover)] text-sm font-semibold text-[var(--muted-strong)]">
                    {name.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-[var(--text)]">
                      {name}
                    </h3>

                    <p className="mt-0.5 text-xs text-[var(--muted)]">
                      Joined{" "}
                      {member.createdAt
                        ? new Date(
                            member.createdAt
                          ).toLocaleDateString()
                        : "Recently"}
                    </p>
                  </div>
                </div>

                <span className="rounded-md bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">
                  New
                </span>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
