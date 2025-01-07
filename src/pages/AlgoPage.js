import React, { useState } from 'react';
import { Box, Typography, TextField, MenuItem, Button, Switch, List, ListItem, ListItemText} from '@mui/material';
import axios from 'axios';

const AlgoPage = () => {
  const [strategy, setStrategy] = useState('');
  const [sector, setSector] = useState('');
  const [symbol, setSymbol] = useState('');

  const [openSd, setopenSd] = useState(1);
  const [closeSd, setcloseSd] = useState(0.8);
  const [isBuy, setIsBuy] = useState(true);
  const [results, setResults] = useState(null);

  const [list, setList] = useState('');
  const [email, setEmail] = useState('');

  const [symbol1, setSymbol1] = useState('');
  const [symbol2, setSymbol2] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const strategies = [
    { label: 'AverageRebalance', value: 'averageRebalance' },
    { label: 'Momentum', value: 'momentum' },
    { label: 'StandardDeviation', value: 'standardDeviation' },
    { label: 'CoVariance', value: 'coVariance' },
  ];

  const handleStartAlgo = async () => {
    if (!strategy) {
      alert('Please select both a strategy.');
      return;
    }
  
    switch (strategy) {
      case 'averageRebalance':
        averageRebalance(list, email);
        console.log(`Running Average Rebalance strategy in sector: ${sector}`);
        break;
  
      case 'momentum':
        momentum(list, email);
        console.log(`Running Momentum strategy in sector: ${sector}`);
        break;
  
      case 'standardDeviation':
        standardDeviation(symbol, openSd, closeSd, isBuy);
        console.log(`Running Standard Deviation strategy in sector: ${sector}`);
        break;
  
      case 'coVariance':
        coVariance(symbol1, symbol2, startDate, endDate);
        console.log(`Running Co-Variance strategy in sector: ${sector}`);
        break;
  
      default:
        console.error('Unknown strategy selected.');
    }
  
    alert(`Algorithm started with strategy: ${strategy} in sector: ${sector}`);
  };

  const standardDeviation = async (symbol, openSd, closeSd, isBuy) => {

    try {
      const res = await axios.post("http://localhost/standardDeviation", {
        symbol,
        openSd,
        closeSd,
        is_buy: isBuy,
      });
      
      const data = res.data;
      setResults(data);    
      return data;
    } catch (e) {
      console.error('Error running standard deviation:', e);
    }
  };

  const coVariance= async (symbol1, symbol2, startDate, endDate) => {

    try {
      const res = await axios.post("http://localhost/coVariance", {
        symbol1,
        symbol2,
        start_date: new Date(startDate),
        end_date: new Date(endDate),
      });
      
      const data = res.data;
      setResults(data);    
      return data;
    } catch (e) {
      console.error('Error running standard deviation:', e);
    }
  };

  const averageRebalance = async (list, email) => {

    try {
      const res = await axios.post("http://localhost/averageRebalance", {
        list, 
        email
      });
      
      const data = res.data; 
      return data;
    } catch (e) {
      console.error('Error running average rebalance:', e);
    }
  };

  const momentum = async (list, email) => {

    try {
      const res = await axios.post("http://localhost/momentum", {
        list, 
        email
      });
      
      const data = res.data; 
      return data;
    } catch (e) {
      console.error('Error running momentum:', e);
    }
  };


  return (
    <Box
      sx={{
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#D1C4E9',
        minHeight: '100vh',
        padding: '20px',
      }}
    >
      <Box
        sx={{
          maxWidth: '600px',
          margin: '0 auto',
          background: '#fff',
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <TextField
          select
          label="Strategy"
          value={strategy}
          onChange={(e) => setStrategy(e.target.value)}
          fullWidth
          required
          sx={{ marginBottom: '20px' }}
        >
          {strategies.map((strat) => (
            <MenuItem key={strat.value} value={strat.value}>
              {strat.label}
            </MenuItem>
          ))}
        </TextField>

        {(strategy === 'averageRebalance' || strategy === 'momentum')&& (
          <>
          <TextField
            select
            label="List"
            value={list}
            onChange={(e) => setList(e.target.value)}
            fullWidth
            required
            sx={{ marginBottom: '20px' }}
          >
            <MenuItem value="crypto">Crypto</MenuItem>
            <MenuItem value="tsx">TSX</MenuItem>
            <MenuItem value="sp500">SP500</MenuItem>
          </TextField>

          <TextField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
              sx={{ marginBottom: '20px' }}
              placeholder="Enter Email"
          />
          </>
        )}

        {strategy === 'standardDeviation' && (
          <>
          <TextField
            select
            label="Sector"
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            fullWidth
            required
            sx={{ marginBottom: '20px' }}
          >
            <MenuItem value="crypto">Crypto</MenuItem>
            <MenuItem value="tsx">TSX Stocks</MenuItem>
            <MenuItem value="sp500">SP500 Stocks</MenuItem>
          </TextField>

          <TextField
              label="Symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              fullWidth
              required
              sx={{ marginBottom: '20px' }}
              disabled={!sector || sector !== 'crypto'}
              placeholder="Enter symbol"
          />
          </>
        )}
        {strategy === 'standardDeviation' && sector === 'crypto' && (
          <>
            <Typography variant="body1" sx={{marginTop: '10px', marginBottom: '10px', color: 'black' }}>
              Parameters:
            </Typography>
            <TextField
                label="Open Order SD"
                value={openSd}
                onChange={(e) => setopenSd(e.target.value)}
                fullWidth
                required
                sx={{ marginBottom: '20px' }}
            />
            <TextField
                label="Close Order SD"
                value={closeSd}
                onChange={(e) => setcloseSd(e.target.value)}
                fullWidth
                required
                sx={{ marginBottom: '20px' }}
            />
            <Box sx={{ marginBottom: '20px' }}>
              Is Buy
              <Switch
                checked={isBuy}
                onChange={(e) => setIsBuy(!isBuy)}
                color="primary"
              />
            </Box>         
          </>
        )}
        
        {strategy === 'coVariance' && (
          <>
          <TextField
            select
            label="Sector"
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            fullWidth
            required
            sx={{ marginBottom: '20px' }}
          >
            <MenuItem value="crypto">Crypto</MenuItem>
            <MenuItem value="tsx">TSX Stocks</MenuItem>
            <MenuItem value="sp500">SP500 Stocks</MenuItem>
          </TextField>

          <TextField
              label="Symbol1"
              value={symbol1}
              onChange={(e) => setSymbol1(e.target.value.toUpperCase())}
              fullWidth
              required
              sx={{ marginBottom: '20px' }}
              disabled={!sector || sector !== 'crypto'}
              placeholder="Enter symbol"
          />
          <TextField
              label="Symbol2"
              value={symbol2}
              onChange={(e) => setSymbol2(e.target.value.toUpperCase())}
              fullWidth
              required
              sx={{ marginBottom: '20px' }}
              disabled={!sector || sector !== 'crypto'}
              placeholder="Enter symbol"
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginBottom: '20px' }}>
            <TextField
              type="date"
              label="Start Date"
              InputLabelProps={{ shrink: true }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              fullWidth
              required
            />
            <TextField
              type="date"
              label="End Date"
              InputLabelProps={{ shrink: true }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              fullWidth
              required
            />
          </Box>
          </>
        )}

        <Button
            variant="contained"
            sx={{ backgroundColor: '#7E57C2' }}
            fullWidth
            onClick={handleStartAlgo}
          >
            Run
        </Button>
      </Box>

      {results && (
          <Box sx={{ maxWidth: '600px', marginTop: '30px',  padding: '20px', backgroundColor: '#f1f1f1', borderRadius: '8px', margin: '20px auto'}}>
            <Typography variant="h5" sx={{ marginBottom: '10px' }}>
              Results
            </Typography>
            {typeof results === "object" ? (
            <List>
              {Object.entries(results).map(([key, value], index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={key.toString()}
                    secondary={value.toString()}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>{results}</Typography>
          )}
          </Box>
      )}  
    </Box>
  );
};

export default AlgoPage;