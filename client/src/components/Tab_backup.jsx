import React, { useState, useEffect } from 'react';
import moment from 'moment';

// pass all the financial data into this component
const Tab_backup = ({
  incomeStatements,
  balanceSheets,
  cashflowStatements,
}) => {
  const [openTab, setOpenTab] = useState(1);

  return (
    <div>
      <div className="container mx-auto mt-12">
        <div className="flex flex-col items-center justify-center max-w-xl">
          <ul className="flex space-x-2">
            <li>
              <a
                href="#"
                onClick={() => setOpenTab(1)}
                className={` ${
                  openTab === 1 ? 'bg-purple-600 text-white' : ''
                } inline-block px-4 py-2 text-gray-600 bg-white rounded shadow`}
              >
                React Tabs 1
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={() => setOpenTab(2)}
                className={` ${
                  openTab === 2 ? 'bg-purple-600 text-white' : ''
                } inline-block px-4 py-2 text-gray-600 bg-white rounded shadow`}
              >
                React Tabs 2
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={() => setOpenTab(3)}
                className={` ${
                  openTab === 3 ? 'bg-purple-600 text-white' : ''
                } inline-block px-4 py-2 text-gray-600 bg-white rounded shadow`}
              >
                React Tabs 3
              </a>
            </li>
          </ul>
          <div className="p-3 mt-6 bg-green-100 border">
            <div className={openTab === 1 ? 'block' : 'hidden'}>
              React JS with Tailwind CSS Tab 1 Content show
              <div>
                <h1 className="text-blue-800 text-xl mb-2">Income Statement</h1>
                <div className="flex">
                  {incomeStatements.map((income, index) => {
                    console.log(`hahah index is ${index}`);
                    let display = false;

                    if (index == 0) {
                      console.log('setting display');
                      display = true;
                    }
                    return (
                      <div className="">
                        <table className="table-fixed border-separate border-green-900">
                          <thead>
                            <tr>
                              {display && <th className="w-80"></th>}
                              {Object.keys(income)
                                .filter(
                                  (key) => key != 'ticker' && key != '_id'
                                )
                                .map((incomeElement, index_1) => {
                                  let header = false;

                                  if (index_1 === 0) {
                                    header = true;
                                  }

                                  return (
                                    <>{header && <th className="w-40"></th>}</>
                                  );
                                })}
                            </tr>
                          </thead>

                          <tbody>
                            {Object.keys(income)
                              .filter((key) => key != 'ticker' && key != '_id')
                              .map((incomeElement, index_1) => {
                                let header = false;

                                if (index_1 === 0) {
                                  header = true;
                                  console.log(
                                    `come come index is ${incomeElement}`
                                  );
                                  income[incomeElement] = moment(
                                    new Date(income[incomeElement])
                                  ).format('DD MMM YYYY'); // June 1, 2019

                                  console.log(
                                    `change date to is ${income[incomeElement]}`
                                  );
                                }

                                return (
                                  <tr key={index_1}>
                                    {display && (
                                      <>
                                        {header && (
                                          <th className="border border-green-600 p-2">
                                            {incomeElement}
                                          </th>
                                        )}
                                        {!header && (
                                          <td className="border border-green-600">
                                            {incomeElement}
                                          </td>
                                        )}
                                      </>
                                    )}

                                    {header && (
                                      <th className="border border-green-600 p-2">
                                        {income[incomeElement] || 'NA'}
                                      </th>
                                    )}
                                    {!header && (
                                      <td className="border border-green-600">
                                        {income[incomeElement] || 'NA'}
                                      </td>
                                    )}
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                    );
                  })}
                </div>

                <br />
              </div>
            </div>

            <div className={openTab === 2 ? 'block' : 'hidden'}>
              React JS with Tailwind CSS Tab 2 Content show
              <h1 className="text-blue-800 text-xl mb-2">Balance Sheets</h1>
              <div className="flex">
                {balanceSheets.map((balanceSheet, index) => {
                  console.log(`hahah index is ${index}`);
                  let display = false;
                  if (index == 0) {
                    console.log('setting display');
                    display = true;
                  }
                  return (
                    <div>
                      <table className="table-fixed border-separate  border-green-900">
                        <thead>
                          <tr>
                            {display && <th className="w-80"></th>}
                            {Object.keys(balanceSheet)
                              .filter((key) => key != 'ticker' && key != '_id')
                              .map((balanceSheetElement, index_1) => {
                                let header = false;

                                if (index_1 === 0) {
                                  header = true;
                                }

                                return (
                                  <>{header && <th className="w-40"></th>}</>
                                );
                              })}
                          </tr>
                        </thead>

                        <tbody>
                          {Object.keys(balanceSheet)
                            .filter((key) => key != 'ticker' && key != '_id')
                            .map((balanceSheetElement, index_1) => {
                              let header = false;

                              if (index_1 === 0) {
                                header = true;
                                console.log(
                                  `come come index is ${balanceSheetElement}`
                                );
                                balanceSheet[balanceSheetElement] = moment(
                                  new Date(balanceSheet[balanceSheetElement])
                                ).format('DD MMM YYYY'); // June 1, 2019

                                console.log(
                                  `change date to is ${balanceSheet[balanceSheetElement]}`
                                );
                              }

                              return (
                                <tr key={index_1}>
                                  {display && (
                                    <>
                                      {header && (
                                        <th className="border border-green-600 p-2">
                                          {balanceSheetElement}
                                        </th>
                                      )}
                                      {!header && (
                                        <td className="border border-green-600">
                                          {balanceSheetElement}
                                        </td>
                                      )}
                                    </>
                                  )}
                                  {header && (
                                    <th className="border border-green-600 p-2">
                                      {balanceSheet[balanceSheetElement] ||
                                        'NA'}
                                    </th>
                                  )}
                                  {!header && (
                                    <td className="border border-green-600">
                                      {balanceSheet[balanceSheetElement] ||
                                        'NA'}
                                    </td>
                                  )}
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                      <br />
                    </div>
                  );
                })}
              </div>
            </div>
            <div className={openTab === 3 ? 'block' : 'hidden'}>
              React JS with Tailwind CSS Tab 3 Content show
              <div className="">
                <h1 className="text-blue-800 text-xl mb-2">
                  Cash Flow Statement
                </h1>
                <div className="flex">
                  {cashflowStatements.map((cashflowStatement, index) => {
                    console.log(`hahah index is ${index}`);
                    let display = false;
                    if (index == 0) {
                      console.log('setting display');
                      display = true;
                    }
                    return (
                      <div>
                        <table className="table-fixed border-separate  border-green-900">
                          <thead>
                            <tr>
                              {display && <th className="w-80"></th>}
                              {Object.keys(cashflowStatement)
                                .filter(
                                  (key) => key != 'ticker' && key != '_id'
                                )
                                .map((cashflowElement, index_1) => {
                                  let header = false;

                                  if (index_1 === 0) {
                                    header = true;
                                  }

                                  return (
                                    <>{header && <th className="w-40"></th>}</>
                                  );
                                })}
                            </tr>
                          </thead>

                          <tbody>
                            {Object.keys(cashflowStatement)
                              .filter((key) => key != 'ticker' && key != '_id')
                              .map((cashflowElement, index_1) => {
                                let header = false;

                                if (index_1 === 0) {
                                  header = true;
                                  console.log(
                                    `come come index is ${cashflowElement}`
                                  );
                                  cashflowStatement[cashflowElement] = moment(
                                    new Date(cashflowStatement[cashflowElement])
                                  ).format('DD MMM YYYY'); // June 1, 2019

                                  console.log(
                                    `change date to is ${cashflowStatement[cashflowElement]}`
                                  );
                                }

                                return (
                                  <tr key={index_1}>
                                    {display && (
                                      <>
                                        {header && (
                                          <th className="border border-green-600 p-2">
                                            {cashflowElement}
                                          </th>
                                        )}
                                        {!header && (
                                          <td className="border border-green-600">
                                            {cashflowElement}
                                          </td>
                                        )}
                                      </>
                                    )}
                                    {header && (
                                      <th className="border border-green-600 p-2">
                                        {cashflowStatement[cashflowElement] ||
                                          'NA'}
                                      </th>
                                    )}
                                    {!header && (
                                      <td className="border border-green-600">
                                        {cashflowStatement[cashflowElement] ||
                                          'NA'}
                                      </td>
                                    )}
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>

                        <br />
                      </div>
                    );
                  })}
                </div>

                <br />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tab_backup;
