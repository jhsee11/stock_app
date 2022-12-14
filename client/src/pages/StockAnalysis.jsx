import React, { useState, useEffect } from 'react';
import LineChart from '../components/LineChart';
import axios from 'axios';
import { Input, Select, Option, Tooltip } from '@material-tailwind/react';
import moment from 'moment';

import FinanceTable from '../components/FinanceTable';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope,
  faTrash,
  faDeleteLeft,
} from '@fortawesome/free-solid-svg-icons';

const StockAnalysis = () => {
  const [options, setOptions] = useState([]);
  // Trailing P/E - 22.97
  // Forward P/E - 21.93
  // PEG Ratio (5 yr expected) - 2.49
  // Price/Sales (ttm) - 5.90
  // Price/Book (mrq) - 38.44
  // Market Cap

  // Enterprise Value/Revenue
  // Enterprise Value/EBITDA
  // PE Ratio (TTM)

  useEffect(() => {
    axios
      .get('http://localhost:5001/api/stock_price/list/ticker')
      .then((response) => {
        console.log(`response is ${JSON.stringify(response.data)}`);
        setOptions(response.data);
        console.log(`response is ${JSON.stringify(response.data[0])}`);
        setIntrinsic({ ticker: response.data[0] });
      });
  }, []);

  useEffect(() => {
    if (inputList.length > 0) {
      inputList[inputList.length - 1].input === ''
        ? setIsDisabled(true)
        : setIsDisabled(false);
    }
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

  const [inputList, setInputList] = useState([
    {
      input: '',
      input2: '',
      input_rank: null,
      displayVal2: false,
    },
  ]);

  const [screenedStock, setScreenedStock] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);

  const optionList = [
    'PEG Ratio (5 yr expected)',
    'Trailing P/E',
    'Forward P/E',
    'Price/Sales (ttm)',
    'Price/Book (mrq)',
    'Enterprise Value/Revenue',
    'Enterprise Value/EBITDA',
  ];

  const operatorList = ['Greater Than', 'Less Than', 'Equal', 'Between'];

  const [dropDown, setDropdown] = useState({
    filter: optionList[0],
    operator: operatorList[0],
  });

  const [filterList, setFilterList] = useState([]);

  const handleListAdd = () => {
    setInputList([
      ...inputList,
      {
        input: '',
        input_rank: null,
      },
    ]);
  };

  const handleInputChange = (event, index, dropDown) => {
    const { value, name } = event.target;
    console.log(`name is ${name} lol, value is ${value}`);
    console.log(dropDown);

    const newInputList = [...inputList];
    if (name == 'input1') {
      console.log('setting input1');
      newInputList[index].input = value;
    } else {
      newInputList[index].input2 = value;
    }
    newInputList[index].input_rank = index + 1;
    setInputList(newInputList);

    // add the new filter
    let newObj = {};
    //newObj[dropDown.filter] = event.target.value;
    newObj['attribute'] = dropDown.filter;
    newObj['value'] = newInputList[index].input;
    newObj['value2'] = newInputList[index].input2;
    console.log(`value 1 is ${newObj['value']}`);
    console.log(`value 2 is ${newObj['value2']}`);
    newObj['operator'] = dropDown['operator'];

    // push the filter to filter list
    let newFilterList = [...filterList];
    newFilterList[index] = newObj;
    setFilterList(newFilterList);
    console.log(JSON.stringify(filterList));
  };

  const handleSelectChange = (event, index) => {
    const { value, name } = event.target;
    console.log(`handling Select, value is ${value}, name is ${name}`);

    // add the new filter
    let newObj = { ...dropDown };
    newObj[name] = value;
    console.log(newObj);
    setDropdown(newObj);
    // need to display the second column value if it is equal to between
    if (value == 'Between') {
      const newInputList = [...inputList];
      newInputList[index].displayVal2 = true;
      setInputList(newInputList);
    } else {
      const newInputList = [...inputList];
      newInputList[index].displayVal2 = false;
      setInputList(newInputList);
      // have to remove the DropDown and reset ?
      // need to change filter list wor
      let newFilterList = [...filterList];
      newFilterList[index]['operator'] = value;
      delete newFilterList[index]['value2'];
      setFilterList(newFilterList);
      console.log(JSON.stringify(filterList));
    }
  };

  const handleRemoveItem = (index) => {
    const newList = [...inputList];
    newList.splice(index, 1);
    setInputList(newList);

    filterList.splice(index, 1);
  };

  const symbolMapping = {
    'Greater Than': '$gt',
    'Less Than': '$lt',
    Equal: '$eq',
    Between: ['$gt', '$lt'],
  };

  const [intrinsic, setIntrinsic] = useState({});
  const [autoPopulate, setAutoPopulate] = useState({});

  const handleChange = (e) => {
    let newObj = { ...intrinsic };
    console.log(e.target.name);

    if (e.target.name != 'ticker') {
      newObj[e.target.name] = parseFloat(e.target.value);
    } else {
      newObj[e.target.name] = e.target.value;
    }

    console.log(newObj);
    setIntrinsic(newObj);
  };

  const handleAutoPopulate = (e) => {
    console.log('auto populate data');
    console.log(`${JSON.stringify(intrinsic.ticker)}`);
    let stock = intrinsic.ticker;

    axios
      .get(`http://localhost:5001/api/stock_analysis/auto_populate/${stock}`)
      .then((res) => {
        console.log('returned intrinsic value');
        console.log(res.data);
        setIntrinsic(res.data);
        console.log(`final is ${JSON.stringify(intrinsic)}`);
      });
  };

  const [cashFlowList, setCashFlowList] = useState([]);

  const handleDelete = (index, e) => {
    setCashFlowList(cashFlowList.filter((v, i) => i !== index));
  };

  const [avgFreeCashFlow, setAvgFreeCashFlow] = useState();

  const handleCalculateAvgCashFlow = (e) => {
    e.preventDefault();

    console.log('calculating average cash flow from report');

    let avgFreeCashFlow = 0;
    let count = 0;

    //cashFlow

    for (let i = 0; i < cashFlowList.length; i++) {
      let obj = cashFlowList[i];

      avgFreeCashFlow =
        avgFreeCashFlow +
        obj.totalCashFromOperatingActivities +
        obj.capitalExpenditures;
      count = count + 1;

      console.log(`count is ${count},avg free cash flow is ${avgFreeCashFlow}`);
    }

    console.log(
      `zzz avg free cash flow is ${JSON.stringify(avgFreeCashFlow / count)}`
    );

    setAvgFreeCashFlow((avgFreeCashFlow / count).toFixed(2));

    let newObj = { ...intrinsic };
    newObj['avgFreeCashFlow'] = parseFloat(
      (avgFreeCashFlow / count).toFixed(2)
    );
    console.log(newObj);
    setIntrinsic(newObj);
  };

  const handleRetrieveCashFlow = (e) => {
    e.preventDefault();
    console.log(`Retrieving cash flow report for ${intrinsic.ticker}`);

    //retrieve_cashflow
    axios
      .get(
        `http://localhost:5001/api/stock_analysis//retrieve_cashflow/${intrinsic.ticker}`
      )
      .then((res) => {
        console.log(`cash flow report is ${JSON.stringify(res.data)}`);
        //totalCashFromOperatingActivities
        //capitalExpenditures
        setCashFlowList(res.data);
      });
  };

  const handleCalculateIntrinsic = (e) => {
    e.preventDefault();

    console.log('Calculating intrinsic value');
    console.log(`${JSON.stringify(intrinsic)}`);

    axios
      .post(`http://localhost:5001/api/stock_analysis/intrinsic`, intrinsic)
      .then((res) => {
        console.log(`wacc is ${res.data}%`);

        let newObj = { ...intrinsic };
        newObj['intrinsicValue'] = parseFloat(res.data);
        setIntrinsic(newObj);
      });
  };

  const handleCalculateWACC = (e) => {
    e.preventDefault();

    console.log('going to calculate intrinsic value');
    console.log(`${JSON.stringify(intrinsic)}`);

    axios
      .post(`http://localhost:5001/api/stock_analysis/wacc`, intrinsic)
      .then((res) => {
        console.log('returned intrinsic value');
        console.log(`wacc is ${res.data}%`);

        let newObj = { ...intrinsic };
        newObj['wacc'] = parseFloat(res.data);
        setIntrinsic(newObj);
        //setWacc(res.data);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let analysisList = [];

    for (let i = 0; i < filterList.length; i++) {
      let newObj = {};
      console.log(filterList[i]);
      for (const property in filterList[i]) {
        console.log(`${property}: ${filterList[i][property]}`);
        // form the json
        let symbol = symbolMapping[filterList[i]['operator']];
        console.log(symbol);

        if (filterList[i][property] == 'Between') {
          newObj[filterList[i]['attribute']] = {
            [symbol[0]]: parseInt(filterList[i]['value']),
            [symbol[1]]: parseInt(filterList[i]['value2']),
          };
        } else {
          newObj[filterList[i]['attribute']] = {
            [symbol]: parseInt(filterList[i]['value']),
          };
        }
      }

      console.log(newObj);
      // add into analysis list
      analysisList.push(newObj);
      console.log(JSON.stringify(analysisList));
    }

    axios
      .post(`http://localhost:5001/api/stock_analysis/ticker`, analysisList)
      .then((res) => {
        console.log('returned analytics results');
        console.log(res.data);
        setScreenedStock(res.data);
      });
  };

  const editField = (name, value, index) => {
    console.log('trigger edit');
    console.log(`value is ${value}, name is ${name}`);
    // Clone students data before mutation
    let clonedCashFlowList = cashFlowList.map((item) => ({ ...item }));

    if (
      name == 'totalCashFromOperatingActivities' ||
      name == 'capitalExpenditures'
    ) {
      value = parseFloat(value);
    }

    clonedCashFlowList[index][name] = value;
    console.log(`clone cash flow is ${JSON.stringify(clonedCashFlowList)}`);
    setCashFlowList(clonedCashFlowList);
  };

  return (
    <div className="w-full ml-24 mr-20 mx-auto overflow-auto  md:overflow-auto ">
      <div className="overflow-auto md:overflow-auto">
        <h1 className="font-bold text-lg underline underline-offset-4">
          Stock Screener Attributes
        </h1>
        {inputList.length > 0
          ? inputList.map((input, index) => (
              <div
                key={index}
                className="relative flex mt-6 w-full lg:max-w-sm"
              >
                <select
                  name="filter"
                  onChange={(event) => handleSelectChange(event, index)}
                  className="w-max-content p-2.5 text-gray-500 bg-white border rounded-md shadow-sm outline-none appearance-none focus:border-indigo-600"
                >
                  {optionList.map((option, index) => (
                    <option key={index}>{option}</option>
                  ))}
                </select>

                <select
                  name="operator"
                  onChange={(event) => handleSelectChange(event, index)}
                  className="ml-4 w-max-content p-2.5 text-gray-500 bg-white border rounded-md shadow-sm outline-none appearance-none focus:border-indigo-600"
                >
                  {operatorList.map((operator, index) => (
                    <option key={index}>{operator}</option>
                  ))}
                </select>

                <input
                  name="input1"
                  className="ml-4 border rounded-md p-2.5"
                  id="outlined-basic"
                  label={`test`}
                  variant="outlined"
                  onChange={(event) =>
                    handleInputChange(event, index, dropDown)
                  }
                />

                {input.displayVal2 && (
                  <input
                    name="input2"
                    className="ml-4 border rounded-md p-2.5"
                    id="outlined-basic"
                    label={`test`}
                    variant="outlined"
                    onChange={(event) =>
                      handleInputChange(event, index, dropDown)
                    }
                  />
                )}
                <button
                  className="ml-4"
                  onClick={() => handleRemoveItem(index)}
                >
                  <span role="img" aria-label="x emoji">
                    ???
                  </span>
                </button>
              </div>
            ))
          : 'No item in the list '}
        <button
          className="block rounded text-center mt-8 text-yellow-2 bg-green-1 w-28 p-2 "
          onClick={handleListAdd}
          disabled={isDisabled}
        >
          Add Filter
        </button>
        <button
          className="block rounded text-center mt-8 text-yellow-2 bg-green-1  w-28 p-2"
          onClick={handleSubmit}
          disabled={isDisabled}
        >
          Submit
        </button>

        <div className="mt-10">
          <table className="overflow-auto table-fixed border-spacing-2 border border-black">
            <thead>
              <tr>
                {screenedStock.map((stock, index) => {
                  const displayHeader = [
                    'Avg. Volume',
                    'Market Cap',
                    'PE Ratio (TTM)',
                    '52 Week Range',
                    "Day's Range",
                    'Quote Price',
                    'Volume',
                    'EPS (TTM)',
                    'Earnings Date',
                    'PEG Ratio (5 yr expected)',
                    'Price/Book (mrq)',
                    'Price/Sales (ttm)',
                    'Enterprise Value/Revenue',
                    'Enterprise Value/EBITDA',
                  ];

                  return (
                    index == 0 && (
                      <>
                        <th
                          key={index}
                          className="w-[200px] border border-black whitespace-nowrap p-1"
                        >
                          Ticker
                        </th>
                        {Object.keys(stock).map((key) => {
                          return (
                            displayHeader.indexOf(key) != -1 && (
                              <th
                                key={key}
                                className="w-80 border border-black whitespace-nowrap p-1"
                              >
                                {key}
                              </th>
                            )
                          );
                        })}
                      </>
                    )
                  );
                })}
              </tr>
            </thead>

            <tbody>
              {screenedStock.map((stock, index) => {
                const displayHeader = [
                  'Avg. Volume',
                  'Market Cap',
                  'PE Ratio (TTM)',
                  '52 Week Range',
                  "Day's Range",
                  'Quote Price',
                  'Volume',
                  'EPS (TTM)',
                  'Earnings Date',
                  'PEG Ratio (5 yr expected)',
                  'Price/Book (mrq)',
                  'Price/Sales (ttm)',
                  'Enterprise Value/Revenue',
                  'Enterprise Value/EBITDA',
                ];
                return (
                  <tr
                    key={index}
                    className="border border-black whitespace-nowrap"
                  >
                    <td className="border border-black text-center p-1">
                      {stock['ticker']}
                    </td>
                    {Object.keys(stock).map((key) => {
                      return (
                        displayHeader.indexOf(key) != -1 && (
                          <td
                            key={key}
                            className="whitespace-nowrap border border-black text-center p-1"
                          >
                            {stock[key]}
                          </td>
                        )
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <hr className="my-2 border border-gray-500" />
      <div className="mt-8">
        <h1 className="font-bold text-xl underline underline-offset-4 ">
          Intrinsic Value Calculation (DCF Approach)
        </h1>

        <p className="mt-6 font-bold">
          WACC (Weight Average Cost of Capital ) = (E/V x Re) + (D/V x Rd x (1 -
          Tc)
        </p>
        <p className="mt-2 ml-2 italic">
          E = market value of the firm's equity
        </p>
        <p className="mt-2 ml-2 italic">D = market value of the firm's debt</p>
        <p className="mt-2 ml-2 italic">V = E + D</p>
        <p className="mt-2 ml-2 italic">Re = cost of equity</p>
        <p className="ml-4 text-xs">
          Cost of Equity = Risk-Free Rate of Return + Beta ?? (Market Rate of
          Return ??? Risk-Free Rate of Return)
        </p>
        <p className="mt-2 ml-2 italic">Rd = cost of debt</p>
        <p className="ml-4 text-xs">
          Cost of Debt = Interest Expense / Total Debt
        </p>
        <p className="mt-2 ml-2 italic">Tc = corporate tax rate</p>

        <form
          onSubmit={handleCalculateWACC}
          className="mt-8 ml-4 w-full max-w-[360px] border border-green-1 pt-4 pb-4 px-8 p-2"
        >
          <h1 className="font-bold italic underline underline-offset-4">
            Calculate WACC
          </h1>
          <div className="mt-6 mb-6">
            <div className="w-[240px] px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-first-name"
              >
                Ticker
              </label>
              <select
                className="mt-4 rounded appearance-none block w-full bg-gray-200 text-gray-700 borderrounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white  focus:border-red-500 "
                name="ticker"
                onChange={handleChange}
              >
                {options.map((ticker) => (
                  <option key={ticker} value={ticker}>
                    {ticker}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAutoPopulate}
                className="md:mt-2 md:ml-2 w-max text-yellow-2 bg-green-1 font-bold uppercase text-xs px-3 py-2 rounded hover:shadow-lg outline-none focus:outline-none mb-1"
              >
                Auto Populate data
              </button>
            </div>

            <div className="mt-6 w-[240px] px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-last-name"
              >
                Interest Expense
              </label>
              <Tooltip
                content="Income Statement Interest Expense"
                placement="right-end"
              >
                <input
                  onChange={handleChange}
                  name="interestExpense"
                  value={intrinsic.interestExpense || ''}
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-last-name"
                  type="number"
                  placeholder="Income Statement Interest Expense "
                />
              </Tooltip>
            </div>
            <div className="mt-4 w-[240px] px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-last-name"
              >
                Total Debt
              </label>
              <Tooltip
                content="Balance Sheet Total Liabiability"
                placement="right-end"
              >
                <input
                  onChange={handleChange}
                  name="totalDebt"
                  value={intrinsic.totalDebt || ''}
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-last-name"
                  type="number"
                  placeholder="Balance Sheet Total Liab"
                />
              </Tooltip>
            </div>
            <div className="mt-4 w-[240px] px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-last-name"
              >
                Tax Rate (%)
              </label>
              <Tooltip
                content="IncomeTaxExpense/IncomeBeforeTax"
                placement="right-end"
              >
                <input
                  onChange={handleChange}
                  name="taxRate"
                  value={intrinsic.taxRate || ''}
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-last-name"
                  type="number"
                  placeholder="IncomeTaxExpense/IncomeBeforeTax"
                />
              </Tooltip>
            </div>
            <div className="mt-4 w-[240px]  px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-last-name"
              >
                Beta
              </label>
              <Tooltip
                content="Beta - Get from Financial Stats"
                placement="right-end"
              >
                <input
                  onChange={handleChange}
                  name="beta"
                  value={intrinsic.beta || ''}
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-last-name"
                  type="number"
                  placeholder="Beta"
                />
              </Tooltip>
            </div>
            <div className="mt-4 w-[240px]  px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-last-name"
              >
                Risk Free Rate (%)
              </label>

              <input
                onChange={handleChange}
                name="riskFreeRate"
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-last-name"
                type="number"
                placeholder="Risk Free Rate"
              />
            </div>
            <div className="mt-4 w-[240px] px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-last-name"
              >
                Market Return Rate (%)
              </label>

              <input
                onChange={handleChange}
                name="marketReturnRate"
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-last-name"
                type="number"
                placeholder="Market Rate"
              />
            </div>
            <div className="mt-4 w-[240px] px-3">
              <label
                className=" block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-last-name"
              >
                Market Cap (Own Input)
              </label>

              <input
                onChange={handleChange}
                name="marketCap"
                className=" appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-last-name"
                type="number"
                placeholder="Market Cap"
              />
            </div>
            <div className="mt-4 w-[240px] px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-last-name"
              >
                Outstanding Shares (Own Input)
              </label>

              <input
                onChange={handleChange}
                name="outstandingShares"
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-last-name"
                type="number"
                placeholder="Outstanding Shares"
              />
            </div>

            <div className="mt-8 mb-6">
              <div className=" px-3">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-password"
                >
                  WACC
                </label>
                <div className="w-[180px] pt-2 rounded block uppercase tracking-wide text-gray-700 first-line:font-bold mb-2 h-10 bg-gray-50 px-3">
                  {intrinsic.wacc}
                </div>

                <p className="mt-2 text-gray-600 text-xs italic">
                  Calculated WACC value
                </p>
              </div>

              <button
                className="mt-8 md:mt-8 md:ml-4 w-max text-yellow-2 bg-green-1 font-bold uppercase text- px-3 py-2 rounded hover:shadow-lg outline-none focus:outline-none mb-1"
                type="submit"
              >
                Calculate WACC
              </button>
            </div>
          </div>
        </form>
        {/*mt-8 w-full max-w-[360px] border border-green-1 pt-4 pb-4 px-8 p-2 */}
        {/*mt-4 w-full max-w-lg*/}
        <form
          onSubmit={handleCalculateIntrinsic}
          className="mt-4 w-full max-w-lg"
        >
          {/*
          <p className="mt-8 ml-4 font-bold">
            Terminal Value : V0 = FCFE x (1+g) / (r-g)
          </p>
          */}
          <div className="mt-8 mb-8 w-full md:w-1/2 px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-last-name"
            >
              Next 5 Years Growth Rate (%)
            </label>

            <input
              onChange={handleChange}
              name="predictGrowthRate"
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-last-name"
              type="number"
              step="0.01"
              placeholder="5 years growth rate"
            />
          </div>
          <div className="mt-8 mb-8 w-full md:w-1/2 px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-last-name"
            >
              Perpetual Growth Rate (%)
            </label>

            <input
              onChange={handleChange}
              name="perpetualGrowthRate"
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-last-name"
              type="number"
              step="0.01"
              placeholder="Perpetual Growth Rate"
            />
          </div>
          <div className="mt-8 mb-8 w-full md:w-1/2 px-3">
            <label
              className=" block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-last-name"
            >
              Free Cash Flow used for Projection (%)
            </label>
            <div></div>

            <input
              onChange={handleChange}
              value={avgFreeCashFlow}
              name="avgFreeCashFlow"
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-last-name"
              type="number"
              step="0.01"
              placeholder="Free Cash Flow"
            />
            <button
              onClick={handleCalculateAvgCashFlow}
              className="mt-8 whitespace-pre-wrap w-48 text-yellow-2 bg-green-1 font-bold uppercase text-sm px-3 py-2 rounded hover:shadow-lg outline-none focus:outline-none"
              type="button"
            >
              Use Avg CashFlow
            </button>

            <button
              onClick={handleRetrieveCashFlow}
              className="mt-6 whitespace-pre-wrap w-48 text-yellow-2 bg-green-1 font-bold uppercase text-sm px-3 py-2 rounded hover:shadow-lg outline-none focus:outline-none"
              type="button"
            >
              Retrieve <br /> Cash Flow Report
            </button>
          </div>

          <div>
            <table className="table-fixed mt-4 ml-4">
              {cashFlowList.map((cashFlow, index) => {
                cashFlow['freeCashFlow'] = 0;
                cashFlow['YoY Change %'] = 0;

                return (
                  <>
                    <thead>
                      {index == 0 && (
                        <tr>
                          {Object.keys(cashFlow)
                            .filter(
                              (key) =>
                                key == 'ticker' ||
                                key == 'totalCashFromOperatingActivities' ||
                                key == 'capitalExpenditures' ||
                                key == 'endDate' ||
                                key == 'freeCashFlow' ||
                                key == 'YoY Change %'
                            )
                            .map((cashFlowElement, index_1) => {
                              return (
                                <th className="w-80 border border-green-1 p-2 whitespace-nowrap">
                                  {cashFlowElement}
                                </th>
                              );
                            })}
                        </tr>
                      )}
                    </thead>
                  </>
                );
              })}
              <tbody>
                {cashFlowList.map((cashFlow, index) => {
                  cashFlow['freeCashFlow'] =
                    cashFlow['totalCashFromOperatingActivities'] +
                    cashFlow['capitalExpenditures'];

                  if (index < cashFlowList.length - 1) {
                    cashFlow['YoY Change %'] =
                      ((cashFlow['freeCashFlow'] -
                        (cashFlowList[index + 1][
                          'totalCashFromOperatingActivities'
                        ] +
                          cashFlowList[index + 1]['capitalExpenditures'])) /
                        (cashFlowList[index + 1][
                          'totalCashFromOperatingActivities'
                        ] +
                          cashFlowList[index + 1]['capitalExpenditures'])) *
                      100;

                    cashFlow['YoY Change %'] =
                      cashFlow['YoY Change %'].toFixed(2);
                  } else {
                    cashFlow['YoY Change %'] = 'NA';
                  }

                  return (
                    <>
                      <tr key={index}>
                        {Object.keys(cashFlow)
                          .filter(
                            (key) =>
                              key == 'ticker' ||
                              key == 'totalCashFromOperatingActivities' ||
                              key == 'capitalExpenditures' ||
                              key == 'endDate' ||
                              key == 'freeCashFlow' ||
                              key == 'YoY Change %'
                          )
                          .map((cashFlowElement, index_1) => {
                            if (cashFlowElement == 'endDate') {
                              cashFlow[cashFlowElement] = moment(
                                new Date(cashFlow[cashFlowElement])
                              ).format('DD MMM YYYY');
                            }

                            return (
                              <>
                                <td className="w-80 text-center border border-green-1 p-2 whitespace-nowrap">
                                  <input
                                    onChange={(e) =>
                                      editField(
                                        e.target.name,
                                        e.target.value,
                                        index
                                      )
                                    }
                                    className="bg-yellow-2"
                                    name={cashFlowElement}
                                    value={cashFlow[cashFlowElement] || ''}
                                  />
                                </td>
                              </>
                            );
                          })}
                        <td>
                          <button
                            className="ml-2 text-lg"
                            onClick={(e) => handleDelete(index, e)}
                          >
                            <FontAwesomeIcon icon={faDeleteLeft} />
                          </button>
                        </td>
                      </tr>
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="w-full mt-12 px-2">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-password"
            >
              Intrinsic Value
            </label>
            <div className="rounded bg-white w-48 h-12 p-2 px-4">
              {intrinsic.intrinsicValue}
            </div>

            <p className="mt-2 text-gray-600 text-xs italic">
              Calculated Intrinsic value
            </p>

            <button
              className="md:mt-8 w-48 text-yellow-2 bg-green-1 font-bold uppercase text-sm px-3 py-2 rounded hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
              type="submit"
            >
              Calculate <br />
              Intrinsic Value
            </button>
          </div>
        </form>
        <div className="mt-6 -mx-3 mb-8"></div>
      </div>
    </div>
  );
};

export default StockAnalysis;
