import React, { useState, useEffect } from 'react';
import BarChart from '../components/BarChart';
import LineChart from '../components/LineChart';
import PieChart from '../components/PieChart';
import { UserData } from '../data/chartData';
import axios from 'axios';
import moment from 'moment';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import StockInfoTab from '../components/Tab';

const StockPrice = () => {
  const [options, setOptions] = useState([]);
  const [retrieveStock, setRetrieveStock] = useState([]);
  const [statsVal, setStatsVal] = useState([]);
  const [quotes, setQuotes] = useState({});
  const [incomeStatements, setIncomeStatements] = useState([]);
  const [balanceSheets, setBalanceSheets] = useState([]);
  const [cashflowStatements, setCashflowStatements] = useState([]);
  const [openTab, setOpenTab] = useState(1);

  const [stock, setStock] = useState({
    ticker: '',
    startDate: '',
    endDate: '',
  });

  const [targetStock, setTargetStock] = useState({
    // need to fetch the data from mongo db
    // labels: retrieveStock.map((data) => data.index.getDate()),
    labels: '',
    datasets: [
      {
        label: 'Stocks Price',
        data: '',
        borderColor: 'black',
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    axios
      .get('http://localhost:5001/api/stock_price/list/ticker')
      .then((response) => {
        console.log(`response is ${JSON.stringify(response.data)}`);
        setOptions(response.data);

        //set the default stock ticker to be the first in the list
        let newObj = { ...stock };
        newObj['ticker'] = response.data[0];
        setStock(newObj);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(`Stock is ${JSON.stringify(stock)}`);

    axios
      .post(`http://localhost:5001/api/stock_price/ticker`, stock)
      .then((res) => {
        console.log(res);
        console.log(res.data);

        //setRetrieveStock(res.data);
        setTargetStock({
          // need to fetch the data from mongo db
          labels: res.data.map(
            (stock) =>
              //new Date(stock.index).toLocaleDateString()
              moment(new Date(stock.index)).format('DD MMM YYYY') // June 1, 2019
          ),
          datasets: [
            {
              label: 'Stocks Price',
              data: res.data.map((stock) => stock.adjclose),
              borderColor: 'black',
              borderWidth: 2,
            },
          ],
        });
      });

    /* get stock stats val */
    axios
      .get(`http://localhost:5001/api/stock_price/statsvals/${stock.ticker}`)
      .then((res) => {
        console.log('stats val for stocks');
        console.log(res.data);
        setStatsVal(res.data);
      });

    /* get stocks quotes */
    axios
      .get(`http://localhost:5001/api/stock_price/quotes/${stock.ticker}`)
      .then((res) => {
        console.log('quotes for stocks');
        console.log(res.data);
        setQuotes(res.data[0]);
      });

    /* get income statement */
    axios
      .get(
        `http://localhost:5001/api/stock_price/income_statement/${stock.ticker}`
      )
      .then((res) => {
        console.log('income statement for stocks');
        console.log(res.data);
        setIncomeStatements(res.data);
      });

    /*get balance sheets */
    axios
      .get(
        `http://localhost:5001/api/stock_price/balance_sheet/${stock.ticker}`
      )
      .then((res) => {
        console.log('balance sheet for stocks');
        console.log(res.data);
        setBalanceSheets(res.data);
      });

    /*get cash flows */
    axios
      .get(
        `http://localhost:5001/api/stock_price/cashflow_statement/${stock.ticker}`
      )
      .then((res) => {
        console.log('cashflow statements for stocks');
        console.log(res.data);
        setCashflowStatements(res.data);
      });
  };

  const handleChange = (e) => {
    let newObj = { ...stock };
    console.log(e.target.name);
    newObj[e.target.name] = e.target.value;
    console.log(newObj);
    setStock(newObj);
  };

  const [userData, setUserData] = useState({
    // need to fetch the data from mongo db
    labels: UserData.map((data) => data.year),
    datasets: [
      {
        label: 'Users Gained',
        data: UserData.map((data) => data.userGain),
        borderColor: 'black',
        borderWidth: 2,
      },
    ],
  });

  return (
    <div className="w-[80%]">
      <div className="w-full flex">
        <form
          onSubmit={handleSubmit}
          className="mt-8 bg-green-200 shadow-md rounded px-6 py-3 w-36 h-max"
        >
          <div>
            <select name="ticker" onChange={handleChange}>
              {options.map((ticker) => (
                <option key={ticker} value={ticker}>
                  {ticker}
                </option>
              ))}
            </select>
          </div>

          <label className="mt-4 block text-black text-sm font-bold mb-1">
            StartDate
          </label>
          <DatePicker
            className="text-center  w-24 rounded py-1 px-1 mb-2 text-black"
            selected={stock.startDate}
            name="date"
            onChange={(newDate) => {
              setStock({ ...stock, startDate: newDate });
            }}
          />

          <label className="mt-2 block text-black text-sm font-bold mb-1">
            EndDate
          </label>
          <DatePicker
            className="text-center  w-24 rounded py-1 px-1 mb-2 text-black"
            selected={stock.endDate}
            name="date"
            onChange={(newDate) => {
              setStock({ ...stock, endDate: newDate });
            }}
          />
          <button
            className="mt-2 w-24 text-black bg-yellow-200 font-bold uppercase text-sm px-3 py-2 rounded hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
            type="submit"
          >
            Submit
          </button>
        </form>

        <div className="ml-20">
          {/*<BarChart chartData={userData} />
             <LineChart chartData={userData} />*/}
          <LineChart chartData={targetStock} />
          <div className="mt-8 ml-4 flex">
            <div className="w-72">
              <h1 className="text-blue-800 text-xl mb-2">Stats</h1>
              <div className="grid grid-rows-9 grid-flow-col gap-2 border-2 border-gray-500">
                {statsVal.map((stats) => (
                  <div className="px-2 py-1">
                    <li key={stats.Attribute} value={stats.Recent}>
                      {stats.Attribute} - {stats.Recent}
                    </li>
                    <hr />
                  </div>
                ))}
              </div>
            </div>
            <div className="ml-16">
              <h1 className="text-blue-800 text-xl mb-2">Quotes</h1>
              <div className="grid grid-rows-9 grid-flow-col gap-2 border-2 border-gray-500">
                {Object.keys(quotes)
                  .filter((key) => key != 'ticker' && key != '_id')
                  .map((key) => {
                    return (
                      <div className="px-2 py-1" key={key}>
                        <li key={key}>
                          {key}: {quotes[key]}
                        </li>
                        <hr />
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
          <div>
            <StockInfoTab
              incomeStatements={incomeStatements}
              balanceSheets={balanceSheets}
              cashflowStatements={cashflowStatements}
            />
          </div>
        </div>

        <div>{/*<PieChart chartData={userData} />*/}</div>
      </div>
    </div>
  );
};

export default StockPrice;
