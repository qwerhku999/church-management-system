const Attendance = require("../models/Attendance");
const Event = require("../models/Event");
const Member = require("../models/Member");

const {
  successResponse,
  paginatedResponse,
  getPaginationParams,
} = require("../utils/helpers");



// =====================================
// CREATE ATTENDANCE
// POST /api/attendance
// =====================================

const createAttendance = async (req, res, next) => {

  try {


    const {
      event,
      serviceType,
      records,
      visitorCount,
      childrenCount,
      onlineCount,
      date
    } = req.body;



    if (event) {

      const existingEvent =
        await Event.findById(event);



      if (!existingEvent) {

        return res.status(404).json({

          success: false,

          message: "Event not found."

        });

      }

    }



    if (!records || !Array.isArray(records) || records.length === 0) {

      return res.status(400).json({

        success: false,

        message: "Attendance records are required."

      });

    }





    // Validate members

    const memberIds =
      records.map(
        item => item.person
      );



    const members =
      await Member.find({

        _id: {
          $in: memberIds
        }

      });



    if (members.length !== memberIds.length) {

      return res.status(404).json({

        success: false,

        message: "One or more members were not found."

      });

    }





    // Calculate counts

    const memberCount =
      records.length;



    const totalCount =
      memberCount +
      (visitorCount || 0) +
      (childrenCount || 0) +
      (onlineCount || 0);




    const attendance =
      await Attendance.create({

        event,

        serviceType,

        memberCount,

        visitorCount: visitorCount || 0,

        childrenCount: childrenCount || 0,

        onlineCount: onlineCount || 0,

        totalCount,

        records,

        date: date || Date.now(),

        recordedBy: req.user._id

      });




    return successResponse(

      res,

      "Attendance recorded successfully.",

      {
        attendance
      },

      201

    );



  } catch (error) {

    next(error);

  }

};

// =====================================
// GET ALL ATTENDANCE
// =====================================

const getAttendance = async (req, res, next) => {

  try {


    const {
      page,
      limit,
      skip
    } = getPaginationParams(req.query);



    const filter = {};



    if (req.query.event) {

      filter.event = req.query.event;

    }



    if (req.query.serviceType) {

      filter.serviceType = req.query.serviceType;

    }



    if (req.query.date) {

      const date = new Date(req.query.date);


      const nextDay = new Date(date);


      nextDay.setDate(
        date.getDate() + 1
      );



      filter.date = {

        $gte: date,

        $lt: nextDay

      };

    }




    const [
      attendance,
      total
    ] = await Promise.all([



      Attendance.find(filter)

        .populate(
          "records.person",
          "firstName lastName phone"
        )


        .populate(
          "event",
          "title startDate"
        )


        .populate(
          "recordedBy",
          "firstName lastName"
        )


        .sort({

          date: -1

        })


        .skip(skip)


        .limit(limit),




      Attendance.countDocuments(filter)



    ]);





    return paginatedResponse(

      res,

      "Attendance retrieved successfully.",

      attendance,

      {

        total,

        page,

        limit,

        pages: Math.ceil(total / limit)

      }

    );



  } catch (error) {

    next(error);

  }

};






// =====================================
// GET SINGLE ATTENDANCE
// =====================================

const getAttendanceById = async (req, res, next) => {

  try {


    const attendance =

      await Attendance.findById(req.params.id)



        .populate(

          "records.person",

          "firstName lastName phone"

        )



        .populate(

          "event",

          "title startDate"

        )



        .populate(

          "recordedBy",

          "firstName lastName"

        );





    if (!attendance) {

      return res.status(404).json({

        success: false,

        message: "Attendance record not found."

      });

    }





    return successResponse(

      res,

      "Attendance retrieved successfully.",

      {
        attendance
      }

    );



  } catch (error) {

    next(error);

  }

};






// =====================================
// UPDATE ATTENDANCE
// =====================================

const updateAttendance = async (req, res, next) => {

  try {


    const attendance =

      await Attendance.findById(req.params.id);




    if (!attendance) {

      return res.status(404).json({

        success: false,

        message: "Attendance record not found."

      });

    }




    Object.assign(

      attendance,

      req.body

    );





    if (attendance.records) {


      attendance.memberCount =
        attendance.records.length;



      attendance.totalCount =

        attendance.memberCount +

        (attendance.visitorCount || 0) +

        (attendance.childrenCount || 0) +

        (attendance.onlineCount || 0);


    }





    await attendance.save();





    return successResponse(

      res,

      "Attendance updated successfully.",

      {
        attendance
      }

    );



  } catch (error) {

    next(error);

  }

};


// =====================================
// DELETE ATTENDANCE
// =====================================

const deleteAttendance = async (req, res, next) => {

  try {


    const attendance =

      await Attendance.findByIdAndDelete(
        req.params.id
      );



    if (!attendance) {

      return res.status(404).json({

        success: false,

        message: "Attendance record not found."

      });

    }





    return successResponse(

      res,

      "Attendance deleted successfully."

    );



  } catch (error) {

    next(error);

  }

};







// =====================================
// MEMBER ATTENDANCE HISTORY
// GET /api/attendance/member/:memberId
// =====================================

const getMemberAttendance = async (req, res, next) => {

  try {


    const records =

      await Attendance.find({

        "records.person":
          req.params.memberId

      })

        .populate(

          "event",

          "title startDate"

        );





    let present = 0;

    let absent = 0;

    let late = 0;

    let excused = 0;




    records.forEach(record => {


      const memberRecord =

        record.records.find(

          item =>

            item.person.toString() ===
            req.params.memberId

        );



      if (memberRecord) {


        switch (memberRecord.status) {


          case "present":

            present++;

            break;



          case "absent":

            absent++;

            break;



          case "late":

            late++;

            break;



          case "excused":

            excused++;

            break;


        }


      }


    });






    const totalServices =
      records.length;




    return successResponse(

      res,

      "Member attendance history retrieved.",

      {

        totalServices,

        present,

        absent,

        late,

        excused,


        attendanceRate:

          totalServices

            ?

            `${Math.round(
              (present / totalServices) * 100
            )}%`

            :

            "0%",


        records

      }

    );



  } catch (error) {

    next(error);

  }

};








// ATTENDANCE STATISTICS
// GET /api/attendance/stats


const getAttendanceStats = async (req, res, next) => {
  try {

    // Overall attendance statistics


    const totalServices = await Attendance.countDocuments();

    const result = await Attendance.aggregate([
      {
        $unwind: "$records",
      },
      {
        $group: {
          _id: "$records.status",
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    const stats = {
      present: 0,
      absent: 0,
      late: 0,
      excused: 0,
    };

    result.forEach((item) => {
      if (Object.prototype.hasOwnProperty.call(stats, item._id)) {
        stats[item._id] = item.count;
      }
    });


    // Current week attendance
    // Monday → Sunday


    const now = new Date();

    const startOfWeek = new Date(now);
    const day = startOfWeek.getDay();

    // Convert Sunday = 0 to Monday-based week
    const daysFromMonday = day === 0 ? 6 : day - 1;

    startOfWeek.setDate(
      startOfWeek.getDate() - daysFromMonday
    );

    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);

    endOfWeek.setDate(
      endOfWeek.getDate() + 7
    );


    // Group attendance by day


    const weeklyResult = await Attendance.aggregate([
      {
        $match: {
          date: {
            $gte: startOfWeek,
            $lt: endOfWeek,
          },
        },
      },

      {
        $group: {
          _id: {
            $dayOfWeek: "$date",
          },

          attendance: {
            $sum: "$totalCount",
          },
        },
      },
    ]);

    // Create Monday → Sunday structure


    const dayNames = [
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
      "Sun",
    ];

    const weeklyAttendance = dayNames.map(
      (dayName, index) => {
        // MongoDB:
        // Sunday = 1
        // Monday = 2
        // Tuesday = 3
        // ...
        // Saturday = 7

        const mongoDay = index === 6
          ? 1
          : index + 2;

        const found = weeklyResult.find(
          (item) =>
            item._id === mongoDay
        );

        return {
          day: dayName,
          attendance: found
            ? found.attendance
            : 0,
        };
      }
    );


    // Response

    return successResponse(
      res,
      "Attendance statistics retrieved.",
      {
        totalServices,
        ...stats,
        weeklyAttendance,
      }
    );
  } catch (error) {
    next(error);
  }
};







module.exports = {

  createAttendance,

  getAttendance,

  getAttendanceById,

  updateAttendance,

  deleteAttendance,

  getMemberAttendance,

  getAttendanceStats

};