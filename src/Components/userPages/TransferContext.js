import React, { createContext, useState, useContext } from 'react';

const TransferContext = createContext();

export const useTransfer = () => useContext(TransferContext);

export const TransferProvider = ({ children }) => {
    const [transferData, setTransferData] = useState({
        selectedAccount: null,
        recipientAccount: '',
        amount: '',
        description: ''
    });

    const retryTransfer = (transaction) => {
        setTransferData({
            selectedAccount: transaction.fromAccount,
            recipientAccount: transaction.toAccount,
            amount: transaction.amount,
            description: transaction.description
        });
    };

    return (
        <TransferContext.Provider value={{ transferData, setTransferData, retryTransfer }}>
            {children}
        </TransferContext.Provider>
    );
};
