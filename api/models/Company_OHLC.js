const mongoose = require('mongoose');

/*
{ "_id" : ObjectId("630ad7131915ca790466c4e7"), "index" : ISODate("1981-01-12T00:00:00Z"), "open" : 0.14229899644851685, "high" : 0.14229899644851685, "low" : 0.141183003783226, "close" : 0.141183003783226, "adjclose" : 0.11004352569580078, "volume" : 23699200, "ticker" : "AAPL" }
*/

/*
{ "_id" : ObjectId("62b98ca9907c58f0e3848dce"), "date" : ISODate("2022-05-02T16:00:00Z"), "items" : [ { "category" : "Self-Development", "account" : "Cash", "amount" : 100000000000000, "note" : "I veryyyyyy richhhhhhhhhhh", "description" : "", "_id" : ObjectId("62b98ca9907c58f0e3848dcf") } ], "__v" : 0 }
*/

const OHLCSchema = new mongoose.Schema({
  index: { type: Date, required: true, unique: true },
  open: { type: Number },
  high: { type: Number },
  low: { type: Number },
  close: { type: Number },
  adjclose: { type: Number },
  volume: { type: Number },
  ticker: { type: String },
});

module.exports = mongoose.model('Company_OHLC', OHLCSchema);
