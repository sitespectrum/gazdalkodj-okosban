import React, { useState, useContext } from 'react';
import { moneyContext, alertContext } from '../main.jsx';
import { formatMoney } from './CurrentPlayerPanel.jsx';

const ElzaAndIdea = ({ onClose, currentPlayer, playerInventory, reducePlayerMoney, addItemToInventory}) => {
  const [playerMoney] = useContext(moneyContext);
  const [_, setAlertContent, __, setShowAlertOnPopup] = useContext(alertContext);

  const [isTVButtonDisabled, setIsTVButtonDisabled] = useState(playerInventory[currentPlayer].includes("Sumasang 4K TV"));
  const [isWMButtonDisabled, setIsWMButtonDisabled] = useState(playerInventory[currentPlayer].includes("GL előltöltős mosógép"));
  const [isDRButtonDisabled, setIsDRButtonDisabled] = useState(playerInventory[currentPlayer].includes("Boss előltöltős szárítógép"));
  const [isFRButtonDisabled, setIsFRButtonDisabled] = useState(playerInventory[currentPlayer].includes("Görénye alulfagyasztós hűtő"));
  const [isDWButtonDisabled, setIsDWButtonDisabled] = useState(playerInventory[currentPlayer].includes("Kendi mosogatógép"));
  const [isVButtonDisabled, setIsVButtonDisabled] = useState(playerInventory[currentPlayer].includes("Dájszon porszívó"));
  const [isKButtonDisabled, setIsKButtonDisabled] = useState(playerInventory[currentPlayer].includes("Konyhabútor"));
  const [isRButtonDisabled, setIsRButtonDisabled] = useState(playerInventory[currentPlayer].includes("Szobabútor"));
  const [isBRButtonDisabled, setIsBRButtonDisabled] = useState(playerInventory[currentPlayer].includes("Fürdőszobabútor"));
  const [isPHButtonDisabled, setIsPHButtonDisabled] = useState(playerInventory[currentPlayer].includes("Sumasang P25 Ultra 1TB"));

  const handlePurchase = (item, price) => {
    if (playerMoney[currentPlayer] >= price) {
      reducePlayerMoney(currentPlayer, price);
      addItemToInventory(currentPlayer, item);
    }

    else {
      setAlertContent("Nincs elég pénzed!");
      setShowAlertOnPopup(true);
    }
  };

  return (
    <>
      <div className='eai-header'>
        <h1 className='eai-title'>Bevásárlóközpont</h1>
        <h1 className='eai-balance'>Egyenleg: {formatMoney(playerMoney[currentPlayer])}</h1>
      </div>
      <div className="elzaandidea">
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
        <p>
          Sumasang P25 Ultra 1TB - 999 990 Ft
          <button
            className="buyButton"
            disabled={isPHButtonDisabled}
            onClick={() => {
              handlePurchase('Sumasang P25 Ultra 1TB', 999990);
              setIsPHButtonDisabled(true);
            }}
          >
            Vásárlás
          </button>
        </p>
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
        <button className="eai-close" onClick={onClose}>
          Bezárás
        </button>
      </div>
    </>
  );
};

export default ElzaAndIdea;