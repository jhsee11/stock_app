import React, { useState, useEffect } from 'react';

import FinanceTable from './FinanceTable';

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
    <div className="-mt-10 md:mt-24">
      <Tabs value="react" className="overflow-auto z-0">
        <TabsHeader indicatorProps={{ className: 'bg-green-2' }}>
          <Tab
            className="bg-yellow-1 text-white font-bold border text-clip whitespace-nowrap"
            key={1}
            value={1}
          >
            Income Statement
          </Tab>
          <Tab
            className="bg-yellow-1 text-white font-bold border text-clip  whitespace-nowrap"
            key={2}
            value={2}
          >
            Balance Sheet
          </Tab>
          <Tab
            className="bg-yellow-1 text-white font-bold border text-clip whitespace-nowrap"
            key={3}
            value={3}
          >
            Cash Flow Statement
          </Tab>
        </TabsHeader>
        <TabsBody>
          <TabPanel key={1} value={1}>
            <FinanceTable FinanceData={incomeStatements} />
          </TabPanel>
          <TabPanel key={2} value={2}>
            <FinanceTable FinanceData={balanceSheets} />
          </TabPanel>
          <TabPanel key={3} value={3}>
            <FinanceTable FinanceData={cashflowStatements} />
          </TabPanel>
        </TabsBody>
      </Tabs>
    </div>
  );
};

export default StockInfoTab;
