import React, { useState, useEffect } from 'react';
import moment from 'moment';
//import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
//import 'react-tabs/style/react-tabs.css';
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from '@material-tailwind/react';

// pass all the financial data into this component
const StockInfoTab = ({
  incomeStatements,
  balanceSheets,
  cashflowStatements,
}) => {
  return (
    <div className="mt-10">
      <Tabs value="react">
        <TabsHeader indicatorProps={{ className: 'bg-yellow-300' }}>
          <Tab className="bg-red-300" key={1} value={1}>
            Income Statement
          </Tab>
          <Tab className="bg-green-100" key={2} value={2}>
            Balance Sheettab
          </Tab>
          <Tab className="bg-blue-100" key={3} value={3}>
            Cash Flow Statement
          </Tab>
        </TabsHeader>
        <TabsBody>
          <TabPanel key={1} value={1}>
            <div>
              <div>
                <h2>Income Statement</h2>
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
          </TabPanel>
          <TabPanel key={2} value={2}>
            Balance Sheet
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
                                    {balanceSheet[balanceSheetElement] || 'NA'}
                                  </th>
                                )}
                                {!header && (
                                  <td className="border border-green-600">
                                    {balanceSheet[balanceSheetElement] || 'NA'}
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
          </TabPanel>
          <TabPanel key={3} value={3}>
            Cash Flow Statement
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
                            .filter((key) => key != 'ticker' && key != '_id')
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
                                    {cashflowStatement[cashflowElement] || 'NA'}
                                  </th>
                                )}
                                {!header && (
                                  <td className="border border-green-600">
                                    {cashflowStatement[cashflowElement] || 'NA'}
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
          </TabPanel>
        </TabsBody>
      </Tabs>
    </div>
  );
};

export default StockInfoTab;
