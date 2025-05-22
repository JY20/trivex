import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TradePage from "./pages/TradePage";
import StrategyPage from "./pages/StrategyPage";
import StakePage from "./pages/StakePage";
import SettingPage from "./pages/SettingPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AppProvider } from './components/AppProvider';
import './App.css';

const App = () => (
    <AppProvider>
        <BrowserRouter>
            {/* Web3 animated background elements */}
            <div className="web3-glow"></div>
            <div className="web3-glow"></div>
            <div className="web3-glow" style={{ 
                top: '60%', 
                left: '75%', 
                width: '250px', 
                height: '250px', 
                background: 'radial-gradient(circle, rgba(177, 158, 227, 0.07) 0%, transparent 70%)',
                animationDuration: '12s'
            }}></div>
            
            <Navbar />
            <Routes>
                <Route path="/" element={<TradePage />} />
                <Route path="/trade" element={<TradePage />} />
                <Route path="/strategy" element={<StrategyPage />} />
                <Route path="/stake" element={<StakePage />} />
                <Route path="/setting" element={<SettingPage />} />
            </Routes>
            <Footer />
        </BrowserRouter>
    </AppProvider>
);

export default App;
