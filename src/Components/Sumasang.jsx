import React from 'react';

const Sumasang = ({ onClose, currentPlayer, reducePlayerMoney }) => {
    return (
        <div className='sumasang'>
            <p>Sumasang 65" QLED 8K TV - 599 990 Ft <button className='buyButton' onClick={() => reducePlayerMoney(currentPlayer, 599990)}>Vásárlás</button></p>
            <button className='sumasang-close' onClick={onClose}>Bezárás</button>
        </div>
    );
  };  

export default Sumasang