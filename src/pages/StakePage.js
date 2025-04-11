import React, { useState, useContext } from 'react';
import { Grid, Box, Typography, Button, Paper } from '@mui/material';
import axios from 'axios';
import { Connected } from '../components/Alert';
import { AppContext } from '../components/AppProvider';
import { Contract, Provider, cairo, CallData } from 'starknet';
import StakePopup from '../components/Stake'; // Used as StakePopup
import UnstakePopup from '../components/Unstake'; // Used as UnstakePopup

const StakePage = () => {
    const host = 'localhost:8080';
    const info = useContext(AppContext);

    const stakeData = {
        title: 'Trading Pool',
        apy: 7,
    };

    // State for pop-ups and balance
    const [isStakePopupOpen, setStakePopupOpen] = useState(false);
    const [isUnstakePopupOpen, setUnstakePopupOpen] = useState(false);
    const [walletBalance, setWalletBalance] = useState(0);
    const [poolBalance, setPoolBalance] = useState(0); // Balance in the staking pool

    // Starknet contract details (same as SettingsPage)
    const hash_provider = new Provider({ network: 'sepolia' });
    const classHash = '0x008e2b7d5289f1ca14683bc643f42687dd1ef949e8a35be4c429aa825a097604';
    const contractAddress = '0x005262cd7aee4715e4a00c41384a5f5ad151ff16da7523f41b93836bed922ced';
    const usdcTokenAddress = '0x53b40a647cedfca6ca84f542a0fe36736031905a9639a7f19a3c1e66bfd5080';

    // Fetch ABI for the contract
    const getABI = async (classHash) => {
        const contractClass = await hash_provider.getClassByHash(classHash);
        return contractClass.abi;
    };

    /* global BigInt */

    // Fetch wallet balance (USDC balance)
    const getBalance = async () => {
        try {
            const abi = await getABI(classHash);
            const contract = new Contract(abi, contractAddress, hash_provider);
            const balance = await contract.call('get_balance', [usdcTokenAddress, info.walletAddress]);
            const convertedBalance = (Number(balance) / 1000000).toFixed(2);
            return convertedBalance;
        } catch (error) {
            console.error('Error fetching balance:', error);
            throw error;
        }
    };

    // Fetch pool balance (staked amount)
    const fetchPoolBalance = async (address) => {
        try {
            const response = await axios.get(`https://${host}/wallets/${address}/balances`);
            const current_balances = response.data;
            if (current_balances && current_balances.length > 0) {
                const poolValue = parseFloat(current_balances[0].amount || 0);
                setPoolBalance(poolValue);
            } else {
                setPoolBalance(0);
            }
        } catch (error) {
            console.error('Error fetching pool balance:', error);
            setPoolBalance(0);
        }
    };

    // Update balance after transaction
    const updateBalance = async (hash) => {
        try {
            const response = await axios.post(`https://${host}/action`, {
                hash,
            });
            console.log('Balance updated:', response.data);
        } catch (error) {
            console.error('Failed to update balance:', error.response?.data?.detail || error.message);
            alert('Failed to update balance.');
        }
    };

    // Handle Stake pop-up
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

    // Handle Unstake pop-up
    const handleUnstakePopUp = async () => {
        if (info.walletAddress) {
            await fetchPoolBalance(info.walletAddress);
        }
        setUnstakePopupOpen(true);
    };

    // Handle Stake action
    const handleStake = async (amount) => {
        try {
            const provider = info.wallet.account;
            const contractClass = await hash_provider.getClassByHash(classHash);
            const abi = contractClass.abi;
            const contract = new Contract(abi, contractAddress, provider);

            const weiAmount = amount * 1000000;

            const stake = contract.populate('deposit', [BigInt(weiAmount), usdcTokenAddress]);

            const result = await provider.execute([
                {
                    contractAddress: usdcTokenAddress,
                    entrypoint: 'approve',
                    calldata: CallData.compile({
                        spender: contractAddress,
                        amount: cairo.uint256(weiAmount),
                    }),
                },
                {
                    contractAddress: contractAddress,
                    entrypoint: 'deposit',
                    calldata: stake.calldata,
                },
            ]);

            console.log('Stake Result:', result);
            updateBalance(result['transaction_hash']);
            alert('Stake completed successfully!');
            setStakePopupOpen(false);
            if (info.walletAddress) {
                await fetchPoolBalance(info.walletAddress);
            }
        } catch (error) {
            console.error('An error occurred during staking:', error);
            if (error.message.includes('User abort')) {
                alert('Transaction aborted by user.');
            } else {
                alert('An unexpected error occurred. Please try again.');
            }
        }
    };

    // Handle Unstake action
    const handleUnstake = async (amount) => {
        try {
            const provider = info.wallet.account;
            const contractClass = await hash_provider.getClassByHash(classHash);
            const abi = contractClass.abi;
            const contract = new Contract(abi, contractAddress, provider);

            const weiAmount = amount * 1000000;

            const unstake = contract.populate('withdraw', [BigInt(weiAmount), usdcTokenAddress]);

            const result = await provider.execute([
                {
                    contractAddress: contractAddress,
                    entrypoint: 'withdraw',
                    calldata: unstake.calldata,
                },
            ]);

            console.log('Unstake Result:', result);
            updateBalance(result['transaction_hash']);
            alert('Unstake completed successfully!');
            setUnstakePopupOpen(false);
            if (info.walletAddress) {
                await fetchPoolBalance(info.walletAddress);
            }
        } catch (error) {
            console.error('An error occurred during unstaking:', error);
            if (error.message.includes('User abort')) {
                alert('Transaction aborted by user.');
            } else {
                alert('An unexpected error occurred. Please try again.');
            }
        }
    };

    // Render
    if (info.walletAddress != null) {
        return (
            <Box
                sx={{
                    fontFamily: 'Arial, sans-serif',
                    backgroundColor: '#D1C4E9',
                    minHeight: '100vh',
                    width: '100%',
                }}
            >
                <Grid container justifyContent="center" sx={{ mt: 4 }}>
                    <Grid item xs={12} sm={10} md={8}>
                        <Paper elevation={3} sx={{ p: 3, backgroundColor: 'white', borderRadius: 2 }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    p: 2,
                                    border: '1px solid #EDE7F6',
                                    borderRadius: 1,
                                }}
                            >
                                <Box>
                                    <Typography variant="h6" sx={{ color: '#311B92' }}>
                                        {stakeData.title}
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: '#7E57C2' }}>
                                        APY: <span style={{ color: '#7E57C2', fontWeight: 'bold' }}>
                                            {stakeData.apy}%
                                        </span>
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: '#7E57C2', mt: 1 }}>
                                        Staked Balance: <span style={{ fontWeight: 'bold' }}>
                                            {poolBalance.toFixed(2)} USD
                                        </span>
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Button
                                        variant="contained"
                                        onClick={handleStakePopUp}
                                        sx={{
                                            backgroundColor: '#7E57C2',
                                        }}
                                    >
                                        Stake
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        sx={{ flex: 1 }}
                                        onClick={handleUnstakePopUp}
                                    >
                                        Unstake
                                    </Button>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
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
            </Box>
        );
    } else {
        return <Connected />;
    }
};

export default StakePage;