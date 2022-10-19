import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import { ThemeProvider } from '@material-tailwind/react';
import { ContextProvider } from './contexts/ContextProvider';

const theme = {
  tabsHeader: {
    styles: {
      base: {
        display: 'flex',
        position: 'relative',
        color: 'bg-gray-800',
      },
    },
  },
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider value={theme}>
      <ContextProvider>
        <App />
      </ContextProvider>
    </ThemeProvider>
  </React.StrictMode>
);
