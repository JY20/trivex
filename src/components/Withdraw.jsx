import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  TextField,
  Button,
  Typography,
  Box
} from "@mui/material";

const WithdrawPopup = ({ open, onClose, balance = 0, handleWithdraw }) => {
    const [withdrawAmount, setWithdrawAmount] = useState("");

    const handleMax = () => {
        setWithdrawAmount(balance);
    };

    const handleConfirmWithdraw = () => {
        const amount = parseFloat(withdrawAmount);
        if (isNaN(amount) || amount < 0 || amount > balance) {
            alert("Please enter a valid withdrawal amount.");
            return;
        }
        handleWithdraw(amount);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogContent sx={{ p: 3, backgroundColor: "#f9f9f9" }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                    Withdraw
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        background: "#fff",
                        mb: 3,
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <TextField
                        variant="outlined"
                        placeholder="0"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        type="number"
                        sx={{ flex: 1, "& .MuiOutlinedInput-root": { border: "none" } }}
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
                    <Typography variant="body2" color="textSecondary">
                        Balance: {typeof balance === "number" ? balance : "Invalid balance"} USD
                    </Typography>
                    <Button onClick={handleMax} size="small" sx={{ textTransform: "none" }}>
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
                    <Button
                        onClick={onClose}
                        fullWidth
                        variant="outlined"
                        color="secondary"
                        sx={{ borderRadius: "12px", textTransform: "none" }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmWithdraw}
                        fullWidth
                        variant="contained"
                        sx={{
                            backgroundColor: "#7E57C2",
                            color: "#fff",
                            borderRadius: "12px",
                            textTransform: "none",
                        }}
                    >
                        Withdraw
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default WithdrawPopup;
