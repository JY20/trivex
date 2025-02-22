import React from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Box, Typography, TextField, MenuItem, Button, Slider, Autocomplete, IconButton } from '@mui/material';

const OpenOrder = ({ sector, handleSectorChange, symbol, handleSymbol, symbolList, symbolLeverages, leverage, setLeverage, size, setSize, available, handleTrade, price, refreshData}) => {

  return (
    <Box sx={{ maxWidth: '50%', margin: '0 auto', background: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <Box sx={{ display: 'flex', justifyContent: 'left', alignItems: 'center', marginBottom: '20px' }}>
          <Typography variant="h7">
              Refresh
          </Typography>
          <IconButton sx={{color: '#7E57C2'}} onClick={refreshData}>
              <RefreshIcon />
          </IconButton>
      </Box>
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
      <Autocomplete
        options={symbolList}
        getOptionLabel={(option) => String(option)} // Ensure all labels are strings
        value={symbol}
        onChange={(event, newValue) => handleSymbol(newValue || "")} // Use handleSymbol
        onInputChange={(event, newInputValue) => handleSymbol(newInputValue)} // Handle typing updates
        disabled={!sector}
        fullWidth
        freeSolo
        renderInput={(params) => (
          <TextField
            {...params}
            label="Symbol"
            placeholder="Search or select a symbol"
            required
            sx={{ marginBottom: '20px' }}
          />
        )}
      />
      <Typography variant="h6" sx={{ marginTop: '10px', marginBottom: '20px' }}>
        Current Price: {price ? `$${price}` : 'N/A'}
      </Typography>

      {symbol && (
        <> 
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
          <Typography variant="body1" sx={{ marginBottom: '10px', color: 'black' }}>
            Select Leverage:
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 'bold', minWidth: '30px',  marginBottom: '10px' }}>
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
              sx={{ marginBottom: '20px' }}
            />
        </>
      )}

      <Typography variant="body1" sx={{ marginBottom: '20px', color: 'black' }}>
        Select Percentage of Balance:
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        {[0, 25, 50, 75, 100].map((percentage) => (
          <Button
            key={percentage}
            variant="outlined"
            sx={{ backgroundColor: '#6c4f91', color: '#fff' }}
            onClick={() => setSize((percentage / 100) * available)}
          >
            {percentage}%
          </Button>
        ))}
      </Box>
      <TextField
        label="Manual Input in USD"
        type="number"
        value={size}
        onChange={(e) => setSize(e.target.value)}
        fullWidth
        sx={{ marginBottom: '20px' }}
      />

      <Typography variant="body1" sx={{ marginBottom: '20px', color: 'black' }}>
        Balance: {available.toFixed(2)} USD
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
  );
};

export default OpenOrder;
