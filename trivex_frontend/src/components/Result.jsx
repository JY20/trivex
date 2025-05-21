import React, { useState } from 'react';
import {
  Box, Typography, List, ListItem, ListItemText,
  Tabs, Tab, TableContainer, Table, TableHead, TableRow, TableCell,
  TableBody, Paper
} from '@mui/material';

const ResultsAndHistory = ({ results, history }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box
      sx={{
        marginTop: '20px',
        padding: '20px',
        backgroundColor: 'rgba(28, 25, 38, 0.5)',
        borderRadius: '8px',
        margin: '20px auto',
        border: '1px solid rgba(147, 112, 219, 0.3)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
        height: 'calc(40vh - 16px)'
      }}
    >
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        sx={{ 
          display: 'flex', 
          justifyContent: 'flex-start', 
          alignItems: 'flex-start',
          '& .MuiTabs-indicator': {
            backgroundColor: '#9C27B0',
          }
        }}
        variant="scrollable"
      >
        <Tab 
          label="Results" 
          sx={{ 
            textTransform: 'none', 
            fontSize: '1.1rem', 
            fontWeight: 'bold', 
            color: '#FFFFFF',
            '&.Mui-selected': {
              color: '#BB86FC',
            }
          }} 
        />
        <Tab 
          label="History" 
          sx={{ 
            textTransform: 'none', 
            fontSize: '1.1rem', 
            fontWeight: 'bold', 
            color: '#FFFFFF',
            '&.Mui-selected': {
              color: '#BB86FC',
            }
          }} 
        />
      </Tabs>

      {activeTab === 0 && (
        <Box sx={{ marginTop: '20px' }}>
          {results ? (
            typeof results === 'object' ? (
              <List sx={{ color: '#FFFFFF' }}>
                {Object.entries(results).map(([key, value], index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={<Typography sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>{key.toString()}</Typography>}
                      secondary={<Typography sx={{ color: '#BB86FC' }}>{value.toString()}</Typography>}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography sx={{ color: '#FFFFFF' }}>{results}</Typography>
            )
          ) : (
            <Typography sx={{ color: '#FFFFFF' }}>No results available.</Typography>
          )}
        </Box>
      )}

      {activeTab === 1 && (
        <Box sx={{ marginTop: '20px' }}>
          <TableContainer 
            component={Paper} 
            sx={{ 
              height: 250, 
              overflowY: 'auto',
              backgroundColor: 'transparent',
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
                    <strong>Strategy</strong>
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
                    <strong>Time</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {history && history.length > 0 ? (
                  history.slice().reverse().map((entry, index) => (
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
                      <TableCell sx={{ color: '#FFFFFF' }}>{history.length - index}</TableCell>
                      <TableCell sx={{ color: '#FFFFFF' }}>{entry.strategy}</TableCell>
                      <TableCell sx={{ color: '#FFFFFF' }}>{entry.amount}</TableCell>
                      <TableCell sx={{ color: '#FFFFFF' }}>{new Date(entry.datetime).toLocaleString()}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ color: '#FFFFFF' }}>No history available.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
};

export default ResultsAndHistory;
