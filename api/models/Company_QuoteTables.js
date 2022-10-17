const mongoose = require('mongoose');

//{ "_id" : ObjectId("634959730a482aa6704b58c4"), "1y Target Est" : 170.32, "52 Week Range" : "101.26 - 188.11", "Ask" : "112.44 x 1000", "Avg. Volume" : 57317096, "Beta (5Y Monthly)" : 1.32, "Bid" : "112.11 x 900", "Day's Range" : "105.35 - 113.44", "EPS (TTM)" : 1.1, "Earnings Date" : "Oct 26, 2022 - Oct 31, 2022", "Ex-Dividend Date" : NaN, "Forward Dividend & Yield" : "N/A (N/A)", "Market Cap" : "1.146T", "Open" : 107.88, "PE Ratio (TTM)" : 102.3, "Previous Close" : 112.9, "Quote Price" : 112.52999877929688, "Volume" : 85623604, "ticker" : "AMZN" }

const QuoteSchema = new mongoose.Schema({
  '1y Target Est': { type: Number },
  '52 Week Range': { type: String },
  Ask: { type: String },
  'Avg. Volume': { type: Number },
  'Beta (5Y Monthly)': { type: Number },
  Bid: { type: String },
  "Days's Range": { type: String },
  'EPS (TTM)': { type: Number },
  'Earnings Date': { type: String },
  'Ex-Dividend Date': { type: String },
  'Forward Dividend & Yield': { type: String },
  'Market Cap': { type: String },
  Open: { type: Number },
  'PE Ratio (TTM)': { type: Number },
  'Previous Close': { type: Number },
  'Quote Price': { type: Number },
  Volume: { type: Number },
  ticker: { type: String },
});

module.exports = mongoose.model('Company_QuoteTables', QuoteSchema);
