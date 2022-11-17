import React, { useState, useEffect } from 'react';
import BarChart from '../components/BarChart';
import LineChart from '../components/LineChart';
import PieChart from '../components/PieChart';
import { UserData } from '../data/chartData';
import axios from 'axios';
import moment from 'moment';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../react_datepicker.css';
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
  const [showStats, setShowStats] = useState(false);
  const [showQuotes, setShowQuotes] = useState(false);

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

  const [display, setDisplay] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(`Stock is ${JSON.stringify(stock)}`);

    setDisplay(true);

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
        setShowStats(true);
      });

    /* get stocks quotes */
    axios
      .get(`http://localhost:5001/api/stock_price/quotes/${stock.ticker}`)
      .then((res) => {
        console.log('quotes for stocks');
        console.log(res.data);
        setQuotes(res.data[0]);
        setShowQuotes(true);
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
    <div className="w-full ml-32 mr-10 mx-auto overflow-auto md:overflow-auto">
      <div className="w-full md:flex ">
        <form
          onSubmit={handleSubmit}
          className="mb-8 mt-8 flex items-center md:block md:w-40 w-[640px] bg-green-2 shadow-md rounded px-4 py-6 h-max "
        >
          <div className="flex justify-center">
            <select
              className="w-24 p-0.5"
              name="ticker"
              onChange={handleChange}
            >
              {options.map((ticker) => (
                <option key={ticker} value={ticker}>
                  {ticker}
                </option>
              ))}
            </select>
          </div>

          <label className="ml-6 mr-4 md:ml-0 md:mr-0 flex justify-center md:mt-4 block text-gray-200 text-sm font-bold mb-1">
            StartDate
          </label>
          <div className="">
            <DatePicker
              portalId="root-portal"
              popperClassName="date-picker-reports"
              className="mt-2 md:mt-0 text-center w-24 rounded py-1 px-1 mb-2 text-black z-0"
              dateFormatCalendar="yyyy"
              selected={stock.startDate}
              name="date"
              onChange={(newDate) => {
                setStock({ ...stock, startDate: newDate });
              }}
              peekNextMonth
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
            />
          </div>

          <label className="ml-4 md:ml-0 md:mr-0 flex justify-center md:mt-2 block text-gray-200 text-sm font-bold mb-1">
            EndDate
          </label>

          <DatePicker
            style={{ 'z-index': -100 }}
            className="mt-2 md:mt-0 text-center w-24 rounded py-1 px-1 mb-2 text-black z-0"
            selected={stock.endDate}
            name="date"
            onChange={(newDate) => {
              setStock({ ...stock, endDate: newDate });
            }}
            peekNextMonth
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
          />
          <div className="ml-4 md:ml-0 flex justify-center">
            <button
              className="md:mt-4 w-24 text-black bg-yellow-2 font-bold uppercase text-sm px-3 py-2 rounded hover:shadow-lg outline-none focus:outline-none mb-1"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>

        <div className="md:ml-24 md:mr-20">
          <LineChart chartData={targetStock} />
          {!display && (
            <div className="mt-24 flex justify-center italic text-lg">
              Click Submit to see more info
            </div>
          )}
          {display && (
            <div className="mt-8 ml-4 md:flex md:overflow-auto">
              <div className="w-72">
                <h1 className="text-green-1 text-xl mb-2 underline underline-offset-4">
                  Stats
                </h1>
                {showStats && (
                  <div>
                    {statsVal.map((stats) => {
                      return (
                        <div className="grid grid-rows-9 grid-flow-row gap-2 border-gray-500">
                          {Object.keys(stats)
                            .filter((key) => key != 'ticker' && key != '_id')
                            .map((key) => {
                              return (
                                <div className="py-1">
                                  <li
                                    className="text-sm md:text-md whitespace-nowrap "
                                    key={key}
                                    value={stats.Recent}
                                  >
                                    {key} - {stats[key]}
                                  </li>
                                </div>
                              );
                            })}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="mt-8 md:mt-0 md:ml-16">
                <h1 className="text-green-1 text-xl mb-2 underline underline-offset-4">
                  Quotes
                </h1>
                {showQuotes && (
                  <div className="grid grid-rows-20 md:grid-rows-9 grid-flow-col gap-x-8 gap-2 border-gray-500 ">
                    {Object.keys(quotes)
                      .filter((key) => key != 'ticker' && key != '_id')
                      .map((key) => {
                        return (
                          <div className="py-1" key={key}>
                            <li
                              className="text-sm md:text-md whitespace-nowrap"
                              key={key}
                            >
                              {key}: {quotes[key]}
                            </li>
                            <hr />
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>
          )}
          {display && (
            <div className="mt-12 mb-32">
              <StockInfoTab
                incomeStatements={incomeStatements}
                balanceSheets={balanceSheets}
                cashflowStatements={cashflowStatements}
              />
            </div>
          )}
        </div>

        <div>{/*<PieChart chartData={userData} />*/}</div>
      </div>
    </div>
  );
};

export default StockPrice;
