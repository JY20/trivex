import React, { useState, useEffect, useContext} from 'react';
import axios from 'axios';
import { Box, Grid, Stack } from '@mui/material';
import OpenOrder from '../components/OpenOrder'; 
import CloseOrder from '../components/CloseOrder'
import {AppContext} from '../components/AppProvider';
import { Connected, routeTrigger} from '../components/Alert';
import TradingViewWidget from "../components/TradingViewWidget";
import { Contract, Provider, cairo, CallData} from "starknet";

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
  const [tradingSymbol, setTradingSymbol] = useState('BTCUSDC');
  const [fee, setFee] = useState(0);

  const host = "https://trivex-trade-faekh0awhkdphxhq.canadacentral-01.azurewebsites.net";
  const info = useContext(AppContext);

  const hash_provider = new Provider({ network: "sepolia" });
  const classHash = "0x008e2b7d5289f1ca14683bc643f42687dd1ef949e8a35be4c429aa825a097604"; 
  const contractAddress = "0x005262cd7aee4715e4a00c41384a5f5ad151ff16da7523f41b93836bed922ced"; 
  const usdcTokenAddress = '0x53b40a647cedfca6ca84f542a0fe36736031905a9639a7f19a3c1e66bfd5080';


  const getABI = async (classHash) => {
    const contractClass = await hash_provider.getClassByHash(classHash);
    return contractClass.abi;
  };  

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
        const abi = await getABI(classHash);
        const contract = new Contract(abi, contractAddress, hash_provider);
        const balance = await contract.call("get_balance", [usdcTokenAddress, info.walletAddress]);
        const convertedBalance = (Number(balance) / 1000000).toFixed(2);
        setBalance(Number(convertedBalance));
    } catch (error) {
        console.error("Error fetching wallet balance:", error);
        setBalance(0);
    }
  };
  
  const handlePositions = async (address) => {
    try {
      console.log("Fetching portfolio...");
      const response = await axios.get(`${host}/wallets/${address}/portfolio`);
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
          const response = await axios.get(`${host}/wallets/${address}/transactions`);
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
  
  /* global BigInt */

  const handleDeposit = async (amount) => {
    try {
      const provider = info.wallet.account;
      const contractClass = await hash_provider.getClassByHash(classHash);
      const abi = contractClass.abi;
      const contract = new Contract(abi, contractAddress, provider);
      const weiAmount = amount * 1000000;
  
      const deposit = contract.populate("deposit", [BigInt(weiAmount), usdcTokenAddress]);
  
      const result = await provider.execute([
        {
          contractAddress: usdcTokenAddress,
          entrypoint: "approve",
          calldata: CallData.compile({
            spender: contractAddress,
            amount: cairo.uint256(weiAmount),
          }),
        },
        {
          contractAddress: contractAddress,
          entrypoint: "deposit",
          calldata: deposit.calldata,
        },
      ]);
  
      console.log("Deposit Result:", result);
      alert("Deposit completed successfully!");
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
  
  const handleWithdrawal = async (amount) => {
      try {
          const provider = info.wallet.account;
      
          const contractClass = await hash_provider.getClassByHash(classHash);
          const abi = contractClass.abi;
          const contract = new Contract(abi, contractAddress, provider);
      
          const weiAmount = amount * 1000000;
      
          const withdrawal = contract.populate("withdraw", [BigInt(weiAmount), usdcTokenAddress]);
      
          const result = await provider.execute([{
              contractAddress: contractAddress,
              entrypoint: "withdraw",
              calldata: withdrawal.calldata,
          }]);
      
          console.log("Withdrawal Result:", result);

          alert("Withdrawal completed successfully!");
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

      await handleDeposit(amount);
  
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
  
      const res = await axios.post(`${host}/close`, {
        portfolio_id: position.portfolio_id,
        wallet: position.address,
        symbol: position.symbol,
        size: position.quantity,
        sector: position.sector
      });
  
      if (res.data.status === "Success") {
        alert("Order closed successfully!");
        const balances = res.data.balance;
        console.log(balances);
        const accountValue = parseFloat(balances[0].amount || 0);
        setBalance(accountValue);
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
