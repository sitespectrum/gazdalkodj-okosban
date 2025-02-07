import React, { useState } from 'react';

const Elza = ({ onClose, currentPlayer, playerInventory, reducePlayerMoney, addItemToInventory, playerMoney}) => {
  const [isTVButtonDisabled, setIsTVButtonDisabled] = useState(playerInventory[currentPlayer].includes('Sumasang 4K TV'));
  const [isWMButtonDisabled, setIsWMButtonDisabled] = useState(playerInventory[currentPlayer].includes('GL előltöltős mosógép'));
  const [isDRButtonDisabled, setIsDRButtonDisabled] = useState(playerInventory[currentPlayer].includes('Boss előltöltős szárítógép'));
  const [isFRButtonDisabled, setIsFRButtonDisabled] = useState(playerInventory[currentPlayer].includes('Görénye alulfagyasztós hűtő'));
  const [isDWButtonDisabled, setIsDWButtonDisabled] = useState(playerInventory[currentPlayer].includes('Kendi mosogatógép'));
  const [isVButtonDisabled, setIsVButtonDisabled] = useState(playerInventory[currentPlayer].includes('Dájszon porszívó'));

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
    <div className="sumasang">
      <p>
        Sumasang 4K TV - 119 990 Ft
        <button
          className="buyButton"
          disabled={isTVButtonDisabled}
          onClick={() => {
            handlePurchase('Sumasang 4K TV', 119990);
            setIsTVButtonDisabled(true);
          }}
        >
          Vásárlás
        </button>
      </p>
      <p>
        GL előltöltős mosógép - 99 990 Ft
        <button
          className="buyButton"
          disabled={isWMButtonDisabled}
          onClick={() => {
            handlePurchase('GL előltöltős mosógép', 99990);
            setIsWMButtonDisabled(true);
          }}
        >
          Vásárlás
        </button>
      </p>
      <p>
        Boss előltöltős szárítógép - 129 990 Ft
        <button
          className="buyButton"
          disabled={isDRButtonDisabled}
          onClick={() => {
            handlePurchase('Boss előltöltős szárítógép', 129990);
            setIsDRButtonDisabled(true);
          }}
        >
          Vásárlás
        </button>
      </p>
      <p>
        Görénye alulfagyasztós hűtő - 84 990 Ft
        <button
          className="buyButton"
          disabled={isFRButtonDisabled}
          onClick={() => {
            handlePurchase('Görénye alulfagyasztós hűtő', 84990);
            setIsFRButtonDisabled(true);
          }}
        >
          Vásárlás
        </button>
      </p>
      <p>
        Kendi mosogatógép - 109 990 Ft
        <button
          className="buyButton"
          disabled={isDWButtonDisabled}
          onClick={() => {
            handlePurchase('Kendi mosogatógép', 109990);
            setIsDWButtonDisabled(true);
          }}
        >
          Vásárlás
        </button>
      </p>
      <p>
        Dájszon porszívó - 124 990 Ft
        <button
          className="buyButton"
          disabled={isVButtonDisabled}
          onClick={() => {
            handlePurchase('Dájszon porszívó', 124990);
            setIsVButtonDisabled(true);
          }}
        >
          Vásárlás
        </button>
      </p>
      <button className="sumasang-close" onClick={onClose}>
        Bezárás
      </button>
    </div>
  );
};

export default Elza;