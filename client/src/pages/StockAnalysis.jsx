import React, { useState, useEffect } from 'react';
import LineChart from '../components/LineChart';
import axios from 'axios';
import { Input, Select, Option } from '@material-tailwind/react';

const StockAnalysis = () => {
  // Trailing P/E - 22.97
  // Forward P/E - 21.93
  // PEG Ratio (5 yr expected) - 2.49
  // Price/Sales (ttm) - 5.90
  // Price/Book (mrq) - 38.44
  // Market Cap

  // Enterprise Value/Revenue
  // Enterprise Value/EBITDA
  // PE Ratio (TTM)

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

  const handleFilterChange = (e) => {
    let newObj = { ...filter };
    console.log(e.target.name);
    newObj[e.target.name] = e.target.value;
    console.log(newObj);
    setFilter(newObj);
  };

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

    console.log(newObj);
    setFilter(newObj);
    console.log(filter);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    let analysisList = [];

    const attributeMapping = {};

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

        {
          /*
          newObj['Attribute'] = filterList[i]['attribute'];
          newObj['Recent'] = {
           [symbol]: filterList[i]['value'],
          };
        */
        }
      }
      // add into analysis list
      analysisList.push(newObj);
      console.log(JSON.stringify(analysisList));
    }

    axios
      .post(`http://localhost:5001/api/stock_analysis/ticker`, analysisList)
      .then((res) => {
        console.log(res);
        console.log(res.data);
        setScreenedStock(res.data);

        // need to return the screen stock data
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

    // [ {'Trailing P/E' : { $gt: 89} },  { 'PEG Ratio' : { $lt: 89} } ]
    // [ {'Atttribute' : 'Trailing P/E' },  { 'Recent' : { $gt: 10} } ]

    // [ { 'Trailing P/E' : { $gt: 10} } ]
    //filterList
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

    {
      /*}
    axios
      .post(`http://localhost:5001/api/stock_analysis/ticker`, filterList)
      .then((res) => {
        console.log(res);
        console.log(res.data);
      });
    */
    }
  };

  return (
    <div>
      StockAnalysis
      <LineChart chartData={targetStock} />
      <div className="">
        <h1>Stock Screener Attributes</h1>
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
          className="block mt-8 bg-blue-gray-50 w-max p-2.5"
          onClick={handleListAdd}
          disabled={isDisabled}
        >
          Add choice
        </button>
        <button
          className="block mt-8 bg-blue-gray-50 w-max p-2.5"
          onClick={handleSubmit}
          disabled={isDisabled}
        >
          Submit
        </button>
        <h1>Table</h1>
        <table className="table-fixed border-spacing-2 border border-black">
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
                  'ticker',
                ];

                return (
                  index == 1 && (
                    <>
                      {Object.keys(stock).map((key) => {
                        return (
                          displayHeader.indexOf(key) != -1 && (
                            <>
                              <th
                                key={key}
                                className="w-80 border border-black"
                              >
                                {key}
                              </th>
                            </>
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
            <tr>
              <td>The Sliding Mr. Bones (Next Stop, Pottersville)</td>
              <td>Malcolm Lockyer</td>
              <td>1961</td>
            </tr>
            <tr>
              <td>Witchy Woman</td>
              <td>The Eagles</td>
              <td>1972</td>
            </tr>
            <tr>
              <td>Shining Star</td>
              <td>Earth, Wind, and Fire</td>
              <td>1975</td>
            </tr>
          </tbody>
        </table>
        {/*
        Volume: 113223975
        Avg. Volume: 80838064
        Market Cap: 2.298T
        PE Ratio (TTM): 23.63
        Quote Price: 142.99000549316406
        52 Week Range: 129.04 - 182.94

          */}
        {/*
        {inputList.length > 0
          ? inputList.map((input, index) => (
              <div key={index}>
                <button>{index + 1}</button>
                <input
                  id="outlined-basic"
                  label={`input ${index + 1}`}
                  variant="outlined"
                  onChange={(event) => handleInputChange(event, index)}
                />
                <button onClick={() => handleRemoveItem(index)}>
                  <span role="img" aria-label="x emoji">
                    ❌
                  </span>
                </button>
              </div>
            ))
          : 'No item in the list '}
    */}
      </div>
    </div>
  );
};

export default StockAnalysis;
