import React, { useState, useEffect, useContext} from 'react';
import axios from 'axios';
import { Box, Grid, Stack } from '@mui/material';
import OpenOrder from '../components/OpenOrder'; 
import CloseOrder from '../components/CloseOrder'
import {AppContext} from '../components/AppProvider';
import { Connected} from '../components/Alert';
import TradingViewWidget from "../components/TradingViewWidget";
import { AppContract } from '../components/AppContract';

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
  const [positionDB, setPositionDB] = useState([]);
  const [transaction, setTransaction] = useState([]);  
  const [price, setPrice] = useState(0); 
  const [tradingSymbol, setTradingSymbol] = useState('BTCUSDC');
  const [fee, setFee] = useState(0);

  const host = "https://trivex-trade-faekh0awhkdphxhq.canadacentral-01.azurewebsites.net";
  const info = useContext(AppContext);

  const contract =  new AppContract();

  const handleSymbols = async (selectedSector) => {
    try {
      console.log(`Fetching symbols for sector: ${selectedSector}...`);
      const response = await axios.get(`${host}/symbols/${selectedSector}`);

      const symbols = Object.keys(response.data); 
      const symbolLeverages = response.data; 

      setSymbolList(symbols);
      setSymbolLeverages(symbolLeverages);

      if (symbols.length > 0) {
        setSymbol(symbols[0]); 
      }
    } catch (error) {
      console.error('Error fetching symbols:', error);
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
      console.log(results);
      setPosition(results);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    }
  };

  const handleTransactions = async (address) => {
      try {
        console.log("Fetching transaction history...");
        const results = await contract.getTransactions(address);
        console.log(results);
    
        setTransaction(results);
      } catch (error) {
          console.error('Error fetching transactions:', error);
      }
  };

  const fetchFee = async (address, symbol, size) => {
    try {
      console.log(`Fetching fee for ${address} for order ${symbol} with size ${size}`);
      const response = await axios.get(`${host}/fee/${address}/${symbol}/${size}`);
      console.log(response.data.fee);
      const estimate_fee = parseFloat(response.data.fee);
      setFee(estimate_fee);
      if (isNaN(estimate_fee)) {
        alert("Failed to fetch the estimate fee. Please try again.");
      }
    } catch (error) {
      console.error('Error fetching price:', error);
    }
  };
  
  const updateUserInfo = (address) => {
    try {
      handlePositions(address);
      handleTransactions(address);
      fetchFee(address, symbol, size);
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
    setTradingSymbol(e+"USDC");
    handlePrice(e+"-"+sector);
  };


  const handleSectorChange = (e) => {
    const selectedSector = e.target.value;
    setSector(selectedSector);
    handleSymbols(selectedSector); 
    updateUserInfo(info.walletAddress)
  };


  const handleDeposit = async (symbol, quantity, averagePrice, leverage, totalValue, action, amount) => {
    try {
      action = "Open "+action;
      const result = await contract.open_order(info.wallet.account, symbol, quantity, averagePrice, leverage, totalValue, action, amount);
  
      console.log("Deposit Result:", result);
      alert("Order open completed successfully!");
    } catch (error) {
      console.error("An error occurred during the deposit process:", error);
      if (error.message.includes("User abort")) {
        alert("Transaction aborted by user.");
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
      throw error;
    }
  };
  
  const handleWithdrawal = async (position, amount) => {
      try {
          const action = "Close "+ position.action.split(" ")[1];
          const result = await contract.close_order(info.wallet.account, position.id, amount, action);
      
          console.log("Withdrawal Result:", result);

          alert("Close order completed successfully!");
      } catch (error) {
          console.error("An error occurred during the withdrawal process:", error);
      
          if (error.message.includes("User abort")) {
              alert("Transaction aborted by user.");
          } else {
              alert("An unexpected error occurred. Please try again.");
          }
      }
  };

  const handleOpenOrder = async (action) => {
    if (!sector || !symbol) {
      alert('Please fill in all fields before proceeding.');
      return;
    }
  
    try {
      let is_buy = action === "Buy";

      await handleDeposit(symbol, size, price, leverage, size*price, action);
  
      const data = {
        wallet: info.walletAddress,
        is_buy,
        symbol,
        amount,
        sector,
        leverage
      };

      console.log(data);
    
      const res = await axios.post(`${host}/open`, data);
    
      const result = res.data.status;
    
      if (result === "Success") {
        alert(`${action} order placed successfully at $${price.toFixed(2)}!`);
      } else {
        alert("An error occurred while placing the order.");
      }
  
      updateUserInfo(info.walletAddress);
      return res.data;
    } catch (e) {
      console.error("Error during trade:", e);
      alert("An error occurred while processing the trade.");
    }
  };

  const handleCloseOrder = async (position) => {
    try {
      console.log(position);
      alert(`Closing position for ${position.symbol}`);
  
      const response = await axios.get(`${host}/price/${position.symbol+"-Crypto"}`);
      const current_price = parseFloat(response.data.price);
      
      await handleWithdrawal(position, position.quantity*current_price);
      await handlePositions(info.walletAddress);

    } catch (error) {
      console.error("Error closing position:", error);
      alert("An error occurred while closing the order.");
    }
  };

  const refreshData = async () => {
    handlePrice(symbol+"-"+sector);
    fetchFee(info.walletAddress, symbol+"-"+sector, size);
    updateUserInfo(info.walletAddress);
    handleBalance(info.walletAddress);
    info.setRouteTrigger(true);
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
                <CloseOrder positions={position} transactions={transaction} handleCloseOrder={handleCloseOrder} />
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
