import React, { useState } from 'react';
import TransactionHistory from './TransactionHistory';
import Transfer from './Transfer';

function ParentComponent() {
    const [recipientAccount, setRecipientAccount] = useState('');
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');

    // Callback to update transfer details
    const handleSelectTransaction = (transaction) => {
        setRecipientAccount(transaction.recipientAccount);
        setSelectedAccount(transaction.selectedAccount);
        setAmount(transaction.amount);
        setDescription(transaction.description);
    };

    return (
        <div>
            <TransactionHistory onSelectTransaction={handleSelectTransaction} />
            <Transfer
                recipientAccount={recipientAccount}
                selectedAccount={selectedAccount}
                amount={amount}
                description={description}
                setRecipientAccount={setRecipientAccount}
                setSelectedAccount={setSelectedAccount}
                setAmount={setAmount}
                setDescription={setDescription}
            />
        </div>
    );
}

export default ParentComponent;
