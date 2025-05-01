import React, { useState, useEffect, useContext} from 'react';
import axios from 'axios';
import { Box, Grid, Stack } from '@mui/material';
import OpenOrder from '../components/OpenOrder'; 
import CloseOrder from '../components/CloseOrder'
import {AppContext} from '../components/AppProvider';
import { Connected} from '../components/Alert';
import TradingViewWidget from "../components/TradingViewWidget";
import { AppContract } from '../components/AppContract';
import tokensCsv from '../assets/tokens.csv';
import Papa from 'papaparse';

const TradePage = () => {
  const [sector, setSector] = useState('');
  const [symbol, setSymbol] = useState('');
  const [balance, setBalance] = useState(0); 
  const [amount, setAmount] = useState(0); 
  const [size, setSize] = useState(0); 
  const [leverage, setLeverage] = useState(1);
  const [symbolList, setSymbolList] = useState([]);
  const [symbolLeverages, setSymbolLeverages] = useState({});
  const [position, setPosition] = useState([]);
  const [transaction, setTransaction] = useState([]);  
  const [price, setPrice] = useState(0); 
  const [tradingSymbol, setTradingSymbol] = useState('BTCUSDT');
  const [fee, setFee] = useState(0);

  const host = "https://trivex-trade-faekh0awhkdphxhq.canadacentral-01.azurewebsites.net";
  const info = useContext(AppContext);

  const contract =  new AppContract();

  const handleSymbols = async (selectedSector) => {
    try {
      Papa.parse(tokensCsv, {
        download: true,
        header: false,
        complete: (results) => {
          var cryptoList = {};
          results.data.slice(1).forEach(parts => {
            if (parts.length > 2) {
              const key = parts[1].split("-")[0];
              const value = parseInt(parts[2].replace("x", ""), 10);
              cryptoList[key] = value;
            }
          });
  
          setSymbolLeverages(cryptoList);
          setSymbolList(Object.keys(cryptoList));
  
          if (Object.keys(cryptoList).length > 0) {
            setSymbol(Object.keys(cryptoList)[0]);
          }
        },
        error: (error) => {
          console.error('Error fetching symbols:', error);
          setSymbolList([]);
          setSymbolLeverages({});
        }
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      setSymbolList([]);
      setSymbolLeverages({});
    }
  };
  
  const handleBalance = async () => {
    try {
        const result = await contract.getWalletBalance(info.walletAddress);
        setBalance(result);
    } catch (error) {
        console.error("Error fetching wallet balance:", error);
        setBalance(0);
    }
  };
  
  const handlePositions = async (address) => {
    try {
      console.log("Fetching portfolio...");
      const results = await contract.getPositions(address);
      setPosition(results);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    }
  };

  const handleTransactions = async (address) => {
      try {
        console.log("Fetching transaction history...");
        const results = await contract.getTransactions(address);
        setTransaction(results);
      } catch (error) {
          console.error('Error fetching transactions:', error);
      }
  };

  const fetchFee = async (address, symbol, size) => {
    try {
      console.log(`Fetching fee for ${address} for order ${symbol} with size ${size}`);
      const estimate_fee = await contract.getFee(amount);
      setFee(estimate_fee);
      if (isNaN(estimate_fee)) {
        alert("Failed to fetch the estimate fee. Please try again.");
      }
    } catch (error) {
      console.error('Error fetching price:', error);
    }
  };
  
  const updateUserInfo = async (address) => {
    try {
      await handlePositions(address);
      await handleTransactions(address);
      await handleBalance(info.walletAddress);
      // await contract.get_internal_order_book();
      // await contract.getUsers();
    } catch (error) {
      console.error("Error updating user info:", error);
    }
  };

  const handlePrice = async (symbol) => {
    try {
      console.log(`Fetching ${symbol}`);
      const response = await axios.get(`${host}/price/${symbol}`);
      const current_price = parseFloat(response.data.price);
      setPrice(current_price);
      if (isNaN(current_price)) {
        alert("Failed to fetch the current price. Please try again.");
      }
    } catch (error) {
      console.error('Error fetching price:', error);
    }
  };

  const amountChange = async (value) => {
    setAmount(value);
    setSize(value/price);
    fetchFee(info.walletAddress, symbol+"-"+sector, size);
  };

  const symbolChange = (e) => {
    setSymbol(e);
    setTradingSymbol(e+"USDT");
    handlePrice(e+"-"+sector);
  };

  const handleSectorChange = (e) => {
    const selectedSector = e.target.value;
    setSector(selectedSector);
    handleSymbols(selectedSector); 
    updateUserInfo(info.walletAddress)
  };

  const refreshData = async () => {
    handlePrice(symbol+"-"+sector);
    fetchFee(info.walletAddress, symbol+"-"+sector, size);
    updateUserInfo(info.walletAddress);
    info.setRouteTrigger(true);
  };

  const handleOpenOrder = async (action) => {
    if (!sector || !symbol) {
      alert('Please fill in all fields before proceeding.');
      return;
    }
  
    try {
      const totalValue = size * price;
      const orderAction = "Open " + action;
  
      const result = await contract.open_order(
        info.wallet.account,
        symbol,
        size,
        price,
        leverage,
        totalValue,
        orderAction,
        amount
      );
  
      console.log("Contract Open Order Result:", result);
      await updateUserInfo(info.walletAddress);
    } catch (error) {
      console.error("Error during trade:", error);
      if (error.message.includes("User abort")) {
        alert("Transaction aborted by user.");
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };
  
  const handleCloseOrder = async (position) => {
    try {
      console.log(position);
      alert(`Closing position for ${position.symbol}`);
  
      let response = await axios.get(`${host}/price/${position.symbol + "-Crypto"}`);
      const current_price = parseFloat(response.data.price);
      const amount = position.quantity * current_price;
      const action = "Close " + position.action.split(" ")[1];
  
      const result = await contract.close_order(
        info.wallet.account,
        position.id,
        amount,
        action
      );
  
      console.log("Contract Close Order Result:", result);

      await updateUserInfo(info.walletAddress);
    } catch (error) {
      console.error("Error closing position:", error);
      if (error.message.includes("User abort")) {
        alert("Transaction aborted by user.");
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };

  useEffect(() => {
      if (info.walletAddress && !info.routeTrigger) {
          refreshData();
      }
  }, [info, refreshData]);

  if(info.walletAddress != null){
      return (
        <Box sx={{ fontFamily: "Arial, sans-serif", backgroundColor: "#D1C4E9", padding: "10px"}}>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Stack spacing={2} sx={{ height: "100%" }}>
                <TradingViewWidget symbol={tradingSymbol} />
                <CloseOrder positions={position} transactions={transaction} handleCloseOrder={handleCloseOrder} refreshData={refreshData}/>
              </Stack>
            </Grid>
            <Grid item xs={4}>
              <OpenOrder
                sector={sector}
                handleSectorChange={handleSectorChange}
                symbol={symbol}
                handleSymbol={symbolChange}
                symbolList={symbolList}
                symbolLeverages={symbolLeverages}
                leverage={leverage}
                setLeverage={setLeverage}
                amount={amount}
                setAmount={amountChange}
                available={balance}
                handleTrade={handleOpenOrder}
                price={price}
                refreshData={refreshData}
                fee={fee}
                size={size}
              />
            </Grid>
          </Grid>
        </Box>
      );
  }else{
      return <Connected/>
  }
};

export default TradePage;
