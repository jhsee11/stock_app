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
    <div className="text-slate-500 w-full">
      <BrowserRouter>
        <div className="flex relative bg-green-2">
          <div className="fixed right-4 bottom-4" style={{ zIndex: '1000' }}>
            <FiSettings />
          </div>

          {activeMenu ? (
            <div className="w-72 fixed sidebar bg-green-2 h-full ">
              <Sidebar />
            </div>
          ) : (
            <div className="w-0 bg-green-1">
              <Sidebar />
            </div>
          )}
          <div
            className={
              activeMenu
                ? 'bg-yellow-2 w-full h-screen md:ml-72 '
                : 'bg-yellow-2  w-full h-full flex-2 '
            }
          >
            <div className="fixed bg-green-1 navbar w-full z-100">
              <Navbar />
            </div>
            <div className="flex mt-28 justify-center items-center bg-yellow-2">
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
