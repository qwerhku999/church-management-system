"use client";

import { useEffect, useState } from "react";
import {
  BarChart3,
  Download,
  FileText,
  Users,
  CalendarCheck,
  Wallet,
  RefreshCw,
} from "lucide-react";

import AppLayout from "@/components/layout/AppLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { reportService } from "@/services/report.service";

type OverviewReport = {
  members: number;
  events: number;
  donations: number;
};

type MemberReport = {
  totalMembers: number;
  activeMembers: number;
  inactiveMembers: number;
  genderDistribution: Array<{
    _id: string | null;
    count: number;
  }>;
};

type AttendanceReport = {
  totalAttendance: number;
  serviceBreakdown: Array<{
    _id: string | null;
    total: number;
  }>;
};

type FinanceReport = {
  income: number;
  expenses: number;
  balance: number;
  monthly: Array<{
    _id: {
      month: number;
      year: number;
    };
    total: number;
  }>;
};

const formatCurrency = (value: number) =>
  `GHS ${Number(value || 0).toLocaleString("en-GH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatLabel = (value: string | null) => {
  if (!value) return "Unknown";

  return String(value)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export default function ReportsPage() {
  const [overview, setOverview] = useState<OverviewReport | null>(null);
  const [members, setMembers] = useState<MemberReport | null>(null);
  const [attendance, setAttendance] =
    useState<AttendanceReport | null>(null);
  const [finance, setFinance] = useState<FinanceReport | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [downloading, setDownloading] = useState<string | null>(null);

  const loadReports = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        overviewResponse,
        membersResponse,
        attendanceResponse,
        financeResponse,
      ] = await Promise.all([
        reportService.getOverview(),
        reportService.getMembers(),
        reportService.getAttendance(),
        reportService.getFinance(),
      ]);

      setOverview(overviewResponse);
      setMembers(membersResponse);
      setAttendance(attendanceResponse);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load reports."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleDownload = async (
    type: string,
    download: () => Promise<void>
  ) => {
    try {
      setDownloading(type);
      await download();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to download report."
      );
    } finally {
      setDownloading(null);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--primary)]">
              Reports
            </p>

            <h1 className="mt-2 text-3xl font-semibold">
              Ministry reports
            </h1>

            <p className="mt-2 text-sm text-[var(--muted)]">
              View current ministry metrics and download export-ready reports.
            </p>
          </div>

          <Button
            variant="secondary"
            onClick={loadReports}
            disabled={loading}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>

        {error && (
          <Card>
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
              {error}
            </div>
          </Card>
        )}

        <div className="grid gap-6 md:grid-cols-3">
          <Card
            title="Members"
            description="Current membership count"
          >
            <div className="flex items-center justify-between">
              <div className="text-3xl font-semibold">
                {loading ? "—" : overview?.members ?? 0}
              </div>

              <Users className="h-7 w-7 text-[var(--primary)]" />
            </div>
          </Card>

          <Card
            title="Events"
            description="Total recorded events"
          >
            <div className="flex items-center justify-between">
              <div className="text-3xl font-semibold">
                {loading ? "—" : overview?.events ?? 0}
              </div>

              <CalendarCheck className="h-7 w-7 text-[var(--primary)]" />
            </div>
          </Card>

          <Card
            title="Donations"
            description="Total recorded donations"
          >
            <div className="flex items-center justify-between">
              <div className="text-2xl font-semibold">
                {loading
                  ? "—"
                  : formatCurrency(overview?.donations ?? 0)}
              </div>

              <Wallet className="h-7 w-7 text-[var(--primary)]" />
            </div>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card
            title="Membership"
            description="Current membership status"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--muted)]">
                  Total members
                </span>
                <span className="font-semibold">
                  {loading ? "—" : members?.totalMembers ?? 0}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--muted)]">
                  Active members
                </span>
                <span className="font-semibold">
                  {loading ? "—" : members?.activeMembers ?? 0}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--muted)]">
                  Inactive members
                </span>
                <span className="font-semibold">
                  {loading ? "—" : members?.inactiveMembers ?? 0}
                </span>
              </div>

              <div className="border-t border-white/10 pt-4">
                <p className="mb-3 text-sm font-medium">
                  Gender distribution
                </p>

                {members?.genderDistribution?.length ? (
                  <div className="space-y-2">
                    {members.genderDistribution.map((item, index) => (
                      <div
                        key={`${item._id ?? "unknown"}-${index}`}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-[var(--muted)]">
                          {formatLabel(item._id)}
                        </span>

                        <span className="font-medium">
                          {item.count}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[var(--muted)]">
                    No gender distribution data available.
                  </p>
                )}
              </div>
            </div>
          </Card>

          <Card
            title="Attendance"
            description="Attendance summary and service breakdown"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--muted)]">
                  Total attendance
                </span>

                <span className="text-2xl font-semibold">
                  {loading
                    ? "—"
                    : attendance?.totalAttendance ?? 0}
                </span>
              </div>

              <div className="border-t border-white/10 pt-4">
                <p className="mb-3 text-sm font-medium">
                  Service breakdown
                </p>

                {attendance?.serviceBreakdown?.length ? (
                  <div className="space-y-2">
                    {attendance.serviceBreakdown.map(
                      (item, index) => (
                        <div
                          key={`${item._id ?? "unknown"}-${index}`}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-[var(--muted)]">
                            {formatLabel(item._id)}
                          </span>

                          <span className="font-medium">
                            {item.total}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-[var(--muted)]">
                    No attendance breakdown data available.
                  </p>
                )}
              </div>
            </div>
          </Card>
        </div>

        <Card
          title="Finance"
          description="Income, expenses and balance"
        >
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-sm text-[var(--muted)]">
                Total income
              </p>

              <p className="mt-1 text-xl font-semibold">
                {loading
                  ? "—"
                  : formatCurrency(finance?.income ?? 0)}
              </p>
            </div>

            <div>
              <p className="text-sm text-[var(--muted)]">
                Total expenses
              </p>

              <p className="mt-1 text-xl font-semibold">
                {loading
                  ? "—"
                  : formatCurrency(finance?.expenses ?? 0)}
              </p>
            </div>

            <div>
              <p className="text-sm text-[var(--muted)]">
                Balance
              </p>

              <p className="mt-1 text-xl font-semibold">
                {loading
                  ? "—"
                  : formatCurrency(finance?.balance ?? 0)}
              </p>
            </div>
          </div>

          <div className="mt-6 border-t border-white/10 pt-5">
            <p className="mb-3 text-sm font-medium">
              Monthly finance
            </p>

            {finance?.monthly?.length ? (
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {finance.monthly.map((item, index) => (
                  <div
                    key={`${item._id.year}-${item._id.month}-${index}`}
                    className="flex items-center justify-between rounded-lg border border-white/10 px-3 py-2 text-sm"
                  >
                    <span className="text-[var(--muted)]">
                      {item._id.month}/{item._id.year}
                    </span>

                    <span className="font-medium">
                      {formatCurrency(item.total)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[var(--muted)]">
                No monthly finance data available.
              </p>
            )}
          </div>
        </Card>

        <Card
          title="Export reports"
          description="Download PDF versions of the available ministry reports"
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Button
              onClick={() =>
                handleDownload(
                  "overview",
                  reportService.downloadOverviewPdf
                )
              }
              disabled={downloading !== null}
            >
              {downloading === "overview" ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Overview PDF
            </Button>

            <Button
              onClick={() =>
                handleDownload(
                  "members",
                  reportService.downloadMembersPdf
                )
              }
              disabled={downloading !== null}
            >
              {downloading === "members" ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <FileText className="mr-2 h-4 w-4" />
              )}
              Members PDF
            </Button>

            <Button
              onClick={() =>
                handleDownload(
                  "attendance",
                  reportService.downloadAttendancePdf
                )
              }
              disabled={downloading !== null}
            >
              {downloading === "attendance" ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <BarChart3 className="mr-2 h-4 w-4" />
              )}
              Attendance PDF
            </Button>

            <Button
              variant="secondary"
              onClick={() =>
                handleDownload(
                  "finance",
                  reportService.downloadFinancePdf
                )
              }
              disabled={downloading !== null}
            >
              {downloading === "finance" ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wallet className="mr-2 h-4 w-4" />
              )}
              Finance PDF
            </Button>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}

