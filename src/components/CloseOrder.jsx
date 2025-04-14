import React, { useState } from 'react';
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

const CloseOrder = ({ positions, transactions, handleCloseOrder }) => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleTradeWithLoading = async (position) => {
    try {
      setLoading(true);
      await handleCloseOrder(position);
    } finally {
      setLoading(false);
    }
  };

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
    </>
  );
};

export default CloseOrder;
