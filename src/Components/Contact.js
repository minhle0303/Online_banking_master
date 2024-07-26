import React from 'react';

function Contact(props) {
    return (
        <div id='contact'>
            <h1>Contact US</h1>
            <form>
                <input type="text" placeholder='Fullname' required />
                <input type="email" placeholder='Email' required />
                <input type="number" placeholder='Your Number' required />
                <textarea placeholder='Write Here ......' name='massage'></textarea>
                <input type="submit" value='Send' />
            </form>
            
        </div>
    );
}

export default Contact;