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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">
            Membership
          </p>

          <h2 className="mt-1 text-2xl font-bold">
            Recent Members
          </h2>
        </div>

        <button className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/5 px-4 py-2 text-sm font-medium transition hover:border-indigo-500 hover:bg-indigo-500/10">
          View All
          <ArrowRight size={16} />
        </button>
      </div>

      {members.length === 0 ? (
        <div className="flex h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10">
          <Users
            size={44}
            className="text-slate-600"
          />

          <h3 className="mt-4 text-lg font-semibold">
            No Members Yet
          </h3>

          <p className="mt-2 text-sm text-slate-500">
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
                className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 p-4 transition-all duration-200 hover:border-indigo-500/30 hover:bg-white/10"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-500 font-bold text-white shadow-lg">
                    {name.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <h3 className="font-semibold text-white">
                      {name}
                    </h3>

                    <p className="mt-1 text-sm text-slate-400">
                      Joined{" "}
                      {member.createdAt
                        ? new Date(
                            member.createdAt
                          ).toLocaleDateString()
                        : "Recently"}
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
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