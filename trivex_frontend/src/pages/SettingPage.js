import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Grid, Card } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import HistoryIcon from '@mui/icons-material/History';
import WorkIcon from '@mui/icons-material/Work';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { AppContext } from '../components/AppProvider';
import { Connected } from '../components/Alert';
import { AppContract } from '../components/AppContract';

// Styled components for a more modern UI
const PageContainer = styled(Box)(({ theme }) => ({
    background: 'linear-gradient(135deg, #2A0F55 0%, #1A0033 100%)',
    padding: theme.spacing(3),
    minHeight: 'calc(100vh - 140px)',
}));

const GlassCard = styled(Card)(({ theme }) => ({
    background: 'rgba(28, 25, 38, 0.75)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    border: '1px solid rgba(126, 87, 194, 0.2)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
    padding: theme.spacing(3),
    height: '100%',
    transition: 'all 0.3s ease',
    '&:hover': {
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
    },
}));

const StyledButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(135deg, #9B6DFF 0%, #6A4BA1 100%)',
    color: 'white',
    fontWeight: 'bold',
    borderRadius: '12px',
    padding: '10px 20px',
    transition: 'all 0.3s ease',
    textTransform: 'none',
    boxShadow: '0 4px 20px rgba(106, 75, 161, 0.25)',
    '&:hover': { 
        boxShadow: '0 6px 25px rgba(106, 75, 161, 0.4)',
        transform: 'translateY(-2px)'
    },
}));

const StatsCard = styled(Box)(({ theme }) => ({
    background: 'rgba(28, 25, 38, 0.5)',
    borderRadius: '12px',
    border: '1px solid rgba(126, 87, 194, 0.2)',
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
}));

const IconWrapper = styled(Box)(({ theme, color }) => ({
    background: `rgba(${color}, 0.2)`,
    borderRadius: '12px',
    padding: theme.spacing(1.5),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
}));

const SettingsPage = () => {
    const info = useContext(AppContext);
    const [position, setPosition] = useState([]); 
    const [transaction, setTransaction] = useState([]); 
    const [balance, setBalance] = useState(0);
    const [points, setPoints] = useState(0);
    const host = "trivex-trade-faekh0awhkdphxhq.canadacentral-01.azurewebsites.net";

    const contract = new AppContract();
    
    const handlePositions = async (address) => {
        try {
          console.log("Fetching portfolio...");
          const results = await contract.getPositions(address);
          console.log(results);
          setPosition(results);
        } catch (error) {
          console.error('Error fetching portfolio:', error);
        }
    };
    
    const handleTransactions = async (address) => {
        try {
          console.log("Fetching transaction history...");
          const results = await contract.getTransactions(address);
          console.log(results);
          setTransaction(results);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    const fetchPoints = async (address) => {
        try {
            const response = await axios.get(`https://${host}/wallets/${address}/points`);
            const current_points = response.data; 
            if (current_points && current_points.length > 0) {
                const accountValue = parseFloat(current_points[0].amount || 0);
                setPoints(accountValue);
            } else {
                setPoints(0);
            }
        } catch (error) {
            console.error('Error fetching balance:', error);
        }
    };

    const getBalance = async () => {
        try {
            const result = await contract.getWalletBalance(info.walletAddress);
            setBalance(result);
        } catch (error) {
            console.error("Error fetching wallet balance:", error);
            setBalance(0);
        }
    };
    
    const refreshData = async () => {
        handlePositions(info.walletAddress);
        handleTransactions(info.walletAddress);
        fetchPoints(info.walletAddress);
        getBalance();
        info.setRouteTrigger(true);
    };

    useEffect(() => {
        if (info.walletAddress && !info.routeTrigger) {
            refreshData();
        }
    }, [info, refreshData]);

    if(info.walletAddress != null){
        return (
            <PageContainer>
                <Box sx={{ maxWidth: '1400px', mx: 'auto', p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                        <Typography variant="h4" sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>
                            Dashboard
                        </Typography>
                        <StyledButton 
                            startIcon={<RefreshIcon />}
                            onClick={refreshData}
                        >
                            Refresh
                        </StyledButton>
                    </Box>

                    {/* Stats Cards */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} md={6}>
                            <StatsCard>
                                <IconWrapper color="155, 109, 255">
                                    <AccountBalanceWalletIcon sx={{ color: '#9B6DFF', fontSize: '2rem' }} />
                                </IconWrapper>
                                <Box>
                                    <Typography variant="body2" sx={{ color: '#B19EE3' }}>
                                        Wallet Balance
                                    </Typography>
                                    <Typography variant="h5" sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>
                                        {balance} USD
                                    </Typography>
                                </Box>
                            </StatsCard>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <StatsCard>
                                <IconWrapper color="126, 87, 194">
                                    <EmojiEventsIcon sx={{ color: '#7E57C2', fontSize: '2rem' }} />
                                </IconWrapper>
                                <Box>
                                    <Typography variant="body2" sx={{ color: '#B19EE3' }}>
                                        Total Points
                                    </Typography>
                                    <Typography variant="h5" sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>
                                        {points.toFixed(0)} Points
                                    </Typography>
                                </Box>
                            </StatsCard>
                        </Grid>
                    </Grid>

                    {/* Portfolio Section */}
                    <Grid container spacing={3}>
                        <Grid item xs={12} lg={6}>
                            <GlassCard>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
                                    <WorkIcon sx={{ color: '#9B6DFF', fontSize: '1.8rem' }} />
                                    <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>
                                        Portfolio
                                    </Typography>
                                </Box>
                                <TableContainer sx={{ maxHeight: 400, overflowY: 'auto' }}>
                                    <Table stickyHeader>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ backgroundColor: 'rgba(28, 25, 38, 0.8)', color: '#FFFFFF' }}>
                                                    <strong>Symbol</strong>
                                                </TableCell>
                                                <TableCell sx={{ backgroundColor: 'rgba(28, 25, 38, 0.8)', color: '#FFFFFF' }}>
                                                    <strong>Quantity</strong>
                                                </TableCell>
                                                <TableCell sx={{ backgroundColor: 'rgba(28, 25, 38, 0.8)', color: '#FFFFFF' }}>
                                                    <strong>Price</strong>
                                                </TableCell>
                                                <TableCell sx={{ backgroundColor: 'rgba(28, 25, 38, 0.8)', color: '#FFFFFF' }}>
                                                    <strong>Leverage</strong>
                                                </TableCell>
                                                <TableCell sx={{ backgroundColor: 'rgba(28, 25, 38, 0.8)', color: '#FFFFFF' }}>
                                                    <strong>Value</strong>
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {position.map((pos, index) => (
                                                <TableRow 
                                                    key={index}
                                                    sx={{
                                                        '&:nth-of-type(odd)': {
                                                            backgroundColor: 'rgba(28, 25, 38, 0.3)',
                                                        },
                                                        '&:nth-of-type(even)': {
                                                            backgroundColor: 'rgba(28, 25, 38, 0.5)',
                                                        },
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(147, 112, 219, 0.15)',
                                                        }
                                                    }}
                                                >
                                                    <TableCell sx={{ color: '#FFFFFF' }}>{pos.symbol}</TableCell>
                                                    <TableCell sx={{ color: '#FFFFFF' }}>{pos.quantity}</TableCell>
                                                    <TableCell sx={{ color: '#FFFFFF' }}>{pos.average_price}</TableCell>
                                                    <TableCell sx={{ color: '#FFFFFF' }}>{pos.leverage}x</TableCell>
                                                    <TableCell sx={{ color: '#FFFFFF' }}>{pos.total_value} USD</TableCell>
                                                </TableRow>
                                            ))}
                                            {position.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={5} sx={{ color: '#B19EE3', textAlign: 'center' }}>
                                                        No positions found
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </GlassCard>
                        </Grid>

                        {/* Transaction History Section */}
                        <Grid item xs={12} lg={6}>
                            <GlassCard>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
                                    <HistoryIcon sx={{ color: '#9B6DFF', fontSize: '1.8rem' }} />
                                    <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>
                                        Transaction History
                                    </Typography>
                                </Box>
                                <TableContainer sx={{ maxHeight: 400, overflowY: 'auto' }}>
                                    <Table stickyHeader>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ backgroundColor: 'rgba(28, 25, 38, 0.8)', color: '#FFFFFF' }}>
                                                    <strong>Action</strong>
                                                </TableCell>
                                                <TableCell sx={{ backgroundColor: 'rgba(28, 25, 38, 0.8)', color: '#FFFFFF' }}>
                                                    <strong>Symbol</strong>
                                                </TableCell>
                                                <TableCell sx={{ backgroundColor: 'rgba(28, 25, 38, 0.8)', color: '#FFFFFF' }}>
                                                    <strong>Amount</strong>
                                                </TableCell>
                                                <TableCell sx={{ backgroundColor: 'rgba(28, 25, 38, 0.8)', color: '#FFFFFF' }}>
                                                    <strong>Date</strong>
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {transaction.slice().reverse().map((tx, index) => (
                                                <TableRow 
                                                    key={index}
                                                    sx={{
                                                        '&:nth-of-type(odd)': {
                                                            backgroundColor: 'rgba(28, 25, 38, 0.3)',
                                                        },
                                                        '&:nth-of-type(even)': {
                                                            backgroundColor: 'rgba(28, 25, 38, 0.5)',
                                                        },
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(147, 112, 219, 0.15)',
                                                        }
                                                    }}
                                                >
                                                    <TableCell sx={{ 
                                                        color: tx.action.includes('Buy') ? '#4CAF50' : 
                                                               tx.action.includes('Sell') ? '#F44336' : '#FFFFFF' 
                                                    }}>
                                                        {tx.action}
                                                    </TableCell>
                                                    <TableCell sx={{ color: '#FFFFFF' }}>{tx.symbol}</TableCell>
                                                    <TableCell sx={{ color: '#FFFFFF' }}>{tx.total_value} USD</TableCell>
                                                    <TableCell sx={{ color: '#FFFFFF' }}>
                                                        {new Date(tx.datetime).toLocaleString()}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            {transaction.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={4} sx={{ color: '#B19EE3', textAlign: 'center' }}>
                                                        No transactions found
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </GlassCard>
                        </Grid>
                    </Grid>
                </Box>
            </PageContainer>
        );
    } else {
        return <Connected/>
    }
};

export default SettingsPage;
