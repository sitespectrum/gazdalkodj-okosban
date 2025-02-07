import React, { useState } from 'react';

const Idea = ({ onClose, currentPlayer, playerInventory, reducePlayerMoney, addItemToInventory}) => {
  const [isKButtonDisabled, setIsKButtonDisabled] = useState(playerInventory[currentPlayer].includes("Konyhabútor"));
  const [isRButtonDisabled, setIsRButtonDisabled] = useState(playerInventory[currentPlayer].includes("Szobabútor"));
  const [isBRButtonDisabled, setIsBRButtonDisabled] = useState(playerInventory[currentPlayer].includes("Fürdőszobabútor"));

  const handlePurchase = (item, price) => {
    if (playerMoney[currentPlayer] >= price) {
      reducePlayerMoney(currentPlayer, price);
      addItemToInventory(currentPlayer, item);
    }

    else {
      alert("Nincs elég pénzed!");
    }
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