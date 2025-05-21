import React, { useState } from 'react';
import { Box, Typography, Button, Rating, TextField, MenuItem, Switch } from '@mui/material';
import { styled } from '@mui/material/styles';
import ParamCreator from './paramCreator';

// Styled button component to match the TradePage Buy button
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

const Information = ({ info, onRunStrategy, strategy, parameters, parameterMap, handleParamChange }) => {
    const [params, setParams] = useState([{ parameter: '', type: '' }]);

  if (!info) return null;

  const { label, cost, creator, rating, description } = info;
  const paramsForStrategy = parameterMap[strategy] || [];

  const textFieldSx = {
    marginBottom: '20px',
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'rgba(147, 112, 219, 0.3)',
      },
      '&:hover fieldset': {
        borderColor: 'rgba(147, 112, 219, 0.5)',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#9C27B0',
      },
    },
    '& .MuiInputLabel-root': {
      color: '#BB86FC',
    },
    '& .MuiInputBase-input': {
      color: '#FFFFFF',
    },
    '& .MuiSelect-icon': {
      color: '#BB86FC',
    },
  };

  return (
    <Box
      sx={{
        maxWidth: '100%',
        padding: '20px',
        backgroundColor: 'rgba(28, 25, 38, 0.5)',
        borderRadius: '8px',
        border: '1px solid rgba(147, 112, 219, 0.3)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
        height: '80vh',
        overflow: 'auto'
      }}
    >

    {strategy !== 'newStrategy' && (
        <>
          <Typography variant="h4" sx={{ marginBottom: '10px', color: '#FFFFFF' }}>{label}</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body1" sx={{ color: '#FFFFFF' }}>Cost: {cost} STRK</Typography>
            <Rating value={rating} precision={0.5} readOnly sx={{ 
              '& .MuiRating-iconFilled': {
                color: '#BB86FC',
              }
            }}/>
          </Box>
          <Typography variant="body1" sx={{ marginBottom: '10px', color: '#FFFFFF' }}>Creator: {`${creator.slice(0, 2)}...${creator.slice(-4)}`}</Typography>
          <Typography variant="h7" sx={{ marginBottom: '10px', fontWeight: 'bold', color: '#BB86FC' }}>Description:</Typography>
          <Typography variant="body2" sx={{ marginBottom: '10px', color: '#FFFFFF' }}>{description}</Typography>
          <Typography variant="h7" sx={{ marginBottom: '10px', fontWeight: 'bold', color: '#BB86FC' }}>Parameters:</Typography>
        </>
      )}

      {paramsForStrategy.includes('email') && (
        <TextField
          label="Email"
          value={parameters.email || ''}
          onChange={(e) => handleParamChange('email', e.target.value)}
          fullWidth
          required
          sx={textFieldSx}
          placeholder="Enter Email"
        />
      )}

      {paramsForStrategy.includes('sector') && (
        <TextField
          select
          label="Sector"
          value={parameters.sector || ''}
          onChange={(e) => handleParamChange('sector', e.target.value)}
          fullWidth
          required
          sx={textFieldSx}
        >
          <MenuItem value="crypto" sx={{ color: '#1A0033' }}>Crypto</MenuItem>
          <MenuItem value="tsx" sx={{ color: '#1A0033' }}>TSX Stocks</MenuItem>
          <MenuItem value="sp500" sx={{ color: '#1A0033' }}>SP500 Stocks</MenuItem>
        </TextField>
      )}

      {paramsForStrategy.includes('symbol') && (
        <TextField
          label="Symbol"
          value={parameters.symbol || ''}
          onChange={(e) => handleParamChange('symbol', e.target.value.toUpperCase())}
          fullWidth
          required
          sx={textFieldSx}
          disabled={!parameters.sector}
          placeholder="Enter symbol"
        />
      )}

      {paramsForStrategy.includes('openSd') && (
        <TextField
          label="Open Order SD"
          value={parameters.openSd || ''}
          onChange={(e) => handleParamChange('openSd', e.target.value)}
          fullWidth
          required
          sx={textFieldSx}
        />
      )}

      {paramsForStrategy.includes('closeSd') && (
        <TextField
          label="Close Order SD"
          value={parameters.closeSd || ''}
          onChange={(e) => handleParamChange('closeSd', e.target.value)}
          fullWidth
          required
          sx={textFieldSx}
        />
      )}

      {paramsForStrategy.includes('isBuy') && (
        <Box sx={{ marginBottom: '20px', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: 2 }}>
          Is Buy
          <Switch
            checked={parameters.isBuy || false}
            onChange={(e) => handleParamChange('isBuy', e.target.checked)}
            color="secondary"
          />
        </Box>
      )}

      {paramsForStrategy.includes('symbol1') && (
        <TextField
          label="Symbol 1"
          value={parameters.symbol1 || ''}
          onChange={(e) => handleParamChange('symbol1', e.target.value.toUpperCase())}
          fullWidth
          required
          sx={textFieldSx}
          placeholder="Enter symbol"
        />
      )}

      {paramsForStrategy.includes('symbol2') && (
        <TextField
          label="Symbol 2"
          value={parameters.symbol2 || ''}
          onChange={(e) => handleParamChange('symbol2', e.target.value.toUpperCase())}
          fullWidth
          required
          sx={textFieldSx}
          placeholder="Enter symbol"
        />
      )}

      {paramsForStrategy.includes('startDate') && (
        <TextField
          type="date"
          label="Start Date"
          InputLabelProps={{ shrink: true }}
          value={parameters.startDate || ''}
          onChange={(e) => handleParamChange('startDate', e.target.value)}
          fullWidth
          required
          sx={textFieldSx}
        />
      )}

      {paramsForStrategy.includes('endDate') && (
        <TextField
          type="date"
          label="End Date"
          InputLabelProps={{ shrink: true }}
          value={parameters.endDate || ''}
          onChange={(e) => handleParamChange('endDate', e.target.value)}
          fullWidth
          required
          sx={textFieldSx}
        />
      )}

    
    {paramsForStrategy.includes('address') && (
        <TextField
          label="Wallet Address"
          value={parameters.address || ''}
          onChange={(e) => handleParamChange('address', e.target.value)}
          fullWidth
          required
          sx={textFieldSx}
          placeholder="0x..."
        />
      )}
      
      {paramsForStrategy.includes('tag') && (
        <TextField
            select
            label="Tag"
            value={parameters.tag || ''}
            onChange={(e) => handleParamChange('tag', e.target.value)}
            fullWidth
            required
            sx={textFieldSx}
        >
            <MenuItem value="Low Frequency" sx={{ color: '#1A0033' }}>Low Frequency</MenuItem>
            <MenuItem value="Calculator" sx={{ color: '#1A0033' }}>Calculator</MenuItem>
        </TextField>
        )}

      {paramsForStrategy.includes('price') && (
        <TextField
          label="Price (STRK)"
          value={parameters.price || ''}
          onChange={(e) => handleParamChange('price', e.target.value)}
          fullWidth
          required
          sx={textFieldSx}
          placeholder="Enter price"
        />
      )}

      {paramsForStrategy.includes('description') && (
        <TextField
          label="Description"
          value={parameters.description || ''}
          onChange={(e) => handleParamChange('description', e.target.value)}
          fullWidth
          multiline
          rows={3}
          required
          sx={textFieldSx}
          placeholder="Describe your strategy"
        />
      )}

      {paramsForStrategy.includes('link') && (
        <TextField
          label="GitHub Link"
          value={parameters.link || ''}
          onChange={(e) => handleParamChange('link', e.target.value)}
          fullWidth
          required
          sx={textFieldSx}
          placeholder="https://github.com/..."
        />
      )}

    {paramsForStrategy.includes('parameters') && (
        <ParamCreator params={params} setParams={setParams}/>
    )}
    <StyledButton
        fullWidth
        onClick={() => onRunStrategy()}
    >
        Run Strategy
    </StyledButton>
    </Box>
  );
};

export default Information;
