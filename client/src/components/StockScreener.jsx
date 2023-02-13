import React, { useState, useEffect } from 'react';

const StockScreener = ({}) => {
  const [inputList, setInputList] = useState([
    {
      input: '',
      input2: '',
      input_rank: null,
      displayVal2: false,
    },
  ]);

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

  const symbolMapping = {
    'Greater Than': '$gt',
    'Less Than': '$lt',
    Equal: '$eq',
    Between: ['$gt', '$lt'],
  };

  const handleListAdd = () => {
    console.log(inputList);
    setInputList([
      ...inputList,
      {
        input: '',
        input_rank: null,
      },
    ]);
  };

  // update the attribute to be used for filter
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
      console.log(`value is ${value}`);
      if (newFilterList[index]['operator']) {
        newFilterList[index]['operator'] = value;
      }

      delete newFilterList[index]['value2'];
      setFilterList(newFilterList);
      console.log(JSON.stringify(filterList));
    }
  };

  const handleInputChange = (event, index, dropDown) => {
    const { value, name } = event.target;
    console.log(`name is ${name}, value is ${value}`);
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
    newObj['operator'] = dropDown['operator'];

    // push the filter to filter list
    let newFilterList = [...filterList];
    newFilterList[index] = newObj;
    setFilterList(newFilterList);
    console.log(JSON.stringify(filterList));
  };

  const handleRemoveItem = (index) => {
    if (index != 0) {
      const newList = [...inputList];
      newList.splice(index, 1);
      setInputList(newList);

      filterList.splice(index, 1);
    }
  };

  const [isDisabled, setIsDisabled] = useState(false);
  const [screenedStock, setScreenedStock] = useState([]);

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

  useEffect(() => {
    if (inputList.length > 0) {
      inputList[inputList.length - 1].input === ''
        ? setIsDisabled(true)
        : setIsDisabled(false);
    }
  });

  return (
    <div className="overflow-auto md:overflow-auto">
      <h1 className="font-bold text-lg underline underline-offset-4">
        Stock Screener Attributes
      </h1>
      {inputList.length > 0
        ? inputList.map((input, index) => (
            <div key={index} className="relative flex mt-6 w-full lg:max-w-sm">
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
                onChange={(event) => handleInputChange(event, index, dropDown)}
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
              <button className="ml-4" onClick={() => handleRemoveItem(index)}>
                <span role="img" aria-label="x emoji">
                  ❌
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
  );
};

export default StockScreener;
