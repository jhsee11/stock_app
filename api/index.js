const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
var bodyParser = require('body-parser');
const stocksPriceRoute = require('./routes/stockPrice');

const port = 5001;

const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

// stocks_database
// const url = 'mongodb://127.0.0.1:27017/stockApp';
const url = 'mongodb://127.0.0.1:27017/stocks_database';

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB Connection Successful'))
  .catch((err) => console.log(err));

app.use(cors(corsOptions));

app.use(express.json());

app.use('/api/stock_price', stocksPriceRoute);

app.get('/', (req, res) => {
  res.send('Hello World, from express');
});

app.listen(port, () =>
  console.log(`Hello world app listening on port ${port}!`)
);
