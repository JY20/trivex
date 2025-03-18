import React, { useState, useEffect, useContext} from 'react';
import axios from 'axios';
import { Box, Grid, Stack } from '@mui/material';
import OpenOrder from '../components/OpenOrder'; 
import CloseOrder from '../components/CloseOrder'
import {AppContext} from '../components/AppProvider';
import { Connected, Whitelisted } from '../components/Alert';
import TradingViewWidget from "../components/TradingViewWidget";

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
  const [tradingSymbol, setTradingSymbol] = useState('');
  const [fee, setFee] = useState(0);

  const host = "localhost:8080";
  const info = useContext(AppContext);


  const handleSymbols = async (selectedSector) => {
    try {
      console.log(`Fetching symbols for sector: ${selectedSector}...`);
      const response = await axios.get(`http://${host}/symbols/${selectedSector}`);

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
  
  const handleBalance = async (address) => {
    try {
      console.log("Fetching balance...");
      const response = await axios.get(`http://${host}/wallets/${address}/balances`);

      const balances = response.data; 
      if (balances && balances.length > 0) {
        const accountValue = parseFloat(balances[0].amount || 0);
        setBalance(accountValue);
      } else {
          setBalance(0);
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };
  
  const handlePositions = async (address) => {
    try {
      console.log("Fetching portfolio...");
      const response = await axios.get(`http://${host}/wallets/${address}/portfolio`);
      console.log(response.data);
      const current_positions = response.data && response.data.length > 0 
      ? response.data.map(item => ({
          portfolio_id: item.portfolio_id,
          address: item.address,
          symbol: item.symbol,
          quantity: parseFloat(item.quantity),
          average_price: parseFloat(item.average_price),
          sector: item.sector
      })) 
      : [];
  
      setPosition(current_positions);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    }
  };

  const handleTransactions = async (address) => {
      try {
          const response = await axios.get(`http://${host}/wallets/${address}/transactions`);
          const transactionData = response.data && response.data.length > 0 
              ? response.data.map(item => ({
                  transaction_id: parseInt(item.transaction_id),
                  action: item.action,
                  symbol: item.symbol,
                  quantity: parseFloat(item.quantity),
                  average_price: parseFloat(item.average_price),
                  last_updated: item.last_updated,
              })) 
              : [];
          setTransaction(transactionData);
      } catch (error) {
          console.error('Error fetching transactions:', error);
      }
  };

  const fetchFee = async (address, symbol, size) => {
    try {
      console.log(`Fetching fee for ${address} for order ${symbol} with size ${size}`);
      const response = await axios.get(`http://${host}/fee/${address}/${symbol}/${size}`);
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
      handleBalance(address);
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
      const response = await axios.get(`http://${host}/price/${symbol}`);

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
    console.log(sector);
    if(sector === "crypto"){
      setTradingSymbol(e+"USDC");
    }else if(sector === "tsx"){
      setTradingSymbol("TSX:"+e);
    }else{
      setTradingSymbol(e);
    }
    handlePrice(e+"-"+sector);
  };


  const handleSectorChange = (e) => {
    const selectedSector = e.target.value;
    setSector(selectedSector);
    handleSymbols(selectedSector); 
    updateUserInfo(info.walletAddress)
  };

  const handleOpenOrder = async (action) => {
    if (!sector || !symbol) {
      alert('Please fill in all fields before proceeding.');
      return;
    }
  
    try {
      let is_buy = action === "Buy";
  
      const data = {
        wallet: info.walletAddress,
        is_buy,
        symbol,
        size,
        sector,
        leverage
      };

      console.log(data);
    
      const res = await axios.post(`http://${host}/open`, data);
    
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
  
      const res = await axios.post(`http://${host}/close`, {
        portfolio_id: position.portfolio_id,
        wallet: position.address,
        symbol: position.symbol,
        size: position.quantity,
        sector: position.sector
      });
  
      if (res.data.status === "Success") {
        handleBalance(sector);
        alert("Order closed successfully!");
      } else {
        alert("Order closure failed. Please try again.");
      }
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
  };

  useEffect(() => {
      if (info.walletAddress) {
          refreshData();
      }
  }, [info.walletAddress]);

  if(info.walletAddress != null){
      if(info.Whitelisted !== false){
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
          return <Whitelisted/>
      }
  }else{
      return <Connected/>
  }
};

export default TradePage;
