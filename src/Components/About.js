import React, { useState } from 'react';

function About(props) {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div id='about'>
            <div className='about-image'>
                <img src="aboutimage" alt="" />
            </div>
            <div className='about-text'>
                <h1>Learn More About Us</h1>
                <p>
                    We are dedicated to providing the best online banking experience with a range of financial services. Our mission is to make banking easier and more accessible through innovative solutions and exceptional customer service.
                    {!isExpanded && <span>...</span>}
                    {isExpanded && (
                        <>
                            <br /><br />
                            Our team is composed of experienced professionals who are committed to helping you manage your finances effectively. We offer a variety of products designed to meet your unique needs, whether you’re looking to save, invest, or manage your spending.
                            <br /><br />
                            Explore our services to see how we can assist you in achieving your financial goals. We pride ourselves on transparency, security, and customer satisfaction, and we are always here to support you on your financial journey.
                        </>
                    )}
                </p>
                <button onClick={toggleExpand}>
                    {isExpanded ? 'Read Less' : 'Read More'}
                </button>
            </div>
        </div>
    );
}

export default About;
