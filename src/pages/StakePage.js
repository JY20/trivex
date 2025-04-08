import React, { useState } from 'react';
import { Grid, Box, Typography, Button, TextField, Paper } from '@mui/material';
import axios from 'axios';

const StakePage = () => {
    const host = "localhost:8080";

    const stakeData = {
        title: "Trading Pool",
        apy: 7 
    };

    const handleStake = () => {
        console.log("Stake button clicked");
    };

    const handleUnstake = () => {
        console.log("Unstake button clicked");
    };

    return (
        <Box sx={{ 
            fontFamily: 'Arial, sans-serif', 
            backgroundColor: '#D1C4E9', 
            minHeight: '100vh', 
            width: '100%'
        }}>
            <Grid container justifyContent="center" sx={{ mt: 4 }}>
                <Grid item xs={12} sm={10} md={8}>
                    <Paper elevation={3} sx={{ p: 3, backgroundColor: 'white', borderRadius: 2 }}>
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            p: 2,
                            border: '1px solid #EDE7F6',
                            borderRadius: 1
                        }}>
                            <Box>
                                <Typography variant="h6" sx={{ color: '#311B92' }}>
                                    {stakeData.title}
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#7E57C2' }}>
                                    APY: <span style={{ color: '#7E57C2', fontWeight: 'bold' }}>{stakeData.apy}%</span>
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button
                                    variant="contained"
                                    onClick={handleStake}
                                    sx={{
                                        backgroundColor: '#7E57C2'
                                    }}
                                >
                                    Stake
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    fullWidth
                                    sx={{ flex: 1}}
                                    onClick={handleUnstake}
                                >
                                    Unstake
                                </Button>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default StakePage;