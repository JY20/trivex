import React from 'react';
import {Typography, Box} from '@mui/material';

export const Connected = () => {
  return (
    <Box
        sx={{
            height: '80vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
        }}
    >
        <Typography
            variant="h6"
            color="error"
            sx={{
                fontSize: '2vw', 
            }}
            gutterBottom
        >
            Please connect your wallet to access the application.
        </Typography>
    </Box>
  );
};

export const Whitelisted = () => {
  return (
    <Box
        sx={{
            height: '80vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
        }}
    >
        <Typography
            variant="h6"
            color="warning"
            sx={{
                fontSize: '2vw', 
            }}
            gutterBottom
        >
            Your wallet is not on the whitelist.
        </Typography>
    </Box>
  );
};
