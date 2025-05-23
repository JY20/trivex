import React from 'react';
import { Box, Button, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { styled } from '@mui/material/styles';

// Styled button component to match the TradePage Buy button
const StyledButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #9B6DFF 0%, #6A4BA1 100%)',
  color: 'white',
  fontWeight: 'bold',
  borderRadius: '12px',
  transition: 'all 0.3s ease',
  textTransform: 'none',
  boxShadow: '0 4px 20px rgba(106, 75, 161, 0.25)',
  '&:hover': { 
    boxShadow: '0 6px 25px rgba(106, 75, 161, 0.4)',
    transform: 'translateY(-2px)'
  }
}));

const getTagColor = (tag) => {
  switch (tag) {
    case 'Low Frequency':
      return { bg: '#9C27B0', color: '#FFFFFF' };
    case 'Calculator':
      return { bg: '#673AB7', color: '#FFFFFF' };
    default:
      return { bg: '#7E57C2', color: '#FFFFFF' };
  }
};

const Selection = ({ selections, onSelect }) => {
  return (
    <Box
      sx={{
        padding: '20px',
        borderRadius: '8px',
        height: '40vh',
        backgroundColor: 'rgba(28, 25, 38, 0.5)',
        border: '1px solid rgba(147, 112, 219, 0.3)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
        <StyledButton
          startIcon={<AddIcon />}
          onClick={() => onSelect({ value: 'newStrategy' })}
        >
          Create Strategy
        </StyledButton>
      </Box>

      <TableContainer 
        component={Paper} 
        sx={{ 
          maxHeight: '30vh', 
          overflowY: 'auto',
          backgroundColor: 'rgba(28, 25, 38, 0.5)',
          '& .MuiPaper-root': {
            backgroundColor: 'transparent',
          }
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell 
                sx={{ 
                  backgroundColor: 'rgba(28, 25, 38, 0.8)',
                  color: '#FFFFFF'
                }}
              >
                <strong>#</strong>
              </TableCell>
              <TableCell 
                sx={{ 
                  backgroundColor: 'rgba(28, 25, 38, 0.8)',
                  color: '#FFFFFF'
                }}
              >
                <strong>Name</strong>
              </TableCell>
              <TableCell 
                sx={{ 
                  backgroundColor: 'rgba(28, 25, 38, 0.8)',
                  color: '#FFFFFF'
                }}
              >
                <strong>Tag</strong>
              </TableCell>
              <TableCell 
                sx={{ 
                  backgroundColor: 'rgba(28, 25, 38, 0.8)',
                  color: '#FFFFFF'
                }}
              >
                <strong>Cost (STRK)</strong>
              </TableCell>
              <TableCell 
                sx={{ 
                  backgroundColor: 'rgba(28, 25, 38, 0.8)',
                  color: '#FFFFFF'
                }}
              >
                <strong>Creator</strong>
              </TableCell>
              <TableCell 
                align="center"
                sx={{ 
                  backgroundColor: 'rgba(28, 25, 38, 0.8)',
                  color: '#FFFFFF'
                }}
              >
                <strong>Select</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {selections.map((item, index) => {
              const { bg, color } = getTagColor(item.tags);
              return (
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
                    },
                    color: '#FFFFFF'
                  }}
                >
                  <TableCell sx={{ color: '#FFFFFF' }}>{index + 1}</TableCell>
                  <TableCell sx={{ color: '#FFFFFF' }}>{item.label}</TableCell>
                  <TableCell>
                    <Chip
                      label={item.tags}
                      size="small"
                      sx={{
                        backgroundColor: bg,
                        color: color,
                        fontWeight: 'bold',
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: '#FFFFFF' }}>{item.cost}</TableCell>
                  <TableCell sx={{ color: '#FFFFFF' }}>{`${item.creator.slice(0, 2)}...${item.creator.slice(-4)}`}</TableCell>
                  <TableCell align="center">
                    <StyledButton
                      onClick={() => onSelect(item)}
                      size="small"
                    >
                      Select
                    </StyledButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Selection;
