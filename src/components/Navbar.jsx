import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, CssBaseline, ThemeProvider, createTheme, Button, Box } from '@mui/material';
import logo from '../assets/logo.png';
import SettingsIcon from '@mui/icons-material/Settings'

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
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <Typography
                                variant="h6"
                                component={Link}
                                to="/"
                                sx={{textDecoration: 'none', color: '#7E57C2', fontWeight: 'bold', display: 'flex', alignItems: 'center',
                                    transition: 'transform 0.3s ease', // Smooth transition
                                    '&:hover': {
                                    transform: 'scale(1.1)', // Slightly enlarge on hover}} 
                                    },}}
                                >
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
                            <Typography
                                variant="h6"
                                component={Link}
                                to="/trade"
                                sx={{
                                    textDecoration: 'none',
                                    color: '#7E57C2',
                                    fontWeight: 'bold',
                                    transition: 'transform 0.3s ease',
                                    '&:hover': {
                                        transform: 'scale(1.1)',
                                    },
                                }}
                            >
                                Trade
                            </Typography>
                            <Typography
                                variant="h6"
                                component={Link}
                                to="/algo"
                                sx={{
                                    textDecoration: 'none',
                                    color: '#7E57C2',
                                    fontWeight: 'bold',
                                    transition: 'transform 0.3s ease',
                                    '&:hover': {
                                        transform: 'scale(1.1)',
                                    },
                                }}
                            >
                                Algo
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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
                            <SettingsIcon
                                component={Link}
                                to="/setting"
                                sx={{
                                    color: '#7E57C2',
                                    cursor: 'pointer',
                                    transition: 'color 0.3s ease',
                                    '&:hover': {
                                    color: '#6A4BA1', // Changes color on hover
                                    },
                                }}
                            />
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>
        </ThemeProvider>
    );
};

export default Navbar;
