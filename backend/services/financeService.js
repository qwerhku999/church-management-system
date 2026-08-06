const Finance = require("../models/Finance");



// GET ALL

const getTransactions = async(query)=>{

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;


    const filter = {};


    if(query.type)
        filter.type = query.type;


    if(query.category)
        filter.category = query.category;


    if(query.status)
        filter.status = query.status;



    const [
        transactions,
        total
    ] = await Promise.all([

        Finance.find(filter)
        .populate(
            "recordedBy",
            "firstName lastName"
        )
        .sort({
            date:-1
        })
        .skip(skip)
        .limit(limit),


        Finance.countDocuments(filter)

    ]);



    return {

        transactions,

        pagination:{
            total,
            page,
            limit,
            pages:Math.ceil(total/limit)
        }

    };

};




// CREATE

const createTransaction = async(data,userId)=>{


    const transaction =
        await Finance.create({

            ...data,

            recordedBy:userId

        });


    return transaction;

};




// UPDATE

const updateTransaction = async(id,data)=>{


    const transaction =
        await Finance.findByIdAndUpdate(

            id,

            data,

            {
                new:true,
                runValidators:true
            }

        );


    if(!transaction){

        const error = new Error(
            "Transaction not found."
        );

        error.statusCode = 404;

        throw error;

    }


    return transaction;

};




// DELETE

const deleteTransaction = async(id)=>{


    const transaction =
        await Finance.findByIdAndDelete(id);


    if(!transaction){

        const error =
            new Error(
                "Transaction not found."
            );

        error.statusCode=404;

        throw error;

    }


    return transaction;

};





// SUMMARY

const getFinanceSummary = async()=>{


    const income =
        await Finance.aggregate([

            {
                $match:{
                    type:"income"
                }
            },

            {
                $group:{
                    _id:null,
                    total:{
                        $sum:"$amount"
                    }
                }
            }

        ]);



    const expenses =
        await Finance.aggregate([

            {
                $match:{
                    type:"expense"
                }
            },

            {
                $group:{
                    _id:null,
                    total:{
                        $sum:"$amount"
                    }
                }
            }

        ]);



    return {

        income:
        income[0]?.total || 0,


        expenses:
        expenses[0]?.total || 0,


        balance:
        (income[0]?.total || 0)
        -
        (expenses[0]?.total || 0)

    };

};





// MONTHLY REPORT

const getMonthlyReport = async()=>{


    return await Finance.aggregate([

        {
            $group:{
                _id:{
                    month:{
                        $month:"$date"
                    },

                    year:{
                        $year:"$date"
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

getTransactions,
createTransaction,
updateTransaction,
deleteTransaction,
getFinanceSummary,
getMonthlyReport

};