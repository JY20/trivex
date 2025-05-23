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
import { styled } from '@mui/material/styles';

// Styled components
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  background: 'rgba(28, 25, 38, 0.5)',
  borderRadius: '16px',
  border: '1px solid rgba(126, 87, 194, 0.2)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
  height: 300,
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'rgba(28, 25, 38, 0.3)',
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'rgba(126, 87, 194, 0.5)',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: 'rgba(155, 109, 255, 0.7)',
  },
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  '& .MuiTableCell-root': {
    backgroundColor: 'rgba(28, 25, 38, 0.8)',
    color: '#FFFFFF',
    borderBottom: '1px solid rgba(126, 87, 194, 0.3)',
    fontWeight: 'bold',
  }
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  color: '#B19EE3',
  borderBottom: '1px solid rgba(126, 87, 194, 0.2)',
  padding: '12px 16px',
}));

const StyledCloseButton = styled(Button)(({ theme }) => ({
  background: 'rgba(220, 53, 69, 0.7)',
  color: '#FFFFFF',
  borderRadius: '8px',
  fontWeight: 'bold',
  transition: 'all 0.3s ease',
  textTransform: 'none',
  '&:hover': {
    background: 'rgba(220, 53, 69, 0.9)',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(220, 53, 69, 0.3)',
  }
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  color: '#B19EE3',
  textTransform: 'none',
  fontSize: '1rem',
  fontWeight: 'bold',
  transition: 'all 0.3s ease',
  minWidth: '120px',
  '&.Mui-selected': {
    color: '#FFFFFF',
  },
  '&:hover': {
    color: '#FFFFFF',
    opacity: 1,
  }
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  '& .MuiTabs-indicator': {
    backgroundColor: '#9B6DFF',
    height: '3px',
  },
  borderBottom: '1px solid rgba(126, 87, 194, 0.2)',
  marginBottom: '20px',
}));

const OrdersBox = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(28, 25, 38, 0.5)',
  border: '1px solid rgba(126, 87, 194, 0.2)',
  borderRadius: '16px',
  padding: theme.spacing(3),
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
}));

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

      <OrdersBox>
        <StyledTabs 
          value={activeTab} 
          onChange={handleTabChange} 
          variant="scrollable"
        >
          <StyledTab label="Positions" />
          <StyledTab label="Transactions" />
        </StyledTabs>

        {activeTab === 0 && (
          <Box>
            <StyledTableContainer>
              <Table stickyHeader>
                <StyledTableHead>
                  <TableRow>
                    <TableCell>Symbol</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Average Price</TableCell>
                    <TableCell>Leverage</TableCell>
                    <TableCell>Total Value</TableCell>
                    <TableCell>Action</TableCell>
                    <TableCell>Date-Time</TableCell>
                    <TableCell align="center">Close</TableCell>
                  </TableRow>
                </StyledTableHead>
                <TableBody>
                  {positions.map((position, index) => (
                    <TableRow key={index} sx={{ 
                      '&:hover': { 
                        backgroundColor: 'rgba(126, 87, 194, 0.1)',
                      }
                    }}>
                      <StyledTableCell>{position.symbol}</StyledTableCell>
                      <StyledTableCell>{position.quantity}</StyledTableCell>
                      <StyledTableCell>{position.average_price}</StyledTableCell>
                      <StyledTableCell>{position.leverage}</StyledTableCell>
                      <StyledTableCell>{position.total_value}</StyledTableCell>
                      <StyledTableCell>{position.action}</StyledTableCell>
                      <StyledTableCell>{position.datetime.toLocaleString()}</StyledTableCell>
                      <StyledTableCell align="center">
                        <StyledCloseButton
                          onClick={() => handleTradeWithLoading(position)}
                          disabled={loading}
                        >
                          Close
                        </StyledCloseButton>
                      </StyledTableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </StyledTableContainer>
          </Box>
        )}

        {activeTab === 1 && (
          <Box>
            <StyledTableContainer>
              <Table stickyHeader>
                <StyledTableHead>
                  <TableRow>
                    <TableCell>Symbol</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Average Price</TableCell>
                    <TableCell>Leverage</TableCell>
                    <TableCell>Total Value</TableCell>
                    <TableCell>Action</TableCell>
                    <TableCell>Date-Time</TableCell>
                  </TableRow>
                </StyledTableHead>
                <TableBody>
                  {transactions.slice().reverse().map((item, index) => (
                    <TableRow key={index} sx={{ 
                      '&:hover': { 
                        backgroundColor: 'rgba(126, 87, 194, 0.1)',
                      }
                    }}>
                      <StyledTableCell>{item.symbol}</StyledTableCell>
                      <StyledTableCell>{item.quantity}</StyledTableCell>
                      <StyledTableCell>{item.average_price}</StyledTableCell>
                      <StyledTableCell>{item.leverage}</StyledTableCell>
                      <StyledTableCell>{item.total_value}</StyledTableCell>
                      <StyledTableCell>{item.action}</StyledTableCell>
                      <StyledTableCell>{item.datetime.toLocaleString()}</StyledTableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </StyledTableContainer>
          </Box>
        )}
      </OrdersBox>
    </>
  );
};

export default CloseOrder;
