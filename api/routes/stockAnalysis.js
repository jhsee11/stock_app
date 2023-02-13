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
      avgFreeCashFlow,
    } = req.body;

    console.log(`req body is ${JSON.stringify(req.body)}`);
    let targetTicker = req.body.ticker;

    let freeCashFlow = avgFreeCashFlow;

    // calculate terminal value

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

//Calculate WACC for the stock - weighted average cost of capital
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
    //   let totalValue = marketCap + totalDebt
    //   WACC  = (E/V x Re) + (D/V x Rd x (1 - Tc)
    //   Cost of Equity = Risk-Free Rate of Return + Beta × (Market Rate of Return – Risk-Free Rate of Return)

    //   let wacc = marketCap/totalValue * (riskFreeRate/100 + beta * (marketReturnRate/100 - riskFreeRate)) + (totalDebt/totalValue) * (interestExpense/totalDebt) * (1 - taxRate/100)

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

// retrieve cash flow for particular ticker
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

// Return Target Stock Analysis for filter
router.post('/ticker', async (req, res) => {
  try {
    console.log('retrieve TARGET stock analysis');
    console.log(req.body);
    let request = req.body;

    console.log(`request is ${JSON.stringify(request)}`);
    //'Trailing P/E' : {'$gt' : 20} }
    //{'Trailing P/E' : {"$gt" : 50} }

    try {
      let statsValTickers = await Company_StatsVals.find({
        $and: request,
      });
      console.log(`filter tickers is is  ${JSON.stringify(statsValTickers)}`);
      const listofTicker = [];

      statsValTickers.map((targetTicker) => {
        listofTicker.push({ ticker: targetTicker.ticker });
      });
      console.log(listofTicker);
      // find all stocks with the returned ticker

      if (listofTicker.length > 0) {
        let quoteTickers = await Company_QuoteTables.find({
          $or: listofTicker,
        });

        console.log(`display ticker is ${quoteTickers}`);
        console.log(`diplay ticker type is ${typeof quoteTickers}`);
        console.log(Array.isArray(quoteTickers));
        console.log(`filter ticker is ${JSON.stringify(statsValTickers)}`);
        console.log(`filter ticker type is ${typeof statsValTickers}`);
        console.log(Array.isArray(statsValTickers));

        let parsed_quoteTickers = JSON.parse(JSON.stringify(quoteTickers));
        let parsed_statsValTickers = JSON.parse(
          JSON.stringify(statsValTickers)
        );

        let combined = await parsed_quoteTickers.map((x) =>
          Object.assign(
            x,
            parsed_statsValTickers.find((y) => y['ticker'] == x.ticker)
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
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
