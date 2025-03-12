import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab
} from '@mui/material';
import axios from 'axios';

const CloseOrder = ({ positions, handleCloseOrder, walletAddress }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async (address) => {
    try {
      const response = await axios.get(`http://2660-2001-1970-51a3-8f00-00-c11.ngrok-free.app/wallets/${address}/transactions`);
      const transactionData = response.data.map(item => ({
        transaction_id: item.transaction_id,
        action: item.action,
        symbol: item.symbol,
        quantity: parseFloat(item.quantity),
        average_price: parseFloat(item.average_price),
        last_updated: item.last_updated,
      }));
      setTransactions(transactionData);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  useEffect(() => {
    if (walletAddress) {
      fetchTransactions(walletAddress);
    }
  }, [walletAddress]);


  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box
      sx={{
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#f1f1f1',
        borderRadius: '8px',
        margin: '20px auto'
      }}
    >
      {/* Tabs 组件 */}
      <Tabs value={activeTab} onChange={handleTabChange} centered>
        <Tab label="Positions" />
        <Tab label="Transactions" />
      </Tabs>

      {/* Positions Tab 内容 */}
      {activeTab === 0 && (
        <Box sx={{ marginTop: '20px' }}>
          <Typography variant="h5" sx={{ marginBottom: '20px' }}>
            Positions
          </Typography>
          <TableContainer component={Paper} sx={{ maxHeight: 200, overflowY: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Portfolio ID</strong></TableCell>
                  <TableCell><strong>Sector</strong></TableCell>
                  <TableCell><strong>Symbol</strong></TableCell>
                  <TableCell align="right"><strong>Quantity</strong></TableCell>
                  <TableCell align="right"><strong>Average Price</strong></TableCell>
                  <TableCell align="center"><strong>Action</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {positions.map((position, index) => (
                  <TableRow key={index}>
                    <TableCell>{position.portfolio_id}</TableCell>
                    <TableCell>{position.sector}</TableCell>
                    <TableCell>{position.symbol}</TableCell>
                    <TableCell align="right">{position.quantity}</TableCell>
                    <TableCell align="right">{position.average_price}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: '#fa7070',
                          '&:hover': {
                            backgroundColor: '#e65e5e',
                          },
                        }}
                        onClick={() => handleCloseOrder(position)}
                      >
                        Close
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Transactions Tab 内容 */}
      {activeTab === 1 && (
        <Box sx={{ marginTop: '20px' }}>
          <Typography variant="h5" sx={{ marginBottom: '20px' }}>
            Transaction History
          </Typography>
          <TableContainer component={Paper} sx={{ maxHeight: 300, overflowY: 'auto' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Transaction ID</strong></TableCell>
                  <TableCell align="right"><strong>Action</strong></TableCell>
                  <TableCell align="right"><strong>Symbol</strong></TableCell>
                  <TableCell align="right"><strong>Quantity</strong></TableCell>
                  <TableCell align="right"><strong>Average Price</strong></TableCell>
                  <TableCell align="right"><strong>Timestamp</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.transaction_id}</TableCell>
                    <TableCell align="right">{item.action}</TableCell>
                    <TableCell align="right">{item.symbol}</TableCell>
                    <TableCell align="right">{item.quantity}</TableCell>
                    <TableCell align="right">${item.average_price}</TableCell>
                    <TableCell align="right">
                      {new Date(item.last_updated).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
};

export default CloseOrder;
