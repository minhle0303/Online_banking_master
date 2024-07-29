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
                We are dedicated to providing the best online banking experience through a comprehensive range of financial services. Our mission is to simplify banking and make it more accessible with innovative solutions and exceptional customer service
                    {!isExpanded && <span>...</span>}
                    {isExpanded && (
                        <>
                            <br /><br />
                            Our team of experienced professionals is committed to helping you manage your finances effectively. We offer a variety of products tailored to meet your unique needs, whether you’re looking to save, invest, or manage your spending
                            <br /><br />
                            Register now to explore our services and discover how we can assist you in achieving your financial goals. We take pride in our transparency, security, and commitment to customer satisfaction. We are always here to support you on your financial journey. 
                            <br /><br />
                            Thanks you.
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
