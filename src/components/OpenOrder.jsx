import React, { useState, useEffect } from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Box, Typography, TextField, MenuItem, Button, Slider, Autocomplete, IconButton } from '@mui/material';
import Loading from './Loading';

const OpenOrder = ({
  sector,
  handleSectorChange,
  symbol,
  handleSymbol,
  symbolList,
  symbolLeverages,
  leverage,
  setLeverage,
  amount,
  setAmount,
  available,
  handleTrade,
  price,
  refreshData,
  fee,
  size
}) => {
  const [loading, setLoading] = useState(false);

  const handleTradeWithLoading = async (type) => {
    try {
      setLoading(true);
      await handleTrade(type);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshWithLoading = async () => {
    try {
      setLoading(true);
      await refreshData();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loading />}

      <Box sx={{ margin: '0 auto', background: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        {/* 刷新按钮 */}
        <Box sx={{ display: 'flex', justifyContent: 'left', alignItems: 'center', marginBottom: '10px' }}>
          <Typography variant="h7">Refresh</Typography>
          <IconButton
            sx={{ color: '#7E57C2' }}
            onClick={handleRefreshWithLoading}
            disabled={loading}
          >
            <RefreshIcon />
          </IconButton>
        </Box>

        {/* Sector选择框 */}
        <TextField
          select
          label="Sector"
          value={sector}
          onChange={handleSectorChange}
          fullWidth
          required
          sx={{ marginBottom: '10px' }}
          disabled={loading}
        >
          <MenuItem value="crypto">Crypto</MenuItem>
          {/* <MenuItem value="tsx">TSX Stocks</MenuItem>
          <MenuItem value="sp500">SP500 Stocks</MenuItem> */}
        </TextField>

        {/* Symbol搜索框 */}
        <Autocomplete
          options={symbolList}
          getOptionLabel={(option) => String(option)}
          value={symbol}
          onChange={(event, newValue) => handleSymbol(newValue || "")}
          onInputChange={(event, newInputValue) => handleSymbol(newInputValue)}
          disabled={!sector || loading}
          fullWidth
          freeSolo
          renderInput={(params) => (
            <TextField
              {...params}
              label="Symbol"
              placeholder="Search or select a symbol"
              required
              sx={{ marginBottom: '10px' }}
            />
          )}
        />

        <Typography variant="h6" sx={{ marginBottom: '10px' }}>
          Current Price: {price ? `$${price}` : 'N/A'}
        </Typography>
  
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
          <Typography variant="body1" sx={{ color: 'black' }}>
            Select Leverage:
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 'bold', minWidth: '30px'}}>
            {leverage}x
          </Typography>
        </Box>
        <Slider
          value={leverage}
          min={1}
          max={symbolLeverages[symbol] || 1}
          step={1}
          onChange={(e) => setLeverage(Number(e.target.value))}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `${value}x`}
          sx={{ marginBottom: '10px' }}
          disabled={loading}
        />

        {/* 百分比按钮 */}
        <Typography variant="body1" sx={{ marginBottom: '10px', color: 'black' }}>
          Select Percentage of Balance:
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          {[0, 25, 50, 75, 100].map((percentage) => (
            <Button
              key={percentage}
              variant="outlined"
              sx={{ backgroundColor: '#6c4f91', color: '#fff' }}
              onClick={() => setAmount((percentage / 100) * available)}
              disabled={loading}
            >
              {percentage}%
            </Button>
          ))}
        </Box>

        <TextField
          label="Manual Input in USD"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          fullWidth
          sx={{ marginBottom: '10px' }}
          disabled={loading}
        />

        {/* Estimate 框 */}
        <Box
          sx={{
            backgroundColor: '#D7CCE8', // Lighter shade
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '10px',
            color: '#000'
          }}
        >
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body1">Price:</Typography>
            <Typography variant="body1">${price}</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body1">Size:</Typography>
            <Typography variant="body1">{size.toFixed(2) || 0}</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body1">Total:</Typography>
            <Typography variant="body1">${(price*size).toFixed(2)}</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body1">Fee:</Typography>
            <Typography variant="body1">${fee.toFixed(2)}</Typography>
          </Box>
        </Box>

        <Typography variant="body1" sx={{ marginBottom: '10px', color: 'black' }}>
          Balance: {available} USD
        </Typography>

        {/* 交易按钮 */}
        <Button
          variant="contained"
          fullWidth
          onClick={() => handleTradeWithLoading('Buy')}
          sx={{ marginBottom: '10px', backgroundColor: '#7E57C2' }}
          disabled={loading}
        >
          Buy
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          onClick={() => handleTradeWithLoading('Sell')}
          disabled={loading}
        >
          Sell
        </Button>
      </Box>
    </>
  );
};

export default OpenOrder;
