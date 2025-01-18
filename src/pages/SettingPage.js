import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import axios from 'axios';

const SettingsPage = () => {
    const [portfolio, setPortfolio] = useState([]); 
    const [transaction, setTransaction] = useState([]); 
    const [balance, setBalance] = useState(0);
    
    const userWalletAddress = '0x123abc456def789ghi';
    const host = "localhost:8080";

    const fetchBalance = async (address) => {
        try {
          const response = await axios.get(`http://${host}/wallets/${address}/balances`);
    
          const currnet_balances = response.data; 
          const accountValue = parseFloat(currnet_balances[0].amount || 0);
          setBalance(accountValue);
        } catch (error) {
          console.error('Error fetching balance:', error);
        }
      };

    const fetchPortfolio = async (address) => {
        try {
            const response = await axios.get(`http://${host}/wallets/${userWalletAddress}/portfolio`);
            const portfolioData = response.data.map(item => ({
                address: item.address,
                symbol: item.symbol,
                quantity: parseFloat(item.quantity),
                average_price: parseFloat(item.average_price),
            }));
            setPortfolio(portfolioData);
        } catch (error) {
            console.error('Error fetching portfolio:', error);
        }
    };

    const fetchTransactions = async (address) => {
        try {
            const response = await axios.get(`http://${host}/wallets/${userWalletAddress}/transactions`);
            const transactionData = response.data.map(item => ({
                transaction_id: parseInt(item.transaction_id),
                type: item.type,
                symbol: item.symbol,
                amount: parseFloat(item.amount),
                price: parseFloat(item.price),
                timestamp: item.timestamp,
            }));
            setTransaction(transactionData);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    const refreshData = () => {
        fetchBalance(userWalletAddress);
        fetchPortfolio(userWalletAddress);
        fetchTransactions(userWalletAddress);
    };

    useEffect(() => {
        refreshData(); // Fetch data when the component mounts
    }, []);

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
                    margin: '0 auto',
                    background: '#fff',
                    padding: '30px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    maxWidth: '50%'
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <Typography variant="h6" fontWeight="bold">
                        Balance
                    </Typography>
                    <IconButton sx={{color: '#7E57C2'}} onClick={refreshData}>
                        <RefreshIcon />
                    </IconButton>
                </Box>
                <Typography variant="h4" fontWeight="bold" sx={{ marginTop: '10px', marginBottom: '20px',  color: '#7E57C2'}}>
                    {balance.toFixed(2)} USD
                </Typography>

                <Typography variant="h6" fontWeight="bold" sx={{ marginBottom: '10px' }}>
                    Deposit and Withdrawal
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                    <Button variant="contained" sx={{ flex: 1, backgroundColor: '#7E57C2', marginBottom: '20px'}}>
                        Deposit
                    </Button>
                    <Button
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    sx={{ flex: 1}}
                    >
                        Withdraw
                    </Button>
                </Box>

                <Typography variant="h6" fontWeight="bold" sx={{ marginBottom: '20px' }}>
                    Portfolio
                </Typography>
                <TableContainer component={Paper} sx={{marginBottom: '20px'}}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Symbol</strong></TableCell>
                                <TableCell align="right"><strong>Quantity</strong></TableCell>
                                <TableCell align="right"><strong>Average Price</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {portfolio.map((asset, index) => (
                                <TableRow key={index}>
                                    <TableCell>{asset.symbol}</TableCell>
                                    <TableCell align="right">{asset.quantity}</TableCell>
                                    <TableCell align="right">{asset.average_price}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Typography variant="h6" fontWeight="bold" sx={{ marginBottom: '20px' }}>
                    Transactions
                </Typography>
                <TableContainer component={Paper} sx={{ maxHeight: 300, overflowY: 'auto' }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Transaction ID</strong></TableCell>
                                <TableCell align="right"><strong>Type</strong></TableCell>
                                <TableCell align="right"><strong>Symbol</strong></TableCell>
                                <TableCell align="right"><strong>Amount</strong></TableCell>
                                <TableCell align="right"><strong>Price</strong></TableCell>
                                <TableCell align="right"><strong>Timestamp</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {transaction.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>{item.transaction_id}</TableCell>
                                    <TableCell align="right">{item.type}</TableCell>
                                    <TableCell align="right">{item.symbol}</TableCell>
                                    <TableCell align="right">${item.amount}</TableCell>
                                    <TableCell align="right">${item.price}</TableCell>
                                    <TableCell align="right">{new Date(item.timestamp).toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

            </Box>
        </Box>
    );
};

export default SettingsPage;
