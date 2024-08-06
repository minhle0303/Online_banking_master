import React from 'react';

function Card({ icon, title ,onClick}) {
  return (
    <div className="card-user" onClick={onClick}>
      <img src={icon} className='icon' alt={title} />
      <h4>{title}</h4>
    </div>
  );
}

export default Card;