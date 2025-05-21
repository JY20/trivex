import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  TextField,
  Button,
  Typography,
  Box
} from "@mui/material";
import { styled } from '@mui/material/styles';

// Styled button component to match the Buy button
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

const OutlinedButton = styled(Button)(({ theme }) => ({
  background: 'transparent',
  color: '#B19EE3',
  fontWeight: 'bold',
  borderRadius: '12px',
  border: '1px solid rgba(126, 87, 194, 0.4)',
  transition: 'all 0.3s ease',
  textTransform: 'none',
  '&:hover': { 
    background: 'rgba(126, 87, 194, 0.1)',
    borderColor: '#9B6DFF',
    color: '#FFFFFF',
    transform: 'translateY(-2px)'
  }
}));

const StakePopup = ({ open, onClose, balance = 0, handleDeposit }) => {
    const [depositAmount, setDepositAmount] = useState("");

    const handleMax = () => {
        setDepositAmount(balance);
    };

    const handleConfirmDeposit = () => {
        const amount = parseFloat(depositAmount);
        if (isNaN(amount) || amount < 0) {
        alert("Please enter a valid deposit amount.");
        return;
        }
        handleDeposit(amount);
        onClose();
    };


    return (
        <Dialog 
          open={open} 
          onClose={onClose} 
          maxWidth="sm" 
          fullWidth
          PaperProps={{
            sx: {
              backgroundColor: 'rgba(28, 25, 38, 0.95)',
              backgroundImage: 'linear-gradient(rgba(147, 112, 219, 0.05), rgba(41, 21, 71, 0.1))',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(147, 112, 219, 0.2)',
              borderRadius: '16px'
            }
          }}
        >
        <DialogContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: '#FFFFFF' }}>
            Stake
            </Typography>
            <Box
            sx={{
                display: "flex",
                alignItems: "center",
                background: "rgba(28, 25, 38, 0.7)",
                mb: 3,
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                border: '1px solid rgba(147, 112, 219, 0.3)',
                borderRadius: '8px',
            }}
            >
            <TextField
                variant="outlined"
                placeholder="0"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                type="number"
                fullWidth
                sx={{ 
                  '& .MuiOutlinedInput-root': { 
                    border: 'none',
                    '& fieldset': {
                      borderColor: 'transparent',
                    },
                    '&:hover fieldset': {
                      borderColor: 'transparent',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'transparent',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: '#FFFFFF',
                  }
                }}
                InputProps={{
                style: {
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                },
                }}
            />
            </Box>
            <Box
            sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                mb: 2,
                gap: 1,
            }}
            >
            <Typography variant="body2" sx={{ color: '#B19EE3' }}>
                Balance: {balance} USD
            </Typography>
            <Button 
              onClick={handleMax} 
              size="small" 
              sx={{ 
                textTransform: "none", 
                color: '#9B6DFF',
                '&:hover': {
                  backgroundColor: 'rgba(155, 109, 255, 0.1)',
                }
              }}
            >
                Max
            </Button>
            </Box>

            <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 2,
            }}
            >
            <OutlinedButton
                onClick={onClose}
                fullWidth
            >
                Cancel
            </OutlinedButton>
            <StyledButton
                onClick={handleConfirmDeposit}
                fullWidth
            >
                Deposit
            </StyledButton>
            </Box>
        </DialogContent>
        </Dialog>
    );
};
  
export default StakePopup;
