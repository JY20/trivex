import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [walletAddress, setWalletAddress] = useState(null);
    return (
        <AppContext.Provider value={{walletAddress, setWalletAddress}}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
