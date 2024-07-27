import React, { useState } from 'react';
import logo from '../images/Online-Banking (1)-fotor-2024072118758.png';
import { Link } from 'react-scroll';
import { Link as RouterLink } from 'react-router-dom';

function Navbar(props) {
    const [nav, setnav] = useState(false)
    const changeBackground = () => {
        if (window.scrollY >= 50) {
            setnav(true);
        } else {
            setnav(false);
        }
    }
    window.addEventListener('scroll', changeBackground)
    return (
        <nav className={nav ? "nav active" : "nav"}>
            <Link to='main' className='logo'>
                <img src={logo} alt="" />
            </Link>

            <input className='menu-btn' type="checkbox" id='menu-btn' />
            <label className='menu-icon' for='menu-btn'>
                <span className='nav-icon'></span>
            </label>
            <ul>
                <li><Link to='main'>Home</Link></li>
                <li><Link to='servise'>Service</Link></li>
                <li><Link to='blog'>Blog</Link></li>
                <li><Link to='about'>About</Link></li>
                <li><Link to='contact'>Contact</Link></li>
                <li><RouterLink to='/login'>Login</RouterLink></li>

            </ul>
        </nav>
    );
}

export default Navbar;