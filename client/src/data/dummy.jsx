import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartSimple,
  faCoins,
  faAnchor,
} from '@fortawesome/free-solid-svg-icons';
import { BiColorFill } from 'react-icons/bi';
import { IoMdContacts } from 'react-icons/io';
import { RiContactsLine, RiStockLine } from 'react-icons/ri';
import { MdOutlineSupervisorAccount } from 'react-icons/md';
import { HiOutlineRefresh } from 'react-icons/hi';
import { TiTick } from 'react-icons/ti';
import { GiLouvrePyramid } from 'react-icons/gi';
import { GrLocation } from 'react-icons/gr';

export const links = [
  {
    title: 'Pages',
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
