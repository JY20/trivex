import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const Loading = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(3, 37, 65, 0.3)', 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        zIndex: 9999,
        opacity: 0,
        animation: 'fadeIn 0.3s ease forwards',
        '@keyframes fadeIn': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 }
        }
      }}
    >
      {/* 加载动画 */}
      <CircularProgress size={80} thickness={4.5} sx={{ color: '#1e88e5' }} />

      {/* 加载提示文本 （效果不好已移除）*/}
      {/* <Typography
        variant="h6"
        sx={{
          color: '#64b5f6', 
          marginTop: '20px',
          fontWeight: 'bold',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          animation: 'pulse 1.2s infinite ease-in-out',
          '@keyframes pulse': {
            '0%': { opacity: 0.6 },
            '50%': { opacity: 1 },
            '100%': { opacity: 0.6 }
          }
        }}
      >
        Loading, please wait...
      </Typography> */}
    </Box>
  );
};

export default Loading;
