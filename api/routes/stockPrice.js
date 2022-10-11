const router = require('express').Router();
const Company_OHLC = require('../models/Company_OHLC');

//GET Target Stock
router.get('/ticker/:ticker', async (req, res) => {
  try {
    console.log('retrieve TARGET data');
    const targetTicker = req.params.ticker;
    const ohlc = await Company_OHLC.find({ ticker: targetTicker });
    //console.log(ohlc);
    res.status(200).json(ohlc);
    console.log('end');
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
