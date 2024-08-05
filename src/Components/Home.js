import React, { useState } from 'react';

function Home(props) {
    const [showFull, setShowFull] = useState(false);

    const handleReadMoreClick = () => {
        setShowFull(!showFull);
    };

    return (
        <div id='main'>
            <div className='home-heading'>
                <h2>Step of your</h2>               
                <h1> <span>Online</span> Banking</h1>
                <p className={`details ${showFull ? 'show-full' : ''}`}>
                    {showFull
                        ? 'Experience the future of banking with our advanced online banking services. Manage your accounts, make transactions, and access all your banking needs from the comfort of your home. Our platform provides a secure and efficient way to handle your finances, including bill payments and fund transfers. Join us today to take control of your financial future!'
                        : 'Experience the future of banking with our advanced online banking services. Manage your accounts and make transactions from the comfort of your home.'}
                </p>
                <span 
                    className='read-more' 
                    onClick={handleReadMoreClick}
                    style={{ fontSize: '1.5rem', cursor: 'pointer', color: '#FF1414' }}
                >
                    {showFull ? 'Read Less' : 'Read More'}
                </span>
            </div>
        </div>
    );
}

export default Home;

