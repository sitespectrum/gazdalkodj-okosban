import React from 'react';

const Lucky = ({ onClose, currentPlayer, reducePlayerMoney }) => {
    return (
        <div className='lucky'>
            
            <button className='lucky-close' onClick={onClose}>Bezárás</button>
        </div>
    );
  };  

export default Lucky