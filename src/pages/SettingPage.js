import React from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const SettingsPage = () => {

    const transactions = [
        { date: '2025-01-01', type: 'Deposit', amount: 2000 },
        { date: '2025-01-05', type: 'Withdrawal', amount: 500 },
    ];
    
    const portfolio = [
        { symbol: 'BTC', quantity: 0.5, currentValue: 15000 },
        { symbol: 'ETH', quantity: 2, currentValue: 3000 },
    ];
    

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
                maxWidth: '50%'
            }}
            >
            <Typography variant="h6" fontWeight="bold">
                Balance
            </Typography>
            <Typography variant="h4" color="primary" fontWeight="bold" sx={{ marginTop: '10px' }}>
                $10,000
            </Typography>

            <Typography variant="h6" fontWeight="bold" sx={{ marginBottom: '10px' }}>
                Deposit and Withdrawal
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                <Button variant="contained" color="primary" sx={{ flex: 1 }}>
                    Deposit
                </Button>
                <Button variant="contained" color="secondary" sx={{ flex: 1 }}>
                    Withdraw
                </Button>
            </Box>

            <Typography variant="h6" fontWeight="bold" sx={{ marginBottom: '20px' }}>
                Transactions
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Date</strong></TableCell>
                            <TableCell align="right"><strong>Type</strong></TableCell>
                            <TableCell align="right"><strong>Amount</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transactions.map((transaction, index) => (
                            <TableRow key={index}>
                                <TableCell>{transaction.date}</TableCell>
                                <TableCell align="right">{transaction.type}</TableCell>
                                <TableCell align="right">${transaction.amount}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Typography variant="h6" fontWeight="bold" sx={{ marginBottom: '20px' }}>
                Portfolio
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Symbol</strong></TableCell>
                            <TableCell align="right"><strong>Quantity</strong></TableCell>
                            <TableCell align="right"><strong>Current Value</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {portfolio.map((asset, index) => (
                            <TableRow key={index}>
                                <TableCell>{asset.symbol}</TableCell>
                                <TableCell align="right">{asset.quantity}</TableCell>
                                <TableCell align="right">${asset.currentValue}</TableCell>
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
