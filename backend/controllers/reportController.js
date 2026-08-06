const reportService = require("../services/reportService");

const {
    successResponse
} = require("../utils/helpers");



// Members

const getMemberReport = async(req,res,next)=>{

    try{

        const report =
        await reportService.getMemberReport();


        return successResponse(
            res,
            "Member report retrieved successfully.",
            {report}
        );


    }catch(error){
        next(error);
    }

};



// Attendance

const getAttendanceReport = async(req,res,next)=>{

    try{

        const report =
        await reportService.getAttendanceReport();


        return successResponse(
            res,
            "Attendance report retrieved successfully.",
            {report}
        );


    }catch(error){
        next(error);
    }

};



// Finance

const getFinanceReport = async(req,res,next)=>{

    try{

        const report =
        await reportService.getFinanceReport();


        return successResponse(
            res,
            "Finance report retrieved successfully.",
            {report}
        );


    }catch(error){
        next(error);
    }

};



// Overview

const getOverviewReport = async(req,res,next)=>{

    try{

        const report =
        await reportService.getOverviewReport();


        return successResponse(
            res,
            "Overview report retrieved successfully.",
            {report}
        );


    }catch(error){
        next(error);
    }

};



module.exports = {

    getMemberReport,
    getAttendanceReport,
    getFinanceReport,
    getOverviewReport

};