import React from 'react';
import { Typography, Box, Paper, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const GlassCard = styled(Paper)(({ theme }) => ({
    background: 'rgba(28, 25, 38, 0.85)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    border: '1px solid rgba(126, 87, 194, 0.3)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
    padding: theme.spacing(4),
    maxWidth: '500px',
    width: '90%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(3),
}));

const WalletIcon = styled(AccountBalanceWalletIcon)(({ theme }) => ({
    fontSize: '4rem',
    color: '#9B6DFF',
    filter: 'drop-shadow(0 0 8px rgba(155, 109, 255, 0.5))',
}));

export const Connected = () => {
  return (
    <Box
        sx={{
            height: '80vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            background: 'linear-gradient(135deg, #2A0F55 0%, #1A0033 100%)',
        }}
    >
        <GlassCard elevation={3}>
            <WalletIcon />
            <Typography
                variant="h5"
                sx={{
                    color: '#FFFFFF',
                    fontWeight: 'bold',
                    marginBottom: 1,
                }}
            >
                Connect Your Wallet
            </Typography>
            <Typography
                variant="body1"
                sx={{
                    color: '#B19EE3',
                    marginBottom: 3,
                }}
            >
                Please connect your wallet to access all features of the Trivex platform.
            </Typography>
        </GlassCard>
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
            background: 'linear-gradient(135deg, #2A0F55 0%, #1A0033 100%)',
        }}
    >
        <GlassCard elevation={3}>
            <Typography
                variant="h5"
                sx={{
                    color: '#FFFFFF',
                    fontWeight: 'bold',
                    marginBottom: 1,
                }}
            >
                Wallet Not Whitelisted
            </Typography>
            <Typography
                variant="body1"
                sx={{
                    color: '#B19EE3',
                    marginBottom: 2,
                }}
            >
                Your wallet is not on the whitelist. Please contact support for assistance.
            </Typography>
        </GlassCard>
    </Box>
  );
};
