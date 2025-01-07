import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, CssBaseline, ThemeProvider, createTheme, Button, Box } from '@mui/material';
import logo from '../assets/logo.png';

const theme = createTheme({
    palette: {
        primary: {
            main: '#D1C4E9', // Light purple color
        },
        background: {
            default: '#D1C4E9',
        },
    },
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif',
        h6: {
            fontWeight: 600,
        },
    },
});

const Navbar = () => {
    const [walletAddress, setWalletAddress] = useState(null);
    const [error, setError] = useState(null);
    const [connected, setConnected] = useState('Connect');

    // Connect wallet function
    const connectWallet = async () => {
        if(connected === 'Connect'){
            if (!window.ethereum) {
                setError("MetaMask not detected!");
                return;
            }
    
            try {
                const accounts = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });
                setWalletAddress(accounts[0]);
                const profile = accounts[0].substring(0, 2)+"..."+accounts[0].substring(accounts[0].length-4, accounts[0].length);
                setConnected(profile);
            } catch (err) {
                setError(err.message);
                alert(err.message);
            }
        }else{
            setWalletAddress(null);
            setConnected('Connect');
        }
    };

    // Handle account changes
    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on("accountsChanged", (accounts) => {
                setWalletAddress(accounts[0] || null);
            });
        }
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar position="static" color="white" sx={{ boxShadow: 0, padding: '10px 0' }}>
                <Toolbar sx={{ justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: '66%', // Two-thirds width
                            backgroundColor: 'white',
                            borderRadius: '30px',
                            padding: '8px 20px',
                            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                            alignItems: 'center', // Align buttons in the center
                        }}
                    >
                        <Typography variant="h6" sx={{ color: '#7E57C2', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                            <img
                                src={logo}
                                alt="Trivex Logo"
                                style={{
                                    width: '30px',
                                    height: '30px',
                                    borderRadius: '50%',
                                    marginRight: '10px',
                                }}
                            />
                            Trivex
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '30%' }}>
                            <Button color="inherit" component={Link} to="/" sx={{ color: '#7E57C2', fontWeight: 'bold' }}>
                                Home
                            </Button>
                            <Button color="inherit" component={Link} to="/trade" sx={{ color: '#7E57C2', fontWeight: 'bold' }}>
                                Trade
                            </Button>
                            <Button color="inherit" component={Link} to="/algo" sx={{ color: '#7E57C2', fontWeight: 'bold' }}>
                                Algo
                            </Button>
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: '#7E57C2',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    borderRadius: '30px', // Makes the button rounded
                                    padding: '10px 20px', // Adjusts the button's size
                                    '&:hover': { backgroundColor: '#6A4BA1' },
                                }}
                                onClick={connectWallet}
                            >
                                {connected}
                            </Button>
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>
        </ThemeProvider>
    );
};

export default Navbar;
