import React, { useEffect, useContext } from 'react';
import { Button, styled } from '@mui/material';
import { connect, disconnect } from "get-starknet";
import { encode } from "starknet";
import { AppContext } from './AppProvider';

// Styled button component to match the app's design
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

const WalletConnectButton = ({ fullWidth, onClick }) => {
    const info = useContext(AppContext);
    
    // Apply custom styling to the get-starknet dialog
    useEffect(() => {
        // Function to apply dark theme to wallet connect dialog
        const applyDarkThemeToWalletDialog = () => {
            // Target the dialog when it appears in the DOM
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.addedNodes.length) {
                        mutation.addedNodes.forEach((node) => {
                            if (node.nodeType === 1) { // Element node
                                // Check if this is a dialog
                                if (node.getAttribute('role') === 'dialog' || 
                                    node.querySelector('[role="dialog"]')) {
                                    
                                    // Apply dark theme styles
                                    const dialog = node.getAttribute('role') === 'dialog' 
                                        ? node 
                                        : node.querySelector('[role="dialog"]');
                                    
                                    if (dialog) {
                                        dialog.classList.add('starknet-connect-modal');
                                        
                                        // Style all buttons in the dialog
                                        const buttons = dialog.querySelectorAll('button');
                                        buttons.forEach(button => {
                                            button.style.backgroundColor = 'rgba(41, 21, 71, 0.75)';
                                            button.style.color = '#FFFFFF';
                                            button.style.border = '1px solid rgba(126, 87, 194, 0.3)';
                                            button.style.borderRadius = '12px';
                                        });
                                        
                                        // Style all text elements
                                        const textElements = dialog.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span');
                                        textElements.forEach(el => {
                                            el.style.color = '#FFFFFF';
                                        });
                                        
                                        // Set dialog background
                                        dialog.style.backgroundColor = 'rgba(28, 25, 38, 0.95)';
                                        dialog.style.backdropFilter = 'blur(10px)';
                                        dialog.style.border = '1px solid rgba(126, 87, 194, 0.3)';
                                        dialog.style.borderRadius = '16px';
                                        
                                        // Style the dialog content background
                                        const dialogContent = dialog.querySelector('div');
                                        if (dialogContent) {
                                            dialogContent.style.backgroundColor = 'rgba(28, 25, 38, 0.95)';
                                        }
                                    }
                                }
                            }
                        });
                    }
                });
            });
            
            // Start observing the document body
            observer.observe(document.body, { childList: true, subtree: true });
            
            // Return cleanup function
            return () => observer.disconnect();
        };
        
        const cleanup = applyDarkThemeToWalletDialog();
        return cleanup;
    }, []);
    
    const handleDisconnect = async () => {
        await disconnect({ clearLastWallet: true });
        info.setWalletAddress(null);
        info.setWallet(null);
        if (onClick) onClick();
    };

    const handleConnect = async () => {
        try {
            const getWallet = await connect();
            await getWallet?.enable({ starknetVersion: "v5" });
            const addr = encode.addHexPrefix(encode.removeHexPrefix(getWallet?.selectedAddress ?? "0x").padStart(64, "0"));
            info.setWalletAddress(addr);
            info.setWallet(getWallet);
            info.setRouteTrigger(false);
            if (onClick) onClick();
        } catch (e) {
            console.log(e);
        }
    };

    const handleConnectButton = async () => {
        if (info.walletAddress == null) {
            handleConnect();
        } else {
            handleDisconnect();
        }
    };

    // Display wallet address in shortened form if connected
    const buttonText = info.walletAddress 
        ? `${info.walletAddress.substring(0, 4)}...${info.walletAddress.substring(info.walletAddress.length - 4)}` 
        : 'Connect';

    return (
        <StyledButton
            onClick={handleConnectButton}
            fullWidth={fullWidth}
        >
            {buttonText}
        </StyledButton>
    );
};

export default WalletConnectButton; 