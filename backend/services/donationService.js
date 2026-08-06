const Donation = require("../models/Donation");



// =====================================
// GET ALL DONATIONS
// =====================================

const getDonations = async (query) => {


  const page =
    Number(query.page) || 1;


  const limit =
    Number(query.limit) || 10;


  const skip =
    (page - 1) * limit;



  const filter = {};



  if(query.category){

    filter.category = query.category;

  }



  if(query.status){

    filter.status = query.status;

  }



  if(query.paymentMethod){

    filter.paymentMethod = query.paymentMethod;

  }



  if(query.donor){

    filter.donor = query.donor;

  }





  const [
    donations,
    total
  ] = await Promise.all([



    Donation.find(filter)

    .populate(
      "donor",
      "firstName lastName phone"
    )

    .populate(
      "recordedBy",
      "firstName lastName"
    )

    .populate(
      "event",
      "title startDate"
    )

    .sort({
      donationDate:-1
    })

    .skip(skip)

    .limit(limit),




    Donation.countDocuments(filter)



  ]);





  const summary = await getDonationSummary();





  return {

    donations,

    pagination:{

      total,

      page,

      limit,

      pages:
      Math.ceil(total / limit)

    },


    summary

  };


};







// =====================================
// GET SINGLE DONATION
// =====================================

const getDonationById = async(id)=>{


  const donation =

    await Donation.findById(id)

    .populate(
      "donor",
      "firstName lastName phone email"
    )

    .populate(
      "recordedBy",
      "firstName lastName"
    )

    .populate(
      "event",
      "title startDate"
    );




  if(!donation){

    throw new Error(
      "Donation not found."
    );

  }



  return donation;


};







// =====================================
// CREATE DONATION
// =====================================

const createDonation = async(data,userId)=>{


  const donation =

    await Donation.create({

      ...data,

      recordedBy:userId

    });



  return donation;


};







// =====================================
// UPDATE DONATION
// =====================================

const updateDonation = async(id,data)=>{


  const donation =

    await Donation.findByIdAndUpdate(

      id,

      data,

      {

        new:true,

        runValidators:true

      }

    );




  if(!donation){

    throw new Error(
      "Donation not found."
    );

  }



  return donation;


};







// =====================================
// DELETE DONATION
// =====================================

const deleteDonation = async(id)=>{


  const donation =

    await Donation.findByIdAndDelete(id);




  if(!donation){

    throw new Error(
      "Donation not found."
    );

  }


  return true;


};







// =====================================
// DONATION SUMMARY
// =====================================

const getDonationSummary = async(period)=>{


  const result =

    await Donation.aggregate([


      {

        $match:{

          status:"completed"

        }

      },



      {

        $group:{

          _id:null,

          totalAmount:{

            $sum:"$amount"

          },


          totalDonations:{

            $sum:1

          }

        }

      }


    ]);





  return {

    totalAmount:
      result[0]?.totalAmount || 0,


    totalDonations:
      result[0]?.totalDonations || 0


  };


};







// =====================================
// MONTHLY TREND
// =====================================

const getMonthlyTrend = async(months=12)=>{


  const date = new Date();


  date.setMonth(
    date.getMonth()-months
  );




  return await Donation.aggregate([


    {

      $match:{

        donationDate:{

          $gte:date

        },

        status:"completed"

      }

    },



    {

      $group:{

        _id:{

          year:{
            $year:"$donationDate"
          },

          month:{
            $month:"$donationDate"
          }

        },


        total:{

          $sum:"$amount"

        }


      }

    },


    {

      $sort:{

        "_id.year":1,

        "_id.month":1

      }

    }


  ]);


};







module.exports = {

  getDonations,

  getDonationById,

  createDonation,

  updateDonation,

  deleteDonation,

  getDonationSummary,

  getMonthlyTrend

};