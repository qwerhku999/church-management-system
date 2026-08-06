const Member = require("../models/Member");
const Ministry = require("../models/Ministry");
const Event = require("../models/Event");
const Attendance = require("../models/Attendance");

const {
  successResponse
} = require("../utils/helpers");



// =====================================
// GET DASHBOARD DATA
// =====================================

const getDashboard = async(req,res,next)=>{

  try{


    const [

      totalMembers,

      totalMinistries,

      totalEvents,

      totalAttendanceRecords


    ] = await Promise.all([


      Member.countDocuments(),


      Ministry.countDocuments(),


      Event.countDocuments(),


      Attendance.countDocuments()


    ]);





    const attendanceStats =

      await Attendance.aggregate([


        {
          $unwind:"$records"
        },


        {

          $group:{

            _id:"$records.status",

            count:{
              $sum:1
            }

          }

        }


      ]);






    const attendance = {

      present:0,

      absent:0,

      late:0,

      excused:0

    };





    attendanceStats.forEach(item=>{

      attendance[item._id] =
        item.count;

    });







    const recentMembers =

      await Member.find()

      .sort({
        createdAt:-1
      })

      .limit(5)

      .select(
        "firstName lastName phone createdAt"
      );





    const upcomingEvents =

      await Event.find({

        startDate:{
          $gte:new Date()
        }

      })

      .sort({

        startDate:1

      })

      .limit(5)

      .select(
        "title startDate category"
      );







    return successResponse(

      res,

      "Dashboard data retrieved successfully.",

      {

        overview:{

          totalMembers,

          totalMinistries,

          totalEvents,

          totalAttendanceRecords

        },


        attendance,


        recent:{

          members:recentMembers,

          events:upcomingEvents

        }

      }

    );




  }catch(error){

    next(error);

  }

};





module.exports = {

  getDashboard

};