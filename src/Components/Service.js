import React from 'react';
import { Link } from 'react-router-dom';
import Servicebox from './Servicebox';
import fimage1 from '../images/006-credit-card.svg';
import fimage2 from '../images/007-piggy-bank.svg';
import fimage3 from '../images/6.svg';
import fimage4 from '../images/003-notes.svg';

function Feature() {
    return (
        <div id='servise'>
            <h1>Our Services</h1>
            <div className='a-container'>
                <Link to="/details/card">
                    <Servicebox 
                        image={fimage1} 
                        title="Card" 
                        description="Flexible credit and debit card options." 
                    />
                </Link>
                <Link to="/details/saving">
                    <Servicebox 
                        image={fimage2} 
                        title="Saving" 
                        description="Effective savings solutions to grow your wealth." 
                    />
                </Link>
                <Link to="/details/shopping">
                    <Servicebox 
                        image={fimage3} 
                        title="Shopping Banking" 
                        description="Seamless integration for shopping and banking." 
                    />
                </Link>
                <Link to="/details/security">
                    <Servicebox 
                        image={fimage4} 
                        title="Security" 
                        description="Advanced security measures to safeguard your finances." 
                    />
                </Link>
            </div>
        </div>
    );
}

export default Feature;





// import React from 'react';
// import Servicebox from './Servicebox';
// import fimage1 from '../images/006-credit-card.svg';
// import fimage2 from '../images/007-piggy-bank.svg';
// import fimage3 from '../images/6.svg';
// import fimage4 from '../images/003-notes.svg';

// function Feature(props) {
//     return (
//         <div id='servise'>
//             <h1>Our Services</h1>
//             <div className='a-container'>
//                 <Servicebox 
//                     image={fimage1} 
//                     title="Card" 
//                     description="Flexible credit and debit card options." 
//                 />
//                 <Servicebox 
//                     image={fimage2} 
//                     title="Saving" 
//                     description="Effective savings solutions to grow your wealth." 
//                 />
//                 <Servicebox 
//                     image={fimage3} 
//                     title="Shopping Banking" 
//                     description="Seamless integration for shopping and banking." 
//                 />
//                 <Servicebox 
//                     image={fimage4} 
//                     title="Security" 
//                     description="Advanced security measures to safeguard your finances." 
//                 />
//             </div>
//         </div>
//     );
// }

// export default Feature;
