import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartSimple, faCoins } from '@fortawesome/free-solid-svg-icons';

export const links = [
  {
    title: 'Features',
    links: [
      {
        name: 'StockPrice',
        icon: <FontAwesomeIcon icon={faCoins} />,
      },
      {
        name: 'StockAnalysis',
        icon: <FontAwesomeIcon icon={faChartSimple} />,
      },
    ],
  },
];
