import React, { useState } from 'react';
import axios from 'axios';
import { Box, Typography, TextField, MenuItem, Button, Slider} from '@mui/material';

const TradePage = () => {
  const [sector, setSector] = useState('');
  const [symbol, setSymbol] = useState('');
  const [balance, setBalance] = useState(0); 
  const [used, setUsed] = useState(0); 
  const [available, setAvailable] = useState(0); 
  const [size, setSize] = useState(0); 
  const [leverage, setLeverage] = useState(1);
  const [symbolList, setSymbolList] = useState([]);
  const [symbolLeverages, setSymbolLeverages] = useState({});
  const [selectedPercentage, setSelectedPercentage] = useState(100); 
  const [position, setPosition] = useState({}); 


  const handleSymbols = async (selectedSector) => {
    try {
      console.log(`Fetching symbols for sector: ${selectedSector}...`);
      const response = await axios.get(`http://localhost/symbols/${selectedSector}`);

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
  

  const handleBalance = async (selectedSector) => {
    if (selectedSector === 'crypto') {
      try {
        console.log("Fetching balance...");
        const response = await axios.get('http://localhost/info');
        const accountValue = parseFloat(response.data.marginSummary.accountValue);
        setBalance(accountValue);
        const usedValue = parseFloat(response.data.marginSummary.totalMarginUsed);
        setUsed(usedValue);

        setAvailable(balance-used);
        
        const pos = response.data.assetPositions[0].position;
        setPosition(pos);
        console.log(pos);
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    }
  };

  const handleSectorChange = (e) => {
    const selectedSector = e.target.value;
    setSector(selectedSector);
    handleSymbols(selectedSector); 
    handleBalance(selectedSector); 
  };

  const handleLeverageChange = (e) => {
    setLeverage(Number(e.target.value));
  };

  const handlePercentageSelection = (percentage) => {
    setSelectedPercentage(percentage);
    setSize((percentage / 100) * available); 
  };

  const handleManualBalanceChange = (e) => {
    setSize(e.target.value); 
  };

  const handleTrade = async (action) => {
    if (!sector || !symbol) {
      alert('Please fill in all fields before proceeding.');
      return;
    }

    try {
      let is_buy = action === "Buy";

      const priceResponse = await axios.get(
        `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}USDT`
      );
  
      const price = parseFloat(priceResponse.data.price);
      if (isNaN(price)) {
        alert("Failed to fetch the current price. Please try again.");
        return;
      }
      
      const sizeCurrent = Math.floor((size * leverage) / price);

      const res = await axios.post("http://localhost/open", {
        is_buy,
        symbol,
        sizeCurrent,
        sector
      });
  
      const data = res.data;
  
      alert(`${action} order placed successfully at $${price.toFixed(2)}!`);
      return data;
    } catch (e) {
      console.error("Error during trade:", e);
      alert("An error occurred while processing the trade.");
    }
  };

  const handleCloseOrder = async () => {
    try {
      alert(`Closing position for ${position.coin}`);
  
      const res = await axios.post("http://localhost/close", {
        symbol,
        sector
      });
  
      if (res.data.status === "Success") {
        handleBalance(sector)
        alert("Order closed successfully!");
      } else {
        alert("Order closure failed. Please try again.");
      }
    } catch (error) {
      console.error("Error closing position:", error);
      alert("An error occurred while closing the order.");
    }
  };
  


  return (
    <Box sx={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#D1C4E9', minHeight: '100vh', padding: '20px' }}>

      <Box sx={{ maxWidth: '600px', margin: '0 auto', background: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <TextField
          select
          label="Sector"
          value={sector}
          onChange={handleSectorChange}
          fullWidth
          required
          sx={{ marginBottom: '20px' }}
        >
          <MenuItem value="crypto">Crypto</MenuItem>
          <MenuItem value="tsx">TSX Stocks</MenuItem>
          <MenuItem value="sp500">SP500 Stocks</MenuItem>
        </TextField>

        <TextField
          select
          label="Symbol"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          fullWidth
          required
          sx={{ marginBottom: '20px' }}
          disabled={!sector}
        >
          {symbolList.map((token) => (
            <MenuItem key={token} value={token}>
              {token}
            </MenuItem>
          ))}
        </TextField>

        {symbol && (
          <>
            <Typography variant="body1" sx={{ marginBottom: '10px', color: 'black' }}>
              Select Leverage:
            </Typography>
            <Slider
              value={leverage}
              min={1}
              max={symbolLeverages[symbol] ? symbolLeverages[symbol] : 1}
              step={1}
              onChange={handleLeverageChange}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${value}x`}
              sx={{ marginBottom: '20px' }}
            />
          </>
        )}

        <Typography variant="body1" sx={{ marginBottom: '20px', color: 'black' }}>
          Select Percentage of Balance:
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <Button
            variant="outlined"
            sx={{ backgroundColor: '#6c4f91', color: '#fff' }}
            onClick={() => handlePercentageSelection(0)}
          >
            0%
          </Button>
          <Button
            variant="outlined"
            sx={{ backgroundColor: '#6c4f91', color: '#fff' }}
            onClick={() => handlePercentageSelection(25)}
          >
            25%
          </Button>
          <Button
            variant="outlined"
            sx={{ backgroundColor: '#6c4f91', color: '#fff' }}
            onClick={() => handlePercentageSelection(50)}
          >
            50%
          </Button>
          <Button
            variant="outlined"
            sx={{ backgroundColor: '#6c4f91', color: '#fff' }}
            onClick={() => handlePercentageSelection(75)}
          >
            75%
          </Button>
          <Button
            variant="outlined"
            sx={{ backgroundColor: '#6c4f91', color: '#fff' }}
            onClick={() => handlePercentageSelection(100)}
          >
            100%
          </Button>
        </Box>
        <TextField
          label="Manual Input"
          type="number"
          value={size}
          onChange={handleManualBalanceChange}
          fullWidth
          sx={{ marginBottom: '20px' }}
        />

        <Typography variant="body1" sx={{ marginBottom: '20px', color: 'black' }}>
          Balance: ${available.toFixed(2)}
        </Typography>

        <Typography variant="body1" sx={{ marginBottom: '20px', color: 'black' }}>
          Leverage: {leverage}x
        </Typography>

        <Button
          variant="contained"
          fullWidth
          onClick={() => handleTrade('Buy')}
          sx={{ marginBottom: '10px', backgroundColor: '#7E57C2' }}
        >
          Buy
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          onClick={() => handleTrade('Sell')}
        >
          Sell
        </Button>
      </Box>

      {sector === 'crypto' && position && symbol && (
          <Box sx={{ maxWidth: '600px', marginTop: '30px',  padding: '20px', backgroundColor: '#f1f1f1', borderRadius: '8px', margin: '20px auto'}}>
            <Typography variant="h5" sx={{ marginBottom: '10px' }}>
              Position Details
            </Typography>
            {/* <Typography variant="body1">{position}</Typography> */}
            <Button
              variant="contained"
              color="error"
              fullWidth
              sx={{ marginTop: '10px' }}
              onClick={handleCloseOrder}
            >
              Close Order
            </Button>
          </Box>
        )}
    </Box>

  );
};

export default TradePage;
