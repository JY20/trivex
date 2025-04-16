import React, { useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { 
    AppBar, 
    Toolbar, 
    Typography, 
    CssBaseline, 
    ThemeProvider, 
    createTheme, 
    Button, 
    Box,
    styled,
    Drawer,
    IconButton } from '@mui/material';
import logo from '../assets/Trivex1.png';
import starknet_logo from '../assets/starknet.png';
import SettingsIcon from '@mui/icons-material/Settings'
import { connect, disconnect } from "get-starknet";
import { encode} from "starknet";
import {AppContext} from './AppProvider';
import axios from 'axios';
import MenuIcon from '@mui/icons-material/Menu';


const StyledToolbar = styled(Toolbar)({
    display: 'flex',
    justifyContent: 'center',
});

const NavbarContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
    backgroundColor: 'white',
    borderRadius: '30px',
    padding: '8px 20px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    [theme.breakpoints.down("sm")]: {
        width: '90%', // Slightly smaller on mobile for better spacing
        padding: '6px 15px'
    }
}));

const theme = createTheme({
    palette: {
        primary: {
            main: '#D1C4E9', 
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
    const info = useContext(AppContext);
    const [connected, setConnected] = useState('Connect');

    const [openDrawer, setOpenDrawer] = useState(false);

    const [walletName, setWalletName] = useState("");
    const [wallet, setWallet] = useState("");

    const host = "localhost:8080";

    const checkWhitelisted = async (address) => {
        try {
          const response = await axios.get(`http://${host}/wallets/${address}/whitelist`);
    
          const result = response.data;
          info.setWhitelisted(true);
        } catch (error) {
          console.error('Error fetching balance:', error);
        }
    };

    const handleDisconnect = async () => {
        await disconnect({clearLastWallet: true});
        setWallet("");
        info.setWalletAddress(null);
        info.setWhitelisted(null);
        setWalletName("")
        setConnected('Connect');
    }


    const handleConnect = async () => {
        try{
            const getWallet = await connect();
            await getWallet?.enable({ starknetVersion: "v5" });
            setWallet(getWallet);
            const addr = encode.addHexPrefix(encode.removeHexPrefix(getWallet?.selectedAddress ?? "0x").padStart(64, "0"));
            info.setWalletAddress(addr);
            const profile = addr.substring(0, 2)+"..."+addr.substring(addr.length-4, addr.length);
            setConnected(profile);
            setWalletName(getWallet?.name || "")
            checkWhitelisted(addr);
            info.setWallet(getWallet);
        }
        catch(e){
            console.log(e)
        }
    };

    

    const handleConnectButton = async () => {
        if(info.walletAddress == null){
            handleConnect();
        }else{
            handleDisconnect();
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar component="nav" position="sticky" sx={{ backgroundColor: '#D1C4E9', color: '#060f5e' }} elevation={0}>
                <StyledToolbar>
                    <NavbarContainer sx={{width: '80%', background: 'white'}}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                            }}
                        >
                            {/* Logo */}
                            <Typography 
                                variant="h6" 
                                component={Link}
                                    sx={{
                                        textDecoration: 'none',
                                        color: '#7E57C2',
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        alignItems: 'center',
                                        transition: 'transform 0.3s ease',
                                        '&:hover': { color: '#6A4BA1' },
                                    }}>
                                <img src={logo} alt="Trivex Logo" style={{ width: "30px", height: "30px", borderRadius: '50%', marginRight: '10px' }} />
                                Trivex
                            </Typography>
                            <Typography
                            variant="h7"
                            component={Link}
                            to="/trade"
                            sx={{
                                textDecoration: 'none',
                                color: '#7E57C2',
                                fontWeight: 'bold',
                                transition: 'transform 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                '&:hover': { color: '#6A4BA1' },
                            }}
                        >
                            Trade
                        </Typography>
                        <Typography
                                variant="h7"
                                component={Link}
                                to="/strategy"
                                sx={{
                                    textDecoration: 'none',
                                    color: '#7E57C2',
                                    fontWeight: 'bold',
                                    transition: 'transform 0.3s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    '&:hover': { color: '#6A4BA1' },
                                }}
                            >
                                Strategy
                            </Typography>
                        <Typography
                                variant="h7"
                                component={Link}
                                to="/stake"
                                sx={{
                                    textDecoration: 'none',
                                    color: '#7E57C2',
                                    fontWeight: 'bold',
                                    transition: 'transform 0.3s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    '&:hover': { color: '#6A4BA1' },
                                }}
                            >
                                Stake
                            </Typography>
                        </Box>
                        {/* Mobile Menu Icon */}
                        
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '16px',
                            }}
                        >
                            <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                                <IconButton onClick={() => setOpenDrawer(true)}>
                                    <MenuIcon sx={{ color: '#060f5e' }} />
                                </IconButton>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#f5f5f5', borderRadius: '8px', padding: '4px 8px' }}>
                                <img
                                    src={starknet_logo}
                                    alt="Starknet Logo"
                                    style={{ width: '24px', height: '24px', marginRight: '8px' }}
                                />
                                <Typography variant="h10" sx={{ color: '#7E57C2', fontWeight: 'bold' }}>
                                    Starknet
                                </Typography>
                            </Box>
                            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                                <Button
                                    variant="contained"
                                    sx={{
                                        backgroundColor: '#7E57C2',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        borderRadius: '30px',
                                        padding: '10px 20px',
                                        '&:hover': { backgroundColor: '#6A4BA1' },
                                    }}
                                    onClick={handleConnectButton}
                                >
                                    {connected}
                                </Button>
                            </Box>
                            <Typography
                                variant="h6"
                                component={Link}
                                to="/setting"
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    textDecoration: 'none',
                                    color: '#7E57C2',
                                    fontWeight: 'bold',
                                    transition: 'transform 0.3s ease',
                                    '&:hover': { color: '#6A4BA1' },
                                }}
                            >
                                <SettingsIcon />
                            </Typography>
                        </Box>
                    </NavbarContainer>
                </StyledToolbar>

                {/* Mobile Drawer */}
                <Drawer anchor="right" open={openDrawer} onClose={() => setOpenDrawer(false)}>
                    <Box sx={{ width: 250, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 2 }}>
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: '#7E57C2',
                                color: 'white',
                                fontWeight: 'bold',
                                borderRadius: '30px',
                                padding: '10px 20px',
                                '&:hover': { backgroundColor: '#6A4BA1' },
                            }}
                            onClick={handleConnectButton}
                        >
                            {connected}
                        </Button>
                    </Box>
                </Drawer>
            </AppBar>
        </ThemeProvider>
    );
};

export default Navbar;
