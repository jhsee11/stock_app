const mongoose = require('mongoose');

/*
{ "_id" : ObjectId("634aa81e6311b509dbe2d498"), "ticker" : "AAPL", "endDate" : ISODate("2018-09-29T00:00:00Z"), "researchDevelopment" : NumberLong("14236000000"), "effectOfAccountingCharges" : null, "incomeBeforeTax" : NumberLong("72903000000"), "minorityInterest" : null, "netIncome" : NumberLong("59531000000"), "sellingGeneralAdministrative" : NumberLong("16705000000"), "grossProfit" : NumberLong("101839000000"), "ebit" : NumberLong("70898000000"), "operatingIncome" : NumberLong("70898000000"), "otherOperatingExpenses" : null, "interestExpense" : NumberLong("-3240000000"), "extraordinaryItems" : null, "nonRecurring" : null, "otherItems" : null, "incomeTaxExpense" : NumberLong("13372000000"), "totalRevenue" : NumberLong("265595000000"), "totalOperatingExpenses" : NumberLong("194697000000"), "costOfRevenue" : NumberLong("163756000000"), "totalOtherIncomeExpenseNet" : 2005000000, "discontinuedOperations" : null, "netIncomeFromContinuingOps" : NumberLong("59531000000"), "netIncomeApplicableToCommonShares" : NumberLong("59531000000") }
*/

const IncomeStatementSchema = new mongoose.Schema({
  ticker: { type: String },
  endDate: { type: Date },
  researchDevelopment: { type: Number },
  effectOfAccountingCharges: { type: Number },
  incomeBeforeTax: { type: Number },
  minorityInterest: { type: Number },
  netIncome: { type: Number },
  sellingGeneralAdministrative: { type: Number },
  grossProfit: { type: Number },
  ebit: { type: Number },
  operatingIncome: { type: Number },
  otherOperatingExpenses: { type: Number },
  interestExpense: { type: Number },
  extraordinaryItems: { type: Number },
  nonRecurring: { type: Number },
  otherItems: { type: Number },
  incomeTaxExpense: { type: Number },
  totalRevenue: { type: Number },
  totalOperatingExpenses: { type: Number },
  costOfRevenue: { type: Number },
  totalOtherIncomeExpenseNet: { type: Number },
  discontinuedOperations: { type: Number },
  netIncomeFromContinuingOps: { type: Number },
  netIncomeApplicableToCommonShares: { type: Number },
});

module.exports = mongoose.model(
  'Company_IncomeStatements',
  IncomeStatementSchema
);
