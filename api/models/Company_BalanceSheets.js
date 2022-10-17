const mongoose = require('mongoose');

/*
{ "_id" : ObjectId("634ae9d10e868ff28a45c21c"), "ticker" : "V", "endDate" : ISODate("2018-09-30T00:00:00Z"), "intangibleAssets" : 28574000000, "capitalSurplus" : 16678000000, "totalLiab" : 35219000000, "totalStockholderEquity" : 28536000000, "otherCurrentLiab" : 9338000000, "totalAssets" : 69225000000, "otherCurrentAssets" : 3233000000, "retainedEarnings" : 11318000000, "otherLiab" : 7284000000, "goodWill" : 15194000000, "treasuryStock" : 540000000, "otherAssets" : 1703000000, "cash" : 8162000000, "totalCurrentLiabilities" : 11305000000, "deferredLongTermAssetCharges" : 14000000, "shortLongTermDebt" : NaN, "otherStockholderEquity" : 540000000, "propertyPlantEquipment" : 1456000000, "totalCurrentAssets" : 18216000000, "longTermInvestments" : 4082000000, "netTangibleAssets" : -15232000000, "shortTermInvestments" : 3547000000, "netReceivables" : 2790000000, "longTermDebt" : 16630000000, "accountsPayable" : 183000000 }
*/

const BalanceSheetSchema = new mongoose.Schema({
  ticker: { type: String },
  endDate: { type: Date },
  intangibleAssets: { type: Number },
  totalLiab: { type: Number },
  totalStockholderEquity: { type: Number },
  otherCurrentLiab: { type: Number },
  totalAssets: { type: Number },
  otherCurrentAssets: { type: Number },
  retainedEarnings: { type: Number },
  otherLiab: { type: Number },
  goodWill: { type: Number },
  treasuryStock: { type: Number },
  otherAssets: { type: Number },
  cash: { type: Number },
  totalCurrentLiabilities: { type: Number },
  deferredLongTermAssetCharges: { type: Number },
  shortLongTermDebt: { type: Number },
  otherStockholderEquity: { type: Number },
  propertyPlantEquipment: { type: Number },
  totalCurrentAssets: { type: Number },
  longTermInvestments: { type: Number },
  netTangibleAssets: { type: Number },
  shortTermInvestments: { type: Number },
  netReceivables: { type: Number },
  longTermDebt: { type: Number },
  accountsPayable: { type: Number },
});

module.exports = mongoose.model('Company_BalanceSheets', BalanceSheetSchema);
