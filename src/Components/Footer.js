import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas} from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faTwitter, faInstagram, faLinkedinIn, faGoogle } from '@fortawesome/free-brands-svg-icons';


function Footer(props) {
    return (
        <div className='container-fluid'>
            <div className='footer'>
                <div className='logo'>
                <FontAwesomeIcon icon={fas.faHouse} />
                    <a href="">Bank</a>
                </div>
                <ul className='socials'>
                <li><a href="http://google.com"><FontAwesomeIcon icon={faGoogle} /></a></li>
                    <li><a href="http://facebook.com"><FontAwesomeIcon icon={faFacebook} /></a></li>
                    <li><a href="http://twitter.com"><FontAwesomeIcon icon={faTwitter} /></a></li>
                    <li><a href="http://instagram.com"><FontAwesomeIcon icon={faInstagram} /></a></li>
                    <li><a href="http://linkedin.com"><FontAwesomeIcon icon={faLinkedinIn} /></a></li>
                </ul>
                <div className='copyright'>copyright &copy; 2024 bank</div>
                
            </div>
        </div>
    );
}

export default Footer;
