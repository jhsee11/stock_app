import React from 'react';
import moment from 'moment';

const FinanceTable = ({ FinanceData }) => {
  return (
    <div className="flex overflow-auto">
      {FinanceData.map((dataSheet, index) => {
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
                  {Object.keys(dataSheet)
                    .filter((key) => key != 'ticker' && key != '_id')
                    .map((dataSheetElement, index_1) => {
                      let header = false;

                      if (index_1 === 0) {
                        header = true;
                      }

                      return <>{header && <th className="w-40"></th>}</>;
                    })}
                </tr>
              </thead>

              <tbody>
                {Object.keys(dataSheet)
                  .filter((key) => key != 'ticker' && key != '_id')
                  .map((dataSheetElement, index_1) => {
                    let header = false;

                    if (index_1 === 0) {
                      header = true;
                      console.log(`come come index is ${dataSheetElement}`);
                      dataSheet[dataSheetElement] = moment(
                        new Date(dataSheet[dataSheetElement])
                      ).format('DD MMM YYYY'); // June 1, 2019

                      console.log(
                        `change date to is ${dataSheet[dataSheetElement]}`
                      );
                    }

                    return (
                      <tr key={index_1}>
                        {display && (
                          <>
                            {header && (
                              <th className="border border-green-600 p-2 whitespace-nowrap font-semibold text-center">
                                {dataSheetElement}
                              </th>
                            )}
                            {!header && (
                              <td className="border border-green-600 whitespace-nowrap font-semibold text-center">
                                {dataSheetElement}
                              </td>
                            )}
                          </>
                        )}
                        {header && (
                          <th className="border border-green-600 p-2 whitespace-nowrap">
                            {dataSheet[dataSheetElement] || 'NA'}
                          </th>
                        )}
                        {!header && (
                          <td className="border border-green-600 whitespace-nowrap">
                            {dataSheet[dataSheetElement] || 'NA'}
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
  );
};

export default FinanceTable;
