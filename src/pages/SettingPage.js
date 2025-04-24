import React, { useState, useEffect , useContext} from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import axios from 'axios';
import {AppContext} from '../components/AppProvider';
import { Connected} from '../components/Alert';
import { AppContract } from '../components/AppContract';

const SettingsPage = () => {

    const info = useContext(AppContext);
    const [position, setPosition] = useState([]); 
    const [transaction, setTransaction] = useState([]); 
    const [balance, setBalance] = useState(0);
    const [points, setPoints] = useState(0);
    const host = "trivex-trade-faekh0awhkdphxhq.canadacentral-01.azurewebsites.net";

    const contract =  new AppContract();
    
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

    const fetchPoints= async (address) => {
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
    

    const refreshData =  async () => {
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
                        maxWidth: '70%'
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <Typography variant="h6" fontWeight="bold">
                            Balance
                        </Typography>
                        <Typography variant="h6" fontWeight="bold">
                            Points
                        </Typography>
                        <IconButton sx={{ color: '#7E57C2' }} onClick={refreshData}>
                            <RefreshIcon />
                        </IconButton>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <Typography variant="h4" fontWeight="bold" sx={{ color: '#7E57C2' }}>
                            {balance} USD
                        </Typography>
                        <Typography variant="h4" fontWeight="bold" sx={{ color: '#7E57C2' }}>
                            {points.toFixed(0)} Points
                        </Typography>
                        <Typography/>
                    </Box>

    
                    <Typography variant="h6" fontWeight="bold" sx={{ marginBottom: '20px' }}>
                        Portfolio
                    </Typography>
                    <TableContainer component={Paper} sx={{marginBottom: '20px', maxHeight: 300, overflowY: 'auto' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>Symbol</strong></TableCell>
                                    <TableCell><strong>Quantity</strong></TableCell>
                                    <TableCell><strong>Average Price</strong></TableCell>
                                    <TableCell><strong>Leverage</strong></TableCell>
                                    <TableCell><strong>Total Value</strong></TableCell>
                                    <TableCell><strong>Action</strong></TableCell>
                                    <TableCell><strong>Date-Time</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {position.map((position, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{position.symbol}</TableCell>
                                        <TableCell>{position.quantity}</TableCell>
                                        <TableCell>{position.average_price}</TableCell>
                                        <TableCell>{position.leverage}</TableCell>
                                        <TableCell>{position.total_value}</TableCell>
                                        <TableCell>{position.action}</TableCell>
                                        <TableCell>{position.datetime.toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
    
                    <Typography variant="h6" fontWeight="bold" sx={{ marginBottom: '20px' }}>
                        Transactions
                    </Typography>
                    <TableContainer component={Paper} sx={{marginBottom: '20px', maxHeight: 300, overflowY: 'auto' }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>Symbol</strong></TableCell>
                                    <TableCell><strong>Quantity</strong></TableCell>
                                    <TableCell><strong>Average Price</strong></TableCell>
                                    <TableCell><strong>Leverage</strong></TableCell>
                                    <TableCell><strong>Total Value</strong></TableCell>
                                    <TableCell><strong>Action</strong></TableCell>
                                    <TableCell><strong>Date-Time</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {transaction.slice().reverse().map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{item.symbol}</TableCell>
                                        <TableCell>{item.quantity}</TableCell>
                                        <TableCell>{item.average_price}</TableCell>
                                        <TableCell>{item.leverage}</TableCell>
                                        <TableCell>{item.total_value}</TableCell>
                                        <TableCell>{item.action}</TableCell>
                                        <TableCell>{item.datetime.toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>
        );
    }else{
        return <Connected/>
    }
};

export default SettingsPage;
