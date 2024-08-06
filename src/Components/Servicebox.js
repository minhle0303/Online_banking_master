
import React from 'react';

function Servicebox(props) {
    return (
        <div className='a-box'>
            <div className='a-b-img'>
                <img src={props.image} alt={props.title} />
            </div>
            <div className='a-b-text'>
                <h2>{props.title}</h2>
                <p>{props.description}</p>
            </div>
        </div>
    );
}

export default Servicebox;
