import React from 'react';
import { FiSettings } from 'react-icons/fi';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Sidebar from './components/Sidebar';
import { useState } from 'react';
import StockPrice from './pages/StockPrice';
import StockAnalysis from './pages/StockAnalysis';

import { useStateContext } from './contexts/ContextProvider';

const App = () => {
  const { activeMenu } = useStateContext();

  return (
    <div className="text-red-300 w-full">
      <BrowserRouter>
        <div className="flex relative bg-blue-100">
          <div className="fixed right-4 bottom-4" style={{ zIndex: '1000' }}>
            <FiSettings />
          </div>

          {activeMenu ? (
            <div className="w-72 fixed sidebar bg-red-100 ">
              <Sidebar />
            </div>
          ) : (
            <div className="w-0">
              <p>gogo</p>
              <Sidebar />
            </div>
          )}
          <div
            className={
              activeMenu
                ? 'bg-yellow-100 min-h-screen md:ml-72 w-full  '
                : 'bg-green-bg  w-full min-h-screen flex-2 '
            }
          >
            <div className="fixed md:static bg-blue-100 navbar w-full ">
              <Navbar />
            </div>
            <div className="flex justify-center items-center">
              <Routes>
                {/*Dashboard */}
                <Route path="/" element={<StockPrice />} />
                <Route path="/StockPrice" element={<StockPrice />} />
                <Route path="/StockAnalysis" element={<StockAnalysis />} />
              </Routes>
            </div>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
