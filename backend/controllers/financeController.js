const financeService = require("../services/financeService");
const {
  successResponse,
  paginatedResponse
} = require("../utils/helpers");


// GET ALL TRANSACTIONS

const getTransactions = async (req, res, next) => {
  try {

    const result = await financeService.getTransactions(req.query);

    return paginatedResponse(
      res,
      "Transactions retrieved successfully.",
      result.transactions,
      result.pagination
    );

  } catch (error) {
    next(error);
  }
};



// GET SUMMARY

const getFinanceSummary = async (req, res, next) => {
  try {

    const summary = await financeService.getFinanceSummary();

    return successResponse(
      res,
      "Finance summary retrieved successfully.",
      { summary }
    );

  } catch (error) {
    next(error);
  }
};



// MONTHLY REPORT

const getMonthlyReport = async (req, res, next) => {
  try {

    const report = await financeService.getMonthlyReport();

    return successResponse(
      res,
      "Monthly finance report retrieved successfully.",
      { report }
    );

  } catch (error) {
    next(error);
  }
};



// CREATE TRANSACTION

const createTransaction = async (req, res, next) => {

  try {

    const transaction =
      await financeService.createTransaction(
        req.body,
        req.user._id
      );


    return successResponse(
      res,
      "Transaction created successfully.",
      { transaction },
      201
    );


  } catch(error) {
    next(error);
  }

};



// UPDATE TRANSACTION

const updateTransaction = async (req,res,next)=>{

  try {

    const transaction =
      await financeService.updateTransaction(
        req.params.id,
        req.body
      );


    return successResponse(
      res,
      "Transaction updated successfully.",
      { transaction }
    );


  } catch(error){

    next(error);

  }

};



// DELETE TRANSACTION

const deleteTransaction = async(req,res,next)=>{

  try {

    await financeService.deleteTransaction(
      req.params.id
    );


    return successResponse(
      res,
      "Transaction deleted successfully."
    );


  } catch(error){

    next(error);

  }

};



module.exports = {
  getTransactions,
  getFinanceSummary,
  getMonthlyReport,
  createTransaction,
  updateTransaction,
  deleteTransaction
};