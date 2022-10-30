const router = require('express').Router();
const Company_StatsVals = require('../models/Company_StatsVals');
const Company_QuoteTables = require('../models/Company_QuoteTables');
const Company_IncomeStatements = require('../models/Company_IncomeStatements');
const Company_CashFlowStatements = require('../models/Company_CashFlows');
const Company_BalanceSheets = require('../models/Company_BalanceSheets');

// Calculate Intrinsic Value for the stock
router.post('/intrinsic', async (req, res) => {
  try {
    console.log(req.body);
    // {"ticker":"AAPL","wacc" : 8.38, "predictGrowthRate": 5, interestExpense":2645000000,"totalDebt":287912000000,"taxRate":"13.30","beta":1.25,"riskFreeRate":3,"marketReturnRate":8,"marketCap":2500000000000,"outstandingShares":1600000000,"perpetualGrowthRate":2.5}

    let {
      ticker,
      predictGrowthRate,
      wacc,
      perpetualGrowthRate,
      outstandingShares,
    } = req.body;

    console.log(`req body is ${JSON.stringify(req.body)}`);
    let targetTicker = req.body.ticker;

    // calculate terminal value
    let cashFlowList = await Company_CashFlowStatements.find({
      ticker: targetTicker,
    });

    console.log(`cash flow is ${JSON.stringify(cashFlowList[0])}`);

    // project the next 5 years cash flow using the latest year free cash flow
    let freeCashFlow =
      cashFlowList[0].totalCashFromOperatingActivities +
      cashFlowList[0].capitalExpenditures;

    console.log(`Free cash flow  is ${freeCashFlow}`);

    {
      /*
    let terminalValue =
      (freeCashFlow *
        Math.pow(1 + predictGrowthRate / 100, 4) *
        (1 + perpetualGrowthRate / 100)) /
      ((wacc - perpetualGrowthRate) / 100); */
    }

    let terminalValue =
      (freeCashFlow *
        Math.pow(1 + predictGrowthRate / 100, 4) *
        (1 + perpetualGrowthRate / 100)) /
      ((wacc - perpetualGrowthRate) / 100);

    console.log(`Terminal Value is ${terminalValue}`);

    let PVCashFlow =
      (freeCashFlow * (1 + predictGrowthRate / 100)) / (1 + wacc / 100) +
      (freeCashFlow * Math.pow(1 + predictGrowthRate / 100, 2)) /
        Math.pow(1 + wacc / 100, 2) +
      (freeCashFlow * Math.pow(1 + predictGrowthRate / 100, 3)) /
        Math.pow(1 + wacc / 100, 3) +
      (freeCashFlow * Math.pow(1 + predictGrowthRate / 100, 4)) /
        Math.pow(1 + wacc / 100, 4) +
      terminalValue;

    console.log(`PV Cash flow is ${PVCashFlow}`);

    let intrinsicValue = PVCashFlow / outstandingShares;

    console.log(`Intrinsic Value is ${intrinsicValue}`);

    res.status(200).json(intrinsicValue.toFixed(2));
  } catch (err) {
    console.log(err);
  }
});

//Calculate WACC for the stock
router.post('/wacc', async (req, res) => {
  try {
    console.log(req.body);
    let target_ticker = req.body.ticker;
    console.log('retrieve intrinsic value for stock ' + target_ticker);

    let {
      marketCap,
      totalDebt,
      interestExpense,
      taxRate,
      beta,
      riskFreeRate,
      marketReturnRate,
      outstandingShares,
    } = req.body;

    {
      /*{"ticker":"AAPL","interestExpense":2645000000,"totalDebt":287912000000,"taxRate":"13.30","beta":1.25,"riskFreeRate":"1","marketReturnRate":"2","marketCap":"3","outstandingShares":"-1"}*/
    }

    // perform logic to calculate intrinsic value
    // let totalValue = marketCap + totalDebt
    // WACC  = (E/V x Re) + (D/V x Rd x (1 - Tc)
    // Cost of Equity = Risk-Free Rate of Return + Beta × (Market Rate of Return – Risk-Free Rate of Return)

    // let wacc = marketCap/totalValue * (riskFreeRate/100 + beta * (marketReturnRate/100 - riskFreeRate)) + (totalDebt/totalValue) * (interestExpense/totalDebt) * (1 - taxRate/100)

    let totalValue = marketCap + totalDebt;
    console.log(`total value is ${totalValue}`);
    console.log(`equity weight = ${marketCap / totalValue}`);
    let equityPart =
      (marketCap / totalValue) *
      (riskFreeRate / 100 +
        beta * (marketReturnRate / 100 - riskFreeRate / 100));

    console.log(`equity part is ${equityPart}`);

    let wacc =
      equityPart +
      (totalDebt / totalValue) *
        (interestExpense / totalDebt) *
        (1 - taxRate / 100);

    wacc = (wacc * 100).toFixed(2);

    console.log(`wacc is ${wacc}`);
    res.status(200).json(wacc);
  } catch (err) {
    console.log(err);
  }
});

router.get('/retrieve_cashflow/:ticker', async (req, res) => {
  try {
    const targetTicker = req.params.ticker;
    console.log('going to retrieve cash flow for ' + targetTicker);

    let cashflowStatementsList = await Company_CashFlowStatements.find({
      ticker: targetTicker,
    });

    res.status(200).json(cashflowStatementsList);
  } catch (err) {}
});

// GET Target Stock Auto Populate
router.get('/auto_populate/:ticker', async (req, res) => {
  try {
    const targetTicker = req.params.ticker;
    console.log('going to calculate data to be auto populated ' + targetTicker);

    let incomeStatementList = await Company_IncomeStatements.find({
      ticker: targetTicker,
    });

    // first is to get interest expense from income statement
    let interestExpense = Math.abs(incomeStatementList[0].interestExpense);

    console.log(`interest expense is ${interestExpense}`);

    // get tax rate for the company
    let incomeTaxExpense = incomeStatementList[0].incomeTaxExpense
      ? incomeStatementList[0].incomeTaxExpense
      : 'NA';

    let incomeBeforeTax = incomeStatementList[0].incomeBeforeTax
      ? incomeStatementList[0].incomeBeforeTax
      : 'NA';

    let taxRate = Number((incomeTaxExpense / incomeBeforeTax) * 100).toFixed(2);

    console.log(`tax rate is ${taxRate}%`);

    let totalLiabList = await Company_BalanceSheets.find({
      ticker: targetTicker,
    });

    let totalLiab = totalLiabList[0].totalLiab;

    console.log(`total liabilities is ${totalLiab}`);

    let quoteTableList = await Company_QuoteTables.find({
      ticker: targetTicker,
    });

    let beta = quoteTableList[0]['Beta (5Y Monthly)'];

    // form a output json

    let autoPopulateData = {
      ticker: targetTicker,
      interestExpense: interestExpense,
      totalDebt: totalLiab,
      taxRate: taxRate,
      beta: beta,
    };

    res.status(200).json(autoPopulateData);
  } catch (err) {}
});

// GET Target Stock Analysis
router.post('/ticker', async (req, res) => {
  try {
    console.log('retrieve TARGET stock analysis');
    console.log(req.body);
    let request = req.body;

    console.log(`request is ${JSON.stringify(request)}`);
    //'Trailing P/E' : {'$gt' : 20} }
    //{'Trailing P/E' : {"$gt" : 50} }

    try {
      let filterTickers = await Company_StatsVals.find({
        $and: request,
      });
      console.log(`filter tickers is is  ${JSON.stringify(filterTickers)}`);
      const listofTicker = [];
      filterTickers.map((targetTicker) => {
        listofTicker.push({ ticker: targetTicker.ticker });
      });
      console.log(listofTicker);
      // find all stocks with the returned ticker

      if (listofTicker.length > 0) {
        let displayTickers = await Company_QuoteTables.find({
          $or: listofTicker,
        });

        console.log('hello');

        console.log(`display ticker is ${displayTickers}`);
        console.log(`diplay ticker type is ${typeof displayTickers}`);
        console.log(Array.isArray(displayTickers));
        console.log(`filter ticker is ${JSON.stringify(filterTickers)}`);
        console.log(`filter ticker type is ${typeof filterTickers}`);
        console.log(Array.isArray(filterTickers));

        let parsed_displayTickers = JSON.parse(JSON.stringify(displayTickers));
        let parsed_filterTickers = JSON.parse(JSON.stringify(filterTickers));

        let combined = await parsed_displayTickers.map((x) =>
          Object.assign(
            x,
            parsed_filterTickers.find((y) => y['ticker'] == x.ticker)
          )
        );

        console.log(`combined res is ${JSON.stringify(combined)}`);

        res.status(200).json(combined);
      } else {
        res.status(200).json([]);
      }
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
