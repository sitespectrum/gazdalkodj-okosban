import React, { useState } from 'react';

const Idea = ({ onClose, currentPlayer, reducePlayerMoney, addItemToInventory}) => {
  const [isKButtonDisabled, setIsKButtonDisabled] = useState(false);
  const [isRButtonDisabled, setIsRButtonDisabled] = useState(false);
  const [isBRButtonDisabled, setIsBRButtonDisabled] = useState(false);

  const handlePurchase = (item, price) => {
    reducePlayerMoney(currentPlayer, price);
    addItemToInventory(currentPlayer, item);
  };

  return (
    <div className="idea">
      <p>
        Konyhabútor - 549 990 Ft
        <button
          className="buyButton"
          disabled={isKButtonDisabled}
          onClick={() => {
            handlePurchase('Konyhabútor', 549990);
            setIsKButtonDisabled(true);
          }}
        >
          Vásárlás
        </button>
      </p>
      <p>
        Szobabútor - 999 990 Ft
        <button
          className="buyButton"
          disabled={isRButtonDisabled}
          onClick={() => {
            handlePurchase('Szobabútor', 999990);
            setIsRButtonDisabled(true);
          }}
        >
          Vásárlás
        </button>
      </p>
      <p>
        Fürdőszobabútor - 349 990 Ft
        <button
          className="buyButton"
          disabled={isBRButtonDisabled}
          onClick={() => {
            handlePurchase('Fürdőszobabútor', 349990);
            setIsBRButtonDisabled(true);
          }}
        >
          Vásárlás
        </button>
      </p>
      <button className="idea-close" onClick={onClose}>
        Bezárás
      </button>
    </div>
  );
};

export default Idea;