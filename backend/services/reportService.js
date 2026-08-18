const Member = require("../models/Member");
const Attendance = require("../models/Attendance");
const Finance = require("../models/Finance");
const Donation = require("../models/Donation");
const Event = require("../models/Event");


// ================================
// MEMBER REPORT
// ================================

const getMemberReport = async () => {
    const totalMembers =
        await Member.countDocuments();

    const activeMembers =
        await Member.countDocuments({
            membershipStatus: "active"
        });

    const inactiveMembers =
        await Member.countDocuments({
            membershipStatus: "inactive"
        });

    const genderDistribution =
        await Member.aggregate([
            {
                $group: {
                    _id: "$gender",
                    count: {
                        $sum: 1
                    }
                }
            }
        ]);

    return {
        totalMembers,
        activeMembers,
        inactiveMembers,
        genderDistribution
    };
};


// ================================
// ATTENDANCE REPORT
// ================================

const getAttendanceReport = async () => {
    const totalAttendance =
        await Attendance.aggregate([
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$totalCount"
                    }
                }
            }
        ]);

    const serviceBreakdown =
        await Attendance.aggregate([
            {
                $group: {
                    _id: "$serviceType",
                    total: {
                        $sum: "$totalCount"
                    }
                }
            }
        ]);

    return {
        totalAttendance:
            totalAttendance[0]?.total || 0,

        serviceBreakdown
    };
};


// ================================
// FINANCE REPORT
// ================================

const getFinanceReport = async () => {
    const finance =
        await Finance.aggregate([
            {
                $group: {
                    _id: "$type",
                    total: {
                        $sum: "$amount"
                    }
                }
            }
        ]);

    let income = 0;
    let expenses = 0;

    finance.forEach(item => {
        if (item._id === "income") {
            income = item.total;
        }

        if (item._id === "expense") {
            expenses = item.total;
        }
    });

    const monthly =
        await Finance.aggregate([
            {
                $group: {
                    _id: {
                        month: {
                            $month: "$date"
                        },

                        year: {
                            $year: "$date"
                        }
                    },

                    total: {
                        $sum: "$amount"
                    }
                }
            },

            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1
                }
            }
        ]);

    return {
        income,
        expenses,

        balance:
            income - expenses,

        monthly
    };
};


// ================================
// OVERVIEW REPORT
// ================================

const getOverviewReport = async () => {
    const [
        totalMembers,
        activeMembers,
        inactiveMembers,
        events,
        donations,
        attendance,
        finance,
        genderDistribution
    ] = await Promise.all([

        // Members
        Member.countDocuments(),

        Member.countDocuments({
            membershipStatus: "active"
        }),

        Member.countDocuments({
            membershipStatus: "inactive"
        }),

        // Events
        Event.countDocuments(),

        // Donations
        Donation.aggregate([
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$amount"
                    }
                }
            }
        ]),

        // Attendance
        Attendance.aggregate([
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$totalCount"
                    }
                }
            }
        ]),

        // Finance
        Finance.aggregate([
            {
                $group: {
                    _id: "$type",
                    total: {
                        $sum: "$amount"
                    }
                }
            }
        ]),

        // Gender
        Member.aggregate([
            {
                $group: {
                    _id: "$gender",
                    count: {
                        $sum: 1
                    }
                }
            }
        ])
    ]);


    let income = 0;
    let expenses = 0;


    finance.forEach(item => {
        if (item._id === "income") {
            income = item.total;
        }

        if (item._id === "expense") {
            expenses = item.total;
        }
    });


    return {
        members: totalMembers,

        activeMembers,

        inactiveMembers,

        events,

        donations:
            donations[0]?.total || 0,

        attendance:
            attendance[0]?.total || 0,

        income,

        expenses,

        balance:
            income - expenses,

        genderDistribution
    };
};


module.exports = {
    getMemberReport,
    getAttendanceReport,
    getFinanceReport,
    getOverviewReport
};