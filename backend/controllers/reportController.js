const reportService = require("../services/reportService");

const {
    generateMemberReportPdf,
    generateAttendanceReportPdf,
    generateFinanceReportPdf,
    generateOverviewReportPdf,
} = require("../services/reportPdfService");

const { successResponse } = require("../utils/helpers");

// Members

const getMemberReport = async (req, res, next) => {
    try {
        const report = await reportService.getMemberReport();

        return successResponse(
            res,
            "Member report retrieved successfully.",
            { report }
        );
    } catch (error) {
        next(error);
    }
};

const downloadMemberReportPdf = async (req, res, next) => {
    try {
        const report = await reportService.getMemberReport();

        generateMemberReportPdf(report, res);
    } catch (error) {
        next(error);
    }
};

// Attendance

const getAttendanceReport = async (req, res, next) => {
    try {
        const report = await reportService.getAttendanceReport();

        return successResponse(
            res,
            "Attendance report retrieved successfully.",
            { report }
        );
    } catch (error) {
        next(error);
    }
};

const downloadAttendanceReportPdf = async (req, res, next) => {
    try {
        const report = await reportService.getAttendanceReport();

        generateAttendanceReportPdf(report, res);
    } catch (error) {
        next(error);
    }
};

// Finance

const getFinanceReport = async (req, res, next) => {
    try {
        const report = await reportService.getFinanceReport();

        return successResponse(
            res,
            "Finance report retrieved successfully.",
            { report }
        );
    } catch (error) {
        next(error);
    }
};

const downloadFinanceReportPdf = async (req, res, next) => {
    try {
        const report = await reportService.getFinanceReport();

        generateFinanceReportPdf(report, res);
    } catch (error) {
        next(error);
    }
};

// Overview

const getOverviewReport = async (req, res, next) => {
    try {
        const report = await reportService.getOverviewReport();

        return successResponse(
            res,
            "Overview report retrieved successfully.",
            { report }
        );
    } catch (error) {
        next(error);
    }
};

const downloadOverviewReportPdf = async (req, res, next) => {
    try {
        const report = await reportService.getOverviewReport();

        generateOverviewReportPdf(report, res);
    } catch (error) {
        next(error);
    }
};

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