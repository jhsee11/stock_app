const mongoose = require('mongoose');

/*
{ "_id" : ObjectId("6346c57f4515a9561a22fa09"), "ticker" : "AAPL", "Attribute" : "Market Cap (intraday)", "Recent" : "2.23T" }
{ "_id" : ObjectId("6346c57f4515a9561a22fa0a"), "ticker" : "AAPL", "Attribute" : "Enterprise Value", "Recent" : "2.30T" }
{ "_id" : ObjectId("6346c57f4515a9561a22fa0b"), "ticker" : "AAPL", "Attribute" : "Trailing P/E", "Recent" : "22.97" }
{ "_id" : ObjectId("6346c57f4515a9561a22fa0c"), "ticker" : "AAPL", "Attribute" : "Forward P/E", "Recent" : "21.93" }
{ "_id" : ObjectId("6346c57f4515a9561a22fa0d"), "ticker" : "AAPL", "Attribute" : "PEG Ratio (5 yr expected)", "Recent" : NaN }
{ "_id" : ObjectId("6346c57f4515a9561a22fa0e"), "ticker" : "AAPL", "Attribute" : "Price/Sales (ttm)", "Recent" : "5.90" }
{ "_id" : ObjectId("6346c57f4515a9561a22fa0f"), "ticker" : "AAPL", "Attribute" : "Price/Book (mrq)", "Recent" : "38.44" }
{ "_id" : ObjectId("6346c57f4515a9561a22fa10"), "ticker" : "AAPL", "Attribute" : "Enterprise Value/Revenue", "Recent" : "5.95" }
{ "_id" : ObjectId("6346c57f4515a9561a22fa11"), "ticker" : "AAPL", "Attribute" : "Enterprise Value/EBITDA", "Recent" : "17.50" }
*/

const StatsValSchema = new mongoose.Schema({
  ticker: { type: String },
  Attribute: { type: String },
  Recent: { type: String },
});

module.exports = mongoose.model('Company_StatsVals', StatsValSchema);
