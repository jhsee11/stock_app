import React, { useState } from 'react';
import BarChart from '../components/BarChart';
import LineChart from '../components/LineChart';
import PieChart from '../components/PieChart';
import { UserData } from '../data/chartData';
import axios from 'axios';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const StockPrice = () => {
  const [options, setOptions] = useState([
    { ticker: 'AAPL' },
    { ticker: 'V' },
    { ticker: 'AMZN' },
  ]);

  const [stock, setStock] = useState({
    ticker: '',
    startDate: '',
    endDate: '',
  });

  const [value, setValue] = useState('fruit');

  const [retrieveStock, setRetrieveStock] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    {
      console.log(`Stock is ${JSON.stringify(stock)}`);

      axios
        .get(`http://localhost:5001/api/stock_price/ticker/${stock.ticker}`)
        .then((res) => {
          console.log(res);
          console.log(res.data);
          //setRetrieveStock(res.data);
          setTargetStock({
            // need to fetch the data from mongo db
            labels: res.data.map((stock) => stock.index),
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
    }
  };

  const handleChange = (e) => {
    let newObj = { ...stock };
    console.log('hahaha');
    console.log(e.target.name);

    newObj[e.target.name] = e.target.value;
    console.log(newObj);
    setStock(newObj);
  };

  const [targetStock, setTargetStock] = useState({
    // need to fetch the data from mongo db
    labels: retrieveStock.map((data) => data.index),
    datasets: [
      {
        label: 'Stocks Price',
        data: retrieveStock.map((data) => data.adjclose),
        borderColor: 'black',
        borderWidth: 2,
      },
    ],
  });

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
    <div>
      <div className="mt-8"></div>
      <form
        onSubmit={handleSubmit}
        className="bg-green-200 shadow-md rounded px-1 pt-1 pb-1 w-32"
      >
        <div className="w-28">
          <select name="ticker" className="w-28" onChange={handleChange}>
            {options.map((option) => (
              <option key={option.ticker} value={option.ticker}>
                {option.ticker}
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

      <div style={{ width: 700 }}>
        {/*<BarChart chartData={userData} />*/}
        <LineChart chartData={userData} />
        <LineChart chartData={targetStock} />
        {/*<PieChart chartData={userData} />*/}
      </div>
    </div>
  );
};

export default StockPrice;
