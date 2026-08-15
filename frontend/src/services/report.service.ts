import api from "@/lib/axios";
import {
  apiGet,
  getApiErrorMessage,
} from "@/services/api";

export type OverviewReport = {
  members: number;
  events: number;
  donations: number;
};

export type MemberReport = {
  totalMembers: number;
  activeMembers: number;
  inactiveMembers: number;
  genderDistribution: Array<{
    _id: string | null;
    count: number;
  }>;
};

export type AttendanceReport = {
  totalAttendance: number;
  serviceBreakdown: Array<{
    _id: string | null;
    total: number;
  }>;
};

export type FinanceReport = {
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

type ReportResponse<T> = {
  success?: boolean;
  message?: string;
  data?: {
    report: T;
  };
};

const downloadPdf = async (
  endpoint: string,
  filename: string
) => {
  try {
    const response = await api.get(endpoint, {
      responseType: "blob",
    });

    const blob = new Blob([response.data], {
      type: "application/pdf",
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
};

export const reportService = {
  async getOverview(): Promise<OverviewReport> {
    try {
      const response = await apiGet<ReportResponse<OverviewReport>>(
        "/reports/overview"
      );

      return response.data.data?.report ?? {
        members: 0,
        events: 0,
        donations: 0,
      };
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async getMembers(): Promise<MemberReport> {
    try {
      const response = await apiGet<ReportResponse<MemberReport>>(
        "/reports/members"
      );

      return response.data.data?.report ?? {
        totalMembers: 0,
        activeMembers: 0,
        inactiveMembers: 0,
        genderDistribution: [],
      };
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async getAttendance(): Promise<AttendanceReport> {
    try {
      const response = await apiGet<ReportResponse<AttendanceReport>>(
        "/reports/attendance"
      );

      return response.data.data?.report ?? {
        totalAttendance: 0,
        serviceBreakdown: [],
      };
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async getFinance(): Promise<FinanceReport> {
    try {
      const response = await apiGet<ReportResponse<FinanceReport>>(
        "/reports/finance"
      );

      return response.data.data?.report ?? {
        income: 0,
        expenses: 0,
        balance: 0,
        monthly: [],
      };
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async downloadOverviewPdf() {
    return downloadPdf(
      "/reports/overview/pdf",
      "ministryflow-overview-report.pdf"
    );
  },

  async downloadMembersPdf() {
    return downloadPdf(
      "/reports/members/pdf",
      "ministryflow-member-report.pdf"
    );
  },

  async downloadAttendancePdf() {
    return downloadPdf(
      "/reports/attendance/pdf",
      "ministryflow-attendance-report.pdf"
    );
  },

  async downloadFinancePdf() {
    return downloadPdf(
      "/reports/finance/pdf",
      "ministryflow-finance-report.pdf"
    );
  },
};
