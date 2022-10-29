import React, { useState, useEffect } from 'react';
import LineChart from '../components/LineChart';
import axios from 'axios';
import { Input, Select, Option } from '@material-tailwind/react';

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
      input_rank: null,
    },
  ]);

  const [value, setValue] = useState(null);
  const [screenedStock, setScreenedStock] = useState([]);

  const [isDisabled, setIsDisabled] = useState(false);

  const [optionList, setOptionList] = useState([
    'PEG Ratio (5 yr expected)',
    'Trailing P/E',
    'Forward P/E',
    'Price/Sales',
    'Price/Book',
  ]);

  const [operatorList, setOperatorList] = useState([
    'Greater Than',
    'Less Than',
    'Equal',
  ]);

  const [dropDown, setDropdown] = useState({
    filter: optionList[0],
    operator: operatorList[0],
  });
  const [filterList, setFilterList] = useState([]);
  const [filter, setFilter] = useState();

  {
    /*
  const handleFilterChange = (e) => {
    let newObj = { ...filter };
    console.log(e.target.name);
    newObj[e.target.name] = e.target.value;
    console.log(newObj);
    setFilter(newObj);
  }; */
  }

  useEffect(() => {
    if (inputList.length > 0) {
      inputList[inputList.length - 1].input === ''
        ? setIsDisabled(true)
        : setIsDisabled(false);
    }
  });

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
    newInputList[index].input = value;
    newInputList[index].input_rank = index + 1;
    setInputList(newInputList);

    // add the new filter
    let newObj = {};
    //newObj[dropDown.filter] = event.target.value;
    newObj['attribute'] = dropDown.filter;
    newObj['value'] = event.target.value;
    newObj['operator'] = dropDown['operator'];

    // push the filter to filter list
    let newFilterList = [...filterList];
    newFilterList[index] = newObj;
    setFilterList(newFilterList);
    console.log(JSON.stringify(filterList));

    {
      /*
    let newFilterList = { ...filterList };
    //newFilterList[index][dropDown.filter] = event.target.value;
    newFilterList[index]['operator'] = dropDown['operator'];
    setFilterList(newFilterList);
    console.log(filterList); */
    }
  };

  const handleSelectChange = (event) => {
    const { value, name } = event.target;
    console.log(`handling Select, value is ${value}, name is ${name}`);

    // add the new filter
    let newObj = { ...dropDown };
    newObj[name] = value;
    console.log('new object');
    console.log(newObj);
    setDropdown(newObj);
  };

  const handleRemoveItem = (index) => {
    const newList = [...inputList];
    newList.splice(index, 1);
    setInputList(newList);

    // arr.splice(i, 1);
    filterList.splice(index, 1);
  };

  const symbolMapping = {
    'Greater Than': '$gt',
    'Less Than': '$lt',
    Equal: '$eq',
  };

  const [intrinsic, setIntrinsic] = useState({});
  const [autoPopulate, setAutoPopulate] = useState({});
  const [wacc, setWacc] = useState();

  const handleChange = (e) => {
    let newObj = { ...intrinsic };
    console.log(e.target.name);
    newObj[e.target.name] = parseFloat(e.target.value);
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
        setAutoPopulate(res.data);
        //need to set the intrinsic object
        setIntrinsic(res.data);

        console.log(`final is ${JSON.stringify(intrinsic)}`);
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
        setWacc(res.data);
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

        newObj[filterList[i]['attribute']] = {
          $gt: parseInt(filterList[i]['value']),
        };
      }
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

    /* 
    [
        { ticker: targetTicker },
        {
          index: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      ]
    */

    {
      /*[
  {
    "attribute": "Trailing P/E",
    "value": "123",
    "operator": "Greater Than"
  },
  {
    "attribute": "Price/Sales",
    "value": "567",
    "operator": "Smaller Than"
  },
  {
    "attribute": "Forward P/E",
    "value": "56",
    "operator": "Smaller Than"
  }
]*/
    }
  };
  {
    /* <div className="relative right-80 ml-20 mr-20 mx-auto">*/
  }
  return (
    <div className="w-full ml-20 mr-20 mx-auto overflow-auto  md:overflow-auto ">
      {/*<LineChart chartData={targetStock} />*/}
      <div className="overflow-auto md:overflow-auto">
        <h1 className="underline underline-offset-4 mb-2">
          Stock Screener Attributes
        </h1>
        {inputList.length > 0
          ? inputList.map((input, index) => (
              <div
                key={index}
                className="relative flex mt-4 w-full lg:max-w-sm"
              >
                <select
                  name="filter"
                  onChange={(event) => handleSelectChange(event)}
                  className="w-max-content p-2.5 text-gray-500 bg-white border rounded-md shadow-sm outline-none appearance-none focus:border-indigo-600"
                >
                  {optionList.map((option, index) => (
                    <option key={index}>{option}</option>
                  ))}
                </select>

                <select
                  name="operator"
                  onChange={(event) => handleSelectChange(event)}
                  className="ml-4 w-max-content p-2.5 text-gray-500 bg-white border rounded-md shadow-sm outline-none appearance-none focus:border-indigo-600"
                >
                  {operatorList.map((operator, index) => (
                    <option key={index}>{operator}</option>
                  ))}
                </select>

                <input
                  name="this is input"
                  className="ml-4 border rounded-md p-2.5"
                  id="outlined-basic"
                  label={`test`}
                  variant="outlined"
                  onChange={(event) =>
                    handleInputChange(event, index, dropDown)
                  }
                />
                <button
                  className="ml-4"
                  onClick={() => handleRemoveItem(index)}
                >
                  <span role="img" aria-label="x emoji">
                    ❌
                  </span>
                </button>
              </div>
            ))
          : 'No item in the list '}
        <button
          className="block text-center mt-8 bg-blue-gray-50 w-28 p-2 "
          onClick={handleListAdd}
          disabled={isDisabled}
        >
          Add Filter
        </button>
        <button
          className="block text-center mt-8 bg-blue-gray-50 w-28 p-2"
          onClick={handleSubmit}
          disabled={isDisabled}
        >
          Submit
        </button>

        <div className="m-10">
          <table className="overflow-auto table-fixed border-spacing-2 border border-black">
            <thead>
              <tr>
                {/*
              <div>
                {Object.keys(screenedStock[0]).map((key) => {
                  return <th className="border border-black">test</th>;
                })}
              </div>*/}
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
      <div className="mt-10">
        <h1>Intrinsic Value Calculation</h1>
        <p className="mt-2 font-bold">
          WACC = (E/V x Re) + (D/V x Rd x (1 - Tc)
        </p>
        <p className="mt-2 ml-2 italic">
          E = market value of the firm's equity
        </p>
        <p className="mt-2 ml-2 italic">D = market value of the firm's debt</p>
        <p className="mt-2 ml-2 italic">V = E + D</p>
        <p className="mt-2 ml-2 italic">Re = cost of equity</p>
        <p className="ml-4 text-xs">
          Cost of Equity = Risk-Free Rate of Return + Beta × (Market Rate of
          Return – Risk-Free Rate of Return)
        </p>
        <p className="mt-2 ml-2 italic">Rd = cost of debt</p>
        <p className="ml-4 text-xs">
          Cost of Debt = Interest Expense / Total Debt
        </p>
        <p className="mt-2 ml-2 italic">Tc = corporate tax rate</p>
        <form onSubmit={handleCalculateWACC} className="mt-4 w-full max-w-lg">
          <div className="mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-first-name"
              >
                Ticker
              </label>
              <select
                className="mt-8 appearance-none block w-full bg-gray-200 text-gray-700 borderrounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white  focus:border-red-500 "
                name="ticker"
                onChange={handleChange}
              >
                {options.map((ticker) => (
                  <option key={ticker} value={ticker}>
                    {ticker}
                  </option>
                ))}
              </select>
              {/*}
              <input
                onChange={handleChange}
                name="ticker"
                className="mt-8 appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                id="grid-first-name"
                type="text"
                placeholder="Jane"
              />*/}
            </div>

            <h1>Calculate WACC</h1>
            <input
              onClick={handleAutoPopulate}
              className="ml-4 md:mt-4 md:ml-2 w-maxs text-white bg-green-1 font-bold uppercase text-sm px-3 py-2 rounded hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
              type="button"
              value="Auto Populate"
            />

            <div className="mt-8 w-full md:w-1/2 px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-last-name"
              >
                Interest Expense
              </label>
              <input
                onChange={handleChange}
                name="interestExpense"
                value={autoPopulate.interestExpense || ''}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-last-name"
                type="number"
                placeholder="Get from income statement interest expense "
              />
            </div>
            <div className="mt-8 w-full md:w-1/2 px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-last-name"
              >
                Total Debt
              </label>

              <input
                onChange={handleChange}
                name="totalDebt"
                value={autoPopulate.totalDebt || ''}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-last-name"
                type="number"
                placeholder="Get from Balance Sheet totalLiab"
              />
            </div>
            <div className="mt-8 w-full md:w-1/2 px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-last-name"
              >
                Tax Rate (%)
              </label>

              <input
                onChange={handleChange}
                name="taxRate"
                value={autoPopulate.taxRate || ''}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-last-name"
                type="number"
                placeholder="incomeTaxExpense/incomeBeforeTax"
              />
            </div>
            <div className="mt-8 w-full md:w-1/2 px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-last-name"
              >
                Beta
              </label>

              <input
                onChange={handleChange}
                name="beta"
                value={autoPopulate.beta || ''}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-last-name"
                type="number"
                placeholder="Beta"
              />
            </div>
            <div className="mt-8 w-full md:w-1/2 px-3">
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
                placeholder="based on US 10 years treasury bills"
              />
            </div>
            <div className="mt-8 w-full md:w-1/2 px-3">
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
                placeholder="based on user"
              />
            </div>
            <div className="mt-8 w-full md:w-1/2 px-3">
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
                placeholder="Required User Input"
              />
            </div>
            <div className="mt-8 w-full md:w-1/2 px-3">
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
                placeholder="Required User Input"
              />
            </div>
          </div>
          <div className="mt-8 -mx-3 mb-6">
            <div className="w-full px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-password"
              >
                WACC
              </label>
              <div className="bg-gray-300 w-60 h-10 p-2 px-4">
                {intrinsic.wacc}
              </div>

              <p className="text-gray-600 text-xs italic">
                Calculated WACC value
              </p>
            </div>
          </div>
          <button
            className="ml-4 md:mt-4 md:ml-2 w-40 text-white bg-green-1 font-bold uppercase text-sm px-3 py-2 rounded hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
            type="submit"
          >
            Calculate WACC
          </button>
        </form>

        <form
          onSubmit={handleCalculateIntrinsic}
          className="mt-4 w-full max-w-lg"
        >
          <p className="mt-8 ml-4 font-bold">
            Terminal Value : V0 = FCFE x (1+g) / (r-g)
          </p>
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
              placeholder="based on US 10 years treasury bills"
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
              placeholder="based on US 10 years treasury bills"
            />
          </div>
          <button
            className="ml-4 mb-4 md:mt-4 md:ml-2 w-40 text-white bg-green-1 font-bold uppercase text-sm px-3 py-2 rounded hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
            type="submit"
          >
            Calculate Intrinsic Value
          </button>
        </form>
        <div className="mt-8 -mx-3 mb-6">
          <div className="w-full px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-password"
            >
              Intrinsic Value
            </label>
            <div className="bg-gray-300 w-60 h-10 p-2 px-4">
              {intrinsic.intrinsicValue}
            </div>

            <p className="text-gray-600 text-xs italic">
              Calculated WACC value
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockAnalysis;
