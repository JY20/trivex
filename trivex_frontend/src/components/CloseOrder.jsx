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
import Loading from './Loading';

const CloseOrder = ({ positions, transactions, handleCloseOrder, refreshData}) => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleTradeWithLoading = async (position) => {
    try {
      setLoading(true);
      await handleCloseOrder(position);
      await refreshData();
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   console.log('Positions prop updated:', positions);
  // }, [positions]);
  
  // useEffect(() => {
  //   console.log('Transactions prop updated:', transactions);
  // }, [transactions]);
  

  return (
    <>
      {loading && <Loading />}

      <Box
        sx={{
          marginTop: '30px',
          padding: '20px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          margin: '20px auto',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          sx={{ display: "flex", justifyContent: "flex-start", alignItems: "flex-start" }} 
          variant="scrollable"
        >
          <Tab label="Positions" sx={{ textTransform: "none", fontSize: "1.1rem", fontWeight: "bold", color: "black" }} />
          <Tab label="Transactions" sx={{ textTransform: "none", fontSize: "1.1rem", fontWeight: "bold", color: "black" }} />
        </Tabs>

        {activeTab === 0 && (
          <Box sx={{ marginTop: '20px' }}>
            <TableContainer component={Paper} sx={{ height: 200, overflowY: 'auto' }}>
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
                    <TableCell align="center"><strong>Close</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {positions.map((position, index) => (
                    <TableRow key={index}>
                      <TableCell>{position.symbol}</TableCell>
                      <TableCell>{position.quantity}</TableCell>
                      <TableCell>{position.average_price}</TableCell>
                      <TableCell>{position.leverage}</TableCell>
                      <TableCell>{position.total_value}</TableCell>
                      <TableCell>{position.action}</TableCell>
                      <TableCell>{position.datetime.toLocaleString()}</TableCell>
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: '#fa7070',
                            '&:hover': {
                              backgroundColor: '#e65e5e',
                            },
                          }}
                          onClick={() => handleTradeWithLoading(position)}
                          disabled={loading}
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

        {activeTab === 1 && (
          <Box sx={{ marginTop: '20px' }}>
            <TableContainer component={Paper} sx={{ height: 200, overflowY: 'auto' }}>
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
                  {transactions.slice().reverse().map((item, index) => (
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
        )}
      </Box>
    </>
  );
};

export default CloseOrder;
