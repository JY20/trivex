import React, { createContext, useState, useContext } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [walletAddress, setWalletAddress] = useState(null);
    const [whitelisted, setWhitelisted] = useState(false);
    const [wallet, setWallet] = useState(null);
    return (
        <AppContext.Provider value={{walletAddress, setWalletAddress, whitelisted, setWhitelisted, wallet, setWallet}}>
            {children}
        </AppContext.Provider>
    );
};
