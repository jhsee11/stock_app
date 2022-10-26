const router = require('express').Router();
const Company_StatsVals = require('../models/Company_StatsVals');
const Company_QuoteTables = require('../models/Company_QuoteTables');

//GET Target Stock Analysis
router.post('/ticker', async (req, res) => {
  try {
    console.log('retrieve TARGET stock analysis');
    console.log(req.body);
    let request = req.body;

    console.log(`request is ${JSON.stringify(request)}`);
    //'Trailing P/E' : {'$gt' : 20} }
    //{'Trailing P/E' : {"$gt" : 50} }

    try {
      const filterTickers = await Company_StatsVals.find({
        $and: request,
      });
      const listofTicker = [];
      filterTickers.map((targetTicker) => {
        listofTicker.push({ ticker: targetTicker.ticker });
      });
      console.log(listofTicker);
      // find all stocks with the returned ticker

      const displayTickers = await Company_QuoteTables.find({
        $or: request,
      });

      res.status(200).json(displayTickers);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }

    // Trailing P/E - 22.97
    // Forward P/E - 21.93
    // PEG Ratio (5 yr expected) - 2.49
    // Price/Sales (ttm) - 5.90
    // Price/Book (mrq) - 38.44
    // Market Cap
    // [ {'Trailing P/E' : { $gt: 89} },  { 'PEG Ratio' : { $lt: 89} } ]

    console.log('end');
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
