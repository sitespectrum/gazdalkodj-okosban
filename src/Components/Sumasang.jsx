import React, { useState } from 'react';

const Sumasang = ({ onClose, currentPlayer, reducePlayerMoney, addItemToInventory}) => {
  const [isTVButtonDisabled, setIsTVButtonDisabled] = useState(false);
  const [isWMButtonDisabled, setIsWMButtonDisabled] = useState(false);
  const [isDRButtonDisabled, setIsDRButtonDisabled] = useState(false);
  const [isFRButtonDisabled, setIsFRButtonDisabled] = useState(false);
  const [isDWButtonDisabled, setIsDWButtonDisabled] = useState(false);
  const [isVButtonDisabled, setIsVButtonDisabled] = useState(false);

  const handlePurchase = (item, price) => {
    reducePlayerMoney(currentPlayer, price);
    addItemToInventory(currentPlayer, item);
  };

  return (
    <div className="sumasang">
      <p>
        Sumasang 4K TV - 120 990 Ft
        <button
          className="buyButton"
          disabled={isTVButtonDisabled}
          onClick={() => {
            handlePurchase('Sumasang 4K TV', 120990);
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
            handlePurchase('GL előltöltős mosógép', 100000);
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
            handlePurchase('Boss előltöltős szárítógép', 130000);
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

export default Sumasang;