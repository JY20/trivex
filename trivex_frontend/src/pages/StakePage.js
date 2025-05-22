import React, { useState, useEffect, useContext } from 'react';
import { Grid, Box, Typography, Button, Paper, Container, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Connected } from '../components/Alert';
import { AppContext } from '../components/AppProvider';
import StakePopup from '../components/Stake'; // Used as StakePopup
import UnstakePopup from '../components/Unstake'; // Used as UnstakePopup
import { AppContract } from '../components/AppContract';

// Styled components for a more modern UI
const PageContainer = styled(Box)(({ theme }) => ({
    background: 'linear-gradient(135deg, #2A0F55 0%, #1A0033 100%)',
    padding: theme.spacing(3),
    minHeight: 'calc(100vh - 140px)',
}));

const GlassCard = styled(Paper)(({ theme }) => ({
    background: 'rgba(28, 25, 38, 0.75)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    border: '1px solid rgba(126, 87, 194, 0.2)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
    padding: theme.spacing(3),
    height: '100%',
    transition: 'all 0.3s ease',
    '&:hover': {
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
    },
}));

const StyledButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(135deg, #9B6DFF 0%, #6A4BA1 100%)',
    color: 'white',
    fontWeight: 'bold',
    borderRadius: '12px',
    padding: '10px 20px',
    transition: 'all 0.3s ease',
    textTransform: 'none',
    boxShadow: '0 4px 20px rgba(106, 75, 161, 0.25)',
    position: 'relative',
    overflow: 'hidden',
    '&:hover': { 
        boxShadow: '0 6px 25px rgba(106, 75, 161, 0.4)',
        transform: 'translateY(-2px)'
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

const OutlinedButton = styled(Button)(({ theme }) => ({
    background: 'transparent',
    color: '#B19EE3',
    fontWeight: 'bold',
    borderRadius: '12px',
    padding: '10px 20px',
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

const StakePage = () => {
    const info = useContext(AppContext);

    const stakeData = {
        title: 'Trading Pool',
    };

    // State for pop-ups and balance
    const [isStakePopupOpen, setStakePopupOpen] = useState(false);
    const [isUnstakePopupOpen, setUnstakePopupOpen] = useState(false);
    const [walletBalance, setWalletBalance] = useState(0);
    const [poolBalance, setPoolBalance] = useState(0);
    const [totalPoolBalance, setTotalPoolBalance] = useState(0);
    const [apy, setApy] = useState(0);

    const contract =  new AppContract();

    const getBalance = async () => {
        try {
            return await contract.getWalletBalance(info.walletAddress);
        } catch (error) {
            console.error('Error fetching balance:', error);
            throw error;
        }
    };
    
    const fetchPoolBalance = async () => {
        try {
            const result = await contract.getStakedBalance(info.walletAddress);
            setPoolBalance(result);
        } catch (err) {
            console.error('Error fetching staked balance:', err);
            setPoolBalance(0);
        }
    };

    const fetchTotalPool = async () => {
        try {
            const result = await contract.getTotalStaked();
            setTotalPoolBalance(result);
        } catch (err) {
            console.error('Error fetching staked balance:', err);
            setTotalPoolBalance(0);
        }
    };

    const fetchApy = async () => {
        try {
            const result = await contract.getApy();
            setApy(result);
        } catch (err) {
            console.error('Error fetching staked balance:', err);
            setApy(0);
        }
    };

    const handleStakePopUp = async () => {
        try {
            const value = await getBalance();
            if (value) {
                setWalletBalance(value);
                setStakePopupOpen(true);
            }
        } catch (error) {
            alert('Failed to fetch wallet balance.');
        }
    };

    const handleUnstakePopUp = async () => {
        if (info.walletAddress) {
            await fetchPoolBalance(info.walletAddress);
        }
        setUnstakePopupOpen(true);
    };

    const handleStake = async (amount) => {
        try {
            const result = await contract.stake(info.wallet.account, amount);
            console.log("Stake Result:", result);
            alert("Stake completed successfully!");
        } catch (error) {
            console.error("An error occurred during the stake process:", error);
            if (error.message.includes("User abort")) {
                alert("Transaction aborted by user.");
            } else {
                alert("An unexpected error occurred. Please try again.");
            }
            throw error;
        }
    };

    const handleUnstake = async (amount) => {
        try {
            const result = await contract.unstake(info.wallet.account, amount);
            console.log('Unstake Result:', result);
            alert('Unstake completed successfully!');
            setUnstakePopupOpen(false);
            
            await fetchPoolBalance();
        } catch (err) {
            console.error('An error occurred during unstaking:', err);
            alert(err.message.includes('User abort') ? 'Transaction aborted.' : 'Unexpected error.');
        }
    };

    const refreshData = async () => {
        fetchPoolBalance();
        fetchApy();
        fetchTotalPool();
    };

    useEffect(() => {
        if (info.walletAddress && !info.routeTrigger) {
            refreshData();
        }
    }, [info, refreshData]);

    if (info.walletAddress != null) {
        return (
            <PageContainer>
                <Container maxWidth="xl">
                    <Box sx={{ width: '80%', mx: 'auto' }}>
                        <GlassCard>
                            <Box sx={{ p: 2 }}>
                                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 3, mb: 3 }}>
                                <Box>
                                        <Typography variant="h5" sx={{ 
                                            color: '#FFFFFF', 
                                            fontWeight: 'bold',
                                            mb: 1
                                        }}>
                                        {stakeData.title}
                                    </Typography>
                                        <Typography variant="body1" sx={{ 
                                            color: '#B19EE3', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: 1 
                                        }}>
                                            APY: 
                                            <span style={{ 
                                                color: '#9B6DFF', 
                                                fontWeight: 'bold',
                                                fontSize: '1.1rem'
                                            }}>
                                            {apy}%
                                        </span>
                                    </Typography>
                                </Box>
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <StyledButton onClick={handleStakePopUp}>
                                            Stake
                                        </StyledButton>
                                        <OutlinedButton onClick={handleUnstakePopUp}>
                                            Unstake
                                        </OutlinedButton>
                                    </Box>
                                </Box>
                                
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <Box sx={{ 
                                            p: 3, 
                                            borderRadius: '12px', 
                                            background: 'rgba(28, 25, 38, 0.5)',
                                            border: '1px solid rgba(126, 87, 194, 0.2)',
                                        }}>
                                            <Typography variant="body2" sx={{ color: '#B19EE3', mb: 1 }}>
                                                Total Staked Balance
                                            </Typography>
                                            <Typography variant="h6" sx={{ 
                                                color: '#FFFFFF',
                                                fontWeight: 'bold',
                                                display: 'flex',
                                                alignItems: 'center',
                                            }}>
                                                {totalPoolBalance} 
                                                <span style={{ 
                                                    marginLeft: '8px', 
                                                    fontSize: '0.8rem', 
                                                    opacity: 0.7,
                                                    color: '#B19EE3'
                                                }}>
                                                    USD
                                                </span>
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Box sx={{ 
                                            p: 3, 
                                            borderRadius: '12px', 
                                            background: 'rgba(28, 25, 38, 0.5)',
                                            border: '1px solid rgba(126, 87, 194, 0.2)',
                                        }}>
                                            <Typography variant="body2" sx={{ color: '#B19EE3', mb: 1 }}>
                                                Your Staked Balance
                                            </Typography>
                                            <Typography variant="h6" sx={{ 
                                                color: '#FFFFFF',
                                                fontWeight: 'bold',
                                                display: 'flex',
                                                alignItems: 'center',
                                            }}>
                                                {poolBalance} 
                                                <span style={{ 
                                                    marginLeft: '8px', 
                                                    fontSize: '0.8rem', 
                                                    opacity: 0.7,
                                                    color: '#B19EE3'
                                                }}>
                                                    USD
                                        </span>
                                    </Typography>
                                </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        </GlassCard>
                    </Box>
                </Container>
                <StakePopup
                    open={isStakePopupOpen}
                    onClose={() => setStakePopupOpen(false)}
                    balance={walletBalance}
                    handleDeposit={handleStake}
                />
                <UnstakePopup
                    open={isUnstakePopupOpen}
                    onClose={() => setUnstakePopupOpen(false)}
                    balance={poolBalance}
                    handleWithdraw={handleUnstake}
                />
            </PageContainer>
        );
    } else {
        return <Connected />;
    }
};

export default StakePage;