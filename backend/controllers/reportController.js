const reportService = require("../services/reportService");

const {
    generateMemberReportPdf,
    generateAttendanceReportPdf,
    generateFinanceReportPdf,
    generateOverviewReportPdf,
} = require("../services/reportPdfService");

const { successResponse } = require("../utils/helpers");


// ================================
// MEMBER REPORT
// ================================

const getMemberReport = async (req, res, next) => {
    try {
        const report =
            await reportService.getMemberReport();

        return successResponse(
            res,
            "Member report retrieved successfully.",
            { report }
        );
    } catch (error) {
        next(error);
    }
};


const downloadMemberReportPdf = async (
    req,
    res,
    next
) => {
    try {
        const report =
            await reportService.getMemberReport();

        await generateMemberReportPdf(
            report,
            res
        );
    } catch (error) {
        next(error);
    }
};


// ================================
// ATTENDANCE REPORT
// ================================

const getAttendanceReport = async (
    req,
    res,
    next
) => {
    try {
        const report =
            await reportService.getAttendanceReport();

        return successResponse(
            res,
            "Attendance report retrieved successfully.",
            { report }
        );
    } catch (error) {
        next(error);
    }
};


const downloadAttendanceReportPdf = async (
    req,
    res,
    next
) => {
    try {
        const report =
            await reportService.getAttendanceReport();

        await generateAttendanceReportPdf(
            report,
            res
        );
    } catch (error) {
        next(error);
    }
};


// ================================
// FINANCE REPORT
// ================================

const getFinanceReport = async (
    req,
    res,
    next
) => {
    try {
        const report =
            await reportService.getFinanceReport();

        return successResponse(
            res,
            "Finance report retrieved successfully.",
            { report }
        );
    } catch (error) {
        next(error);
    }
};


const downloadFinanceReportPdf = async (
    req,
    res,
    next
) => {
    try {
        const report =
            await reportService.getFinanceReport();

        await generateFinanceReportPdf(
            report,
            res
        );
    } catch (error) {
        next(error);
    }
};


// ================================
// OVERVIEW REPORT
// ================================

const getOverviewReport = async (
    req,
    res,
    next
) => {
    try {
        const report =
            await reportService.getOverviewReport();

        return successResponse(
            res,
            "Overview report retrieved successfully.",
            { report }
        );
    } catch (error) {
        next(error);
    }
};


const downloadOverviewReportPdf = async (
    req,
    res,
    next
) => {
    try {
        const report =
            await reportService.getOverviewReport();

        await generateOverviewReportPdf(
            report,
            res
        );
    } catch (error) {
        next(error);
    }
};


// ================================
// EXPORTS
// ================================

module.exports = {
    getMemberReport,
    downloadMemberReportPdf,

    getAttendanceReport,
    downloadAttendanceReportPdf,

    getFinanceReport,
    downloadFinanceReportPdf,

    getOverviewReport,
    downloadOverviewReportPdf,
};