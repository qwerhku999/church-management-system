const Member = require("../models/Member");
const Event = require("../models/Event");
const Donation = require("../models/Donation");
const Finance = require("../models/Finance");
const Attendance = require("../models/Attendance");
const User = require("../models/User");



const getDashboardStats = async () => {

    const [
        totalMembers,
        activeMembers,
        upcomingEvents,
        totalDonations,
        financeSummary,
        todayAttendance,
        recentMembers,
        recentTransactions
    ] = await Promise.all([


        // Members
        Member.countDocuments(),


        Member.countDocuments({
            membershipStatus: "active"
        }),


        // Upcoming events
        Event.countDocuments({
            startDate: {
                $gte: new Date()
            }
        }),


        // Donations
        Donation.aggregate([
            {
                $group:{
                    _id:null,
                    total:{
                        $sum:"$amount"
                    }
                }
            }
        ]),


        // Finance
        Finance.aggregate([
            {
                $group:{
                    _id:"$type",
                    total:{
                        $sum:"$amount"
                    }
                }
            }
        ]),


        // Today's attendance
        Attendance.aggregate([
            {
                $match:{
                    date:{
                        $gte:new Date(
                            new Date().setHours(0,0,0,0)
                        )
                    }
                }
            },
            {
                $group:{
                    _id:null,
                    total:{
                        $sum:"$totalCount"
                    }
                }
            }
        ]),


        // Recent members
        Member.find()
            .sort({
                createdAt:-1
            })
            .limit(5)
            .select(
                "firstName lastName email createdAt"
            ),


        // Recent transactions
        Finance.find()
            .sort({
                createdAt:-1
            })
            .limit(5)
            .populate(
                "recordedBy",
                "firstName lastName"
            )

    ]);



    let income = 0;
    let expenses = 0;


    financeSummary.forEach(item=>{

        if(item._id==="income"){
            income=item.total;
        }


        if(item._id==="expense"){
            expenses=item.total;
        }

    });



    return {

        members:{
            total:totalMembers,
            active:activeMembers
        },


        events:{
            upcoming:upcomingEvents
        },


        donations:{
            total:
            totalDonations[0]?.total || 0
        },


        finance:{
            income,
            expenses,
            balance:
                income-expenses
        },


        attendance:{
            today:
            todayAttendance[0]?.total || 0
        },


        recentMembers,


        recentTransactions

    };

};



module.exports = {
    getDashboardStats
};