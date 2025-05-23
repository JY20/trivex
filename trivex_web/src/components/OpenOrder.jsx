import React, { useState, useEffect } from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Box, Typography, TextField, MenuItem, Button, Slider, Autocomplete, IconButton } from '@mui/material';
import Loading from './Loading';
import { styled } from '@mui/material/styles';

// Styled components
const StyledButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #9B6DFF 0%, #6A4BA1 100%)',
  color: 'white',
  fontWeight: 'bold',
  borderRadius: '12px',
  transition: 'all 0.3s ease',
  textTransform: 'none',
  boxShadow: '0 4px 20px rgba(106, 75, 161, 0.25)',
  '&:hover': { 
      boxShadow: '0 6px 25px rgba(106, 75, 161, 0.4)',
      transform: 'translateY(-2px)'
  }
}));

const OutlinedButton = styled(Button)(({ theme }) => ({
  background: 'transparent',
  color: '#B19EE3',
  fontWeight: 'bold',
  borderRadius: '12px',
  border: '1px solid rgba(126, 87, 194, 0.4)',
  transition: 'all 0.3s ease',
  textTransform: 'none',
  '&:hover': { 
      background: 'rgba(126, 87, 194, 0.1)',
      borderColor: '#9B6DFF',
      color: '#FFFFFF',
      transform: 'translateY(-2px)'
  }
}));

const InfoBox = styled(Box)(({ theme }) => ({
  background: 'rgba(28, 25, 38, 0.5)',
  borderRadius: '12px',
  border: '1px solid rgba(126, 87, 194, 0.2)',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  color: '#B19EE3'
}));

const PercentButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'rgba(126, 87, 194, 0.2)',
  color: '#B19EE3',
  borderRadius: '8px',
  transition: 'all 0.3s ease',
  minWidth: '40px',
  '&:hover': {
    backgroundColor: 'rgba(126, 87, 194, 0.4)',
    color: '#FFFFFF',
  }
}));

const OrderFormContainer = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(28, 25, 38, 0.5)',
  border: '1px solid rgba(126, 87, 194, 0.2)',
  borderRadius: '16px',
  padding: theme.spacing(3),
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
  height: '100%',
}));

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
      await refreshData();
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

      <OrderFormContainer>
        <Box sx={{ display: 'flex', justifyContent: 'left', alignItems: 'center', marginBottom: '10px' }}>
          <Typography variant="body2" sx={{ color: '#B19EE3' }}>Refresh</Typography>
          <IconButton
            sx={{ color: '#9B6DFF' }}
            onClick={handleRefreshWithLoading}
            disabled={loading}
          >
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
          sx={{ 
            marginBottom: '15px',
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'rgba(126, 87, 194, 0.3)',
              },
              '&:hover fieldset': {
                borderColor: '#9B6DFF',
              },
            },
            '& .MuiInputLabel-root': {
              color: '#B19EE3',
            },
            '& .MuiSelect-select': {
              color: '#FFFFFF',
            }
          }}
          disabled={loading}
        >
          <MenuItem value="crypto">Crypto</MenuItem>
          {/* <MenuItem value="tsx">TSX Stocks</MenuItem>
          <MenuItem value="sp500">SP500 Stocks</MenuItem> */}
        </TextField>

        <Autocomplete
          options={symbolList}
          getOptionLabel={(option) => String(option)}
          value={symbol}
          onChange={(event, newValue) => handleSymbol(newValue || "")}
          onInputChange={(event, newInputValue) => handleSymbol(newInputValue)}
          disabled={!sector || loading}
          fullWidth
          freeSolo
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'rgba(126, 87, 194, 0.3)',
              },
              '&:hover fieldset': {
                borderColor: '#9B6DFF',
              },
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Symbol"
              placeholder="Search or select a symbol"
              required
              sx={{ 
                marginBottom: '15px',
                '& .MuiInputLabel-root': {
                  color: '#B19EE3',
                },
                '& .MuiInputBase-input': {
                  color: '#FFFFFF',
                }
              }}
            />
          )}
        />

        <Typography variant="h6" sx={{ marginBottom: '15px', color: '#FFFFFF' }}>
          Current Price: {price ? `$${price}` : 'N/A'}
        </Typography>
  
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
          <Typography variant="body1" sx={{ color: '#B19EE3' }}>
            Select Leverage:
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 'bold', minWidth: '30px', color: '#9B6DFF' }}>
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
          sx={{ 
            marginBottom: '15px',
            color: '#9B6DFF',
            '& .MuiSlider-thumb': {
              backgroundColor: '#9B6DFF',
            },
            '& .MuiSlider-track': {
              background: 'linear-gradient(90deg, #9B6DFF 0%, #6A4BA1 100%)',
            }
          }}
          disabled={loading}
        />

        <Typography variant="body1" sx={{ marginBottom: '10px', color: '#B19EE3' }}>
          Select Percentage of Balance:
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
          {[0, 25, 50, 75, 100].map((percentage) => (
            <PercentButton
              key={percentage}
              variant="outlined"
              onClick={() => setAmount((percentage / 100) * available)}
              disabled={loading}
            >
              {percentage}%
            </PercentButton>
          ))}
        </Box>

        <TextField
          label="Manual Input in USD"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          fullWidth
          sx={{ 
            marginBottom: '15px',
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'rgba(126, 87, 194, 0.3)',
              },
              '&:hover fieldset': {
                borderColor: '#9B6DFF',
              },
            },
            '& .MuiInputLabel-root': {
              color: '#B19EE3',
            },
            '& .MuiInputBase-input': {
              color: '#FFFFFF',
            }
          }}
          disabled={loading}
        />

        <InfoBox>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body2">Price:</Typography>
            <Typography variant="body2" sx={{ color: '#FFFFFF' }}>${price}</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body2">Size:</Typography>
            <Typography variant="body2" sx={{ color: '#FFFFFF' }}>{size.toFixed(6) || 0}</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body2">Total:</Typography>
            <Typography variant="body2" sx={{ color: '#FFFFFF' }}>${(price*size).toFixed(6)}</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body2">Fee:</Typography>
            <Typography variant="body2" sx={{ color: '#FFFFFF' }}>${fee.toFixed(6)}</Typography>
          </Box>
        </InfoBox>

        <Typography variant="body1" sx={{ marginBottom: '15px', color: '#B19EE3' }}>
          Balance: <span style={{ color: '#FFFFFF' }}>{available} USD</span>
        </Typography>

        <StyledButton
          fullWidth
          onClick={() => handleTradeWithLoading('Buy')}
          sx={{ marginBottom: '10px' }}
          disabled={loading}
        >
          Buy
        </StyledButton>
        <OutlinedButton
          fullWidth
          onClick={() => handleTradeWithLoading('Sell')}
          disabled={loading}
        >
          Sell
        </OutlinedButton>
      </OrderFormContainer>
    </>
  );
};

export default OpenOrder;
