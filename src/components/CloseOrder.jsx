import React from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const CloseOrder = ({ positions, handleCloseOrder }) => {
  console.log(positions);
  return (
    <Box sx={{ maxWidth: '50%', marginTop: '30px', padding: '20px', backgroundColor: '#f1f1f1', borderRadius: '8px', margin: '20px auto' }}>
      <Typography variant="h5" sx={{ marginBottom: '20px' }}>
        Positions
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
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
  );
};

export default CloseOrder;
