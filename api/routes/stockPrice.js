const router = require('express').Router();
const Company_OHLC = require('../models/Company_OHLC');

//GET ALL
router.get('/', async (req, res) => {
  try {
    console.log('retrieve data');
    const ohlc = await Company_OHLC.find();
    console.log(ohlc);
    res.status(200).json(ohlc);
    console.log('end');
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
