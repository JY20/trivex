import React, { useState, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
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
    IconButton,
    useMediaQuery 
} from '@mui/material';
import logo from '../assets/Trivex1.png';
import starknet_logo from '../assets/starknet.png';
import SettingsIcon from '@mui/icons-material/Settings';
import { connect, disconnect } from "get-starknet";
import { encode } from "starknet";
import { AppContext } from './AppProvider';
import MenuIcon from '@mui/icons-material/Menu';
import WalletConnectButton from './WalletConnectButton';

// Styled components with enhanced web3 styling
const StyledToolbar = styled(Toolbar)({
    display: 'flex',
    justifyContent: 'center',
    padding: '12px 0',
});

const NavbarContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    background: 'rgba(28, 25, 38, 0.85)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    padding: '12px 24px',
    border: '1px solid rgba(126, 87, 194, 0.2)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
    [theme.breakpoints.down("sm")]: {
        width: '95%',
        padding: '10px 16px'
    }
}));

const NavLink = styled(Typography)(({ theme }) => ({
    textDecoration: 'none',
    color: '#B19EE3',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    padding: '8px 16px',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
    '&:hover': { 
        color: '#FFFFFF',
        background: 'linear-gradient(135deg, rgba(126, 87, 194, 0.2) 0%, rgba(126, 87, 194, 0.1) 100%)',
        transform: 'translateY(-2px)',
    },
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, rgba(126, 87, 194, 0) 0%, rgba(126, 87, 194, 0.1) 100%)',
        opacity: 0,
        transition: 'opacity 0.3s ease',
    },
    '&:hover::before': {
        opacity: 1,
    }
}));

const StyledButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(135deg, #9B6DFF 0%, #6A4BA1 100%)',
    color: '#FFFFFF',
    fontWeight: 'bold',
    borderRadius: '12px',
    padding: '10px 20px',
    transition: 'all 0.3s ease',
    textTransform: 'none',
    boxShadow: '0 4px 20px rgba(106, 75, 161, 0.25)',
    position: 'relative',
    overflow: 'hidden',
    border: '1px solid rgba(155, 109, 255, 0.5)',
    '&:hover': { 
        boxShadow: '0 6px 25px rgba(106, 75, 161, 0.4)',
        transform: 'translateY(-2px)',
        background: 'linear-gradient(135deg, #8A5CF7 0%, #5A3A91 100%)',
    },
    '&::after': {
        content: '""',
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'linear-gradient(to bottom right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%)',
        transform: 'rotate(30deg)',
        transition: 'transform 0.7s ease',
    },
    '&:hover::after': {
        transform: 'rotate(30deg) translate(50%, 50%)',
    }
}));

const NetworkBadge = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(41, 21, 71, 0.75)',
    border: '1px solid rgba(126, 87, 194, 0.3)',
    borderRadius: '12px',
    padding: '6px 12px',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(106, 75, 161, 0.2)',
    }
}));

const LogoWrapper = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    '& img': {
        transition: 'transform 0.3s ease',
    },
    '&:hover img': {
        transform: 'rotate(10deg)',
    }
}));

// Create a modern Web3 theme
const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#9B6DFF',
        },
        secondary: {
            main: '#6A4BA1',
        },
        background: {
            default: '#121212',
            paper: '#1E1E1E',
        },
        text: {
            primary: '#FFFFFF',
            secondary: '#B19EE3',
        },
    },
    typography: {
        fontFamily: '"Poppins", "Roboto", "Arial", sans-serif',
        h6: {
            fontWeight: 600,
            letterSpacing: '0.5px',
        },
    },
    shape: {
        borderRadius: 12,
    },
});

const Navbar = () => {
    const info = useContext(AppContext);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const location = useLocation();

    // Handle scrolling effect
    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [scrolled]);

    const handleRouteClick = () => {
        info.setRouteTrigger(false);
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar 
                component="nav" 
                position="sticky" 
                sx={{ 
                    background: 'transparent',
                    boxShadow: 'none',
                    transition: 'all 0.3s ease',
                }} 
                elevation={0}
            >
                <StyledToolbar>
                    <NavbarContainer
                        sx={{
                            boxShadow: scrolled ? '0 8px 32px 0 rgba(31, 38, 135, 0.25)' : '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                            transform: scrolled ? 'translateY(0)' : 'translateY(0)',
                            transition: 'all 0.3s ease',
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: { xs: '8px', md: '16px' },
                            }}
                        >
                            <LogoWrapper
                                component={Link}
                                to="/trade"
                                onClick={handleRouteClick}
                                sx={{
                                    textDecoration: 'none',
                                }}
                            >
                                <img 
                                    src={logo} 
                                    alt="Trivex Logo" 
                                    style={{ 
                                        width: "36px", 
                                        height: "36px", 
                                        borderRadius: '50%',
                                        filter: 'drop-shadow(0 0 8px rgba(155, 109, 255, 0.5))'
                                    }} 
                                />
                                <Typography 
                                    variant="h6" 
                                    sx={{
                                        color: '#FFFFFF',
                                        fontWeight: 'bold',
                                        background: 'linear-gradient(90deg, #FFFFFF 0%, #B19EE3 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        fontSize: { xs: '1.2rem', md: '1.4rem' }
                                    }}
                                >
                                    Trivex
                                </Typography>
                            </LogoWrapper>
                            
                            {!isMobile && (
                                <>
                                    <NavLink
                                        variant="body1"
                                        component={Link}
                                        to="/trade"
                                        onClick={handleRouteClick}
                                    >
                                        Trade
                                    </NavLink>
                                    <NavLink
                                        variant="body1"
                                        component={Link}
                                        to="/strategy"
                                        onClick={handleRouteClick}
                                    >
                                        Strategy
                                    </NavLink>
                                    <NavLink
                                        variant="body1"
                                        component={Link}
                                        to="/stake"
                                        onClick={handleRouteClick}
                                    >
                                        Stake
                                    </NavLink>
                                </>
                            )}
                        </Box>

                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: { xs: '8px', md: '16px' },
                            }}
                        >
                            {isMobile && (
                                <IconButton 
                                    onClick={() => setOpenDrawer(true)}
                                    sx={{ 
                                        color: '#B19EE3',
                                        '&:hover': { 
                                            color: '#FFFFFF',
                                            background: 'rgba(126, 87, 194, 0.1)'
                                        }
                                    }}
                                >
                                    <MenuIcon />
                                </IconButton>
                            )}
                            
                            <NetworkBadge>
                                <img
                                    src={starknet_logo}
                                    alt="Starknet Logo"
                                    style={{ 
                                        width: '24px', 
                                        height: '24px', 
                                        marginRight: '8px',
                                        filter: 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.4))'
                                    }}
                                />
                                <Typography 
                                    variant="body2" 
                                    sx={{ 
                                        color: '#B19EE3', 
                                        fontWeight: 'bold',
                                        fontSize: { xs: '0.75rem', md: '0.875rem' }
                                    }}
                                >
                                    Starknet
                                </Typography>
                            </NetworkBadge>
                            
                            {!isMobile && (
                                <WalletConnectButton />
                            )}
                            
                            <IconButton
                                component={Link}
                                to="/setting"
                                onClick={handleRouteClick}
                                sx={{
                                    color: '#B19EE3',
                                    transition: 'all 0.3s ease',
                                    '&:hover': { 
                                        color: '#FFFFFF',
                                        background: 'rgba(126, 87, 194, 0.1)',
                                        transform: 'rotate(30deg)'
                                    },
                                }}
                            >
                                <SettingsIcon />
                            </IconButton>
                        </Box>
                    </NavbarContainer>
                </StyledToolbar>

                <Drawer 
                    anchor="right" 
                    open={openDrawer} 
                    onClose={() => setOpenDrawer(false)}
                    PaperProps={{
                        sx: {
                            background: 'rgba(28, 25, 38, 0.95)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(126, 87, 194, 0.2)',
                            width: 280
                        }
                    }}
                >
                    <Box 
                        sx={{ 
                            padding: 3,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 2,
                            height: '100%'
                        }}
                    >
                        <LogoWrapper
                            component={Link}
                            to="/trade"
                            onClick={() => {
                                handleRouteClick();
                                setOpenDrawer(false);
                            }}
                            sx={{
                                textDecoration: 'none',
                                marginBottom: 3
                            }}
                        >
                            <img 
                                src={logo} 
                                alt="Trivex Logo" 
                                style={{ 
                                    width: "40px", 
                                    height: "40px", 
                                    borderRadius: '50%',
                                    filter: 'drop-shadow(0 0 8px rgba(155, 109, 255, 0.5))'
                                }} 
                            />
                            <Typography 
                                variant="h6" 
                                sx={{
                                    color: '#FFFFFF',
                                    fontWeight: 'bold',
                                    background: 'linear-gradient(90deg, #FFFFFF 0%, #B19EE3 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                Trivex
                            </Typography>
                        </LogoWrapper>

                        <NavLink
                            variant="body1"
                            component={Link}
                            to="/trade"
                            onClick={() => {
                                handleRouteClick();
                                setOpenDrawer(false);
                            }}
                            sx={{ width: '100%', justifyContent: 'center' }}
                        >
                            Trade
                        </NavLink>
                        <NavLink
                            variant="body1"
                            component={Link}
                            to="/strategy"
                            onClick={() => {
                                handleRouteClick();
                                setOpenDrawer(false);
                            }}
                            sx={{ width: '100%', justifyContent: 'center' }}
                        >
                            Strategy
                        </NavLink>
                        <NavLink
                            variant="body1"
                            component={Link}
                            to="/stake"
                            onClick={() => {
                                handleRouteClick();
                                setOpenDrawer(false);
                            }}
                            sx={{ width: '100%', justifyContent: 'center' }}
                        >
                            Stake
                        </NavLink>
                        
                        <Box sx={{ flexGrow: 1 }} />
                        
                        <WalletConnectButton 
                            fullWidth 
                            onClick={() => setOpenDrawer(false)}
                        />
                    </Box>
                </Drawer>
            </AppBar>
        </ThemeProvider>
    );
};

export default Navbar;
