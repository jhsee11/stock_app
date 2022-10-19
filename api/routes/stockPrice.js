const router = require('express').Router();
const Company_OHLC = require('../models/Company_OHLC');
const Company_StatsVals = require('../models/Compnay_StatsVals');
const Company_QuoteTables = require('../models/Company_QuoteTables');
const Company_IncomeStatements = require('../models/Company_IncomeStatements');
const Company_BalanceSheets = require('../models/Company_BalanceSheets');
const Company_CashFlowStatements = require('../models/Company_CashFlows');

//GET Target Stock
router.post('/ticker', async (req, res) => {
  try {
    console.log('retrieve TARGET data');
    console.log(req.body);
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const targetTicker = req.body.ticker;
    const ohlc = await Company_OHLC.find({
      $and: [
        { ticker: targetTicker },
        {
          index: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      ],
    });
    //console.log(ohlc);
    res.status(200).json(ohlc);
    console.log('end');
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//GET statsvals of stocks
router.get('/statsvals/:ticker', async (req, res) => {
  try {
    const targetTicker = req.params.ticker;
    console.log('retrieve stocks stats vals');
    const tickerStatsVals = await Company_StatsVals.find({
      ticker: targetTicker,
    });
    console.log(tickerStatsVals);
    res.status(200).json(tickerStatsVals);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//GET quotes of stocks
router.get('/quotes/:ticker', async (req, res) => {
  try {
    const targetTicker = req.params.ticker;
    console.log('retrieve stocks quotes');
    const tickerQuotes = await Company_QuoteTables.find({
      ticker: targetTicker,
    });
    console.log(tickerQuotes);
    res.status(200).json(tickerQuotes);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//GET Income Statements
router.get('/income_statement/:ticker', async (req, res) => {
  try {
    const targetTicker = req.params.ticker;
    console.log('retrieve income statement');
    const tickerQuotes = await Company_IncomeStatements.find({
      ticker: targetTicker,
    });
    console.log(tickerQuotes);
    res.status(200).json(tickerQuotes);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//GET Balance Sheets
router.get('/balance_sheet/:ticker', async (req, res) => {
  try {
    const targetTicker = req.params.ticker;
    console.log('retrieve balance sheets');
    const tickerQuotes = await Company_BalanceSheets.find({
      ticker: targetTicker,
    });
    console.log(tickerQuotes);
    res.status(200).json(tickerQuotes);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//GET Cash Flows
router.get('/cashflow_statement/:ticker', async (req, res) => {
  try {
    const targetTicker = req.params.ticker;
    console.log('retrieve cash flow statements');
    const tickerQuotes = await Company_CashFlowStatements.find({
      ticker: targetTicker,
    });
    console.log(tickerQuotes);
    res.status(200).json(tickerQuotes);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//GET list of stocks
router.get('/list/ticker', async (req, res) => {
  try {
    console.log('retrieve list of stocks');
    const listOfTickers = await Company_OHLC.distinct('ticker');
    console.log(listOfTickers);
    res.status(200).json(listOfTickers);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//GET ALL
router.get('/', async (req, res) => {
  try {
    console.log('retrieve data');
    const ohlc = await Company_OHLC.find();
    //console.log(ohlc);
    res.status(200).json(ohlc);
    console.log('end');
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
