import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import TradePage from "./pages/TradePage";
import AlgoPage from "./pages/AlgoPage";
import StakePage from "./pages/StakePage";
import SettingPage from "./pages/SettingPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AppProvider } from './components/AppProvider';

const App = () => (
    <AppProvider>
        <BrowserRouter>
            <Navbar />
            <Routes>
            <Route path="/" element={<TradePage />} />
            <Route path="/trade" element={<TradePage />} />
            <Route path="/algo" element={<AlgoPage />} />
            <Route path="/stake" element={<StakePage />} />
            <Route path="/setting" element={<SettingPage />} />
            </Routes>
            <Footer />
        </BrowserRouter>
    </AppProvider>
);

export default App;
