import React, { useState } from 'react';
import BarChart from '../components/BarChart';
import LineChart from '../components/LineChart';
import PieChart from '../components/PieChart';
import { UserData } from '../data/chartData';

const StockPrice = () => {
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
      <div style={{ width: 700 }}>
        <BarChart chartData={userData} />
        <LineChart chartData={userData} />
        <PieChart chartData={userData} />
      </div>
    </div>
  );
};

export default StockPrice;
