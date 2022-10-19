const mongoose = require('mongoose');

/*
{ "_id" : ObjectId("634e983cbda60c43dea34b59"), "ticker" : "V", "endDate" : ISODate("2021-09-30T00:00:00Z"), "investments" : 519000000, "changeToLiabilities" : 88000000, "totalCashflowsFromInvestingActivities" : -152000000, "netBorrowings" : -3000000000, "totalCashFromFinancingActivities" : -14410000000, "changeToOperatingActivities" : -6447000000, "issuanceOfStock" : 208000000, "netIncome" : 12311000000, "changeInCash" : 628000000, "repurchaseOfStock" : -8820000000, "effectOfExchangeRate" : -37000000, "totalCashFromOperatingActivities" : 15227000000, "depreciation" : 804000000, "otherCashflowsFromInvestingActivities" : 109000000, "dividendsPaid" : -2798000000, "changeToAccountReceivables" : -343000000, "changeToNetincome" : 8814000000, "capitalExpenditures" : -705000000, "otherCashflowsFromFinancingActivities" : NaN }
*/

const BalanceSheetSchema = new mongoose.Schema({
  ticker: { type: String },
  endDate: { type: Date },
  investments: { type: Number },
  changeToLiabilities: { type: Number },
  totalCashflowsFromInvestingActivities: { type: Number },
  netBorrowings: { type: Number },
  totalCashFromFinancingActivities: { type: Number },
  changeToOperatingActivities: { type: Number },
  issuanceOfStock: { type: Number },
  netIncome: { type: Number },
  changeInCash: { type: Number },
  repurchaseOfStock: { type: Number },
  effectOfExchangeRate: { type: Number },
  totalCashFromOperatingActivities: { type: Number },
  depreciation: { type: Number },
  otherCashflowsFromInvestingActivities: { type: Number },
  dividendsPaid: { type: Number },
  changeToAccountReceivables: { type: Number },
  changeToNetincome: { type: Number },
  capitalExpenditures: { type: Number },
  otherCashflowsFromFinancingActivities: { type: Number },
});

module.exports = mongoose.model(
  'Company_CashFlowStatements',
  BalanceSheetSchema
);
