import React from 'react';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

function LineChart({ chartData }) {
  return (
    <Line
      data={chartData}
      height={300}
      width={800}
      options={{
        scales: {
          yAxis: {
            min: 0,
          },
        },
      }}
    />
  );
}

export default LineChart;
