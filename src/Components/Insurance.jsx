import React, { useState, useContext } from 'react';
import { moneyContext, alertContext } from '../main';
import { formatMoney } from './CurrentPlayerPanel';
import Lucky from './Lucky';

const Insurance = ({ currentPlayer, reducePlayerMoney, onClose, playerHasCar }) => {
    const [playerHasCASCO, setPlayerHasCASCO] = useState(false);
    const [playerHasAccIns, setPlayerHasAccIns] = useState(false);
    const [playerHasHomeIns, setPlayerHasHomeIns] = useState(false);
    const [playerMoney] = useContext(moneyContext);
    const [_, setAlertContent, __, setShowAlertOnPopup] = useContext(alertContext);

    <Lucky 
      playerHasCASCO={playerHasCASCO}
      playerHasAccIns={playerHasAccIns}
      playerHasHomeIns={playerHasHomeIns}
    />

    const handleCASCOPurchase = (price) => {
        if (playerMoney[currentPlayer] >= price && playerHasCar[currentPlayer] === 1) {
            reducePlayerMoney(currentPlayer, price);
        }

        else if (playerMoney[currentPlayer] <= price) {
            setAlertContent("Nincs elég pénzed!");
            setShowAlertOnPopup(true);
        }

        else if (playerHasCar[currentPlayer] === 0) {
            setAlertContent("Nincs autód!");
            setShowAlertOnPopup(true);
        }
    }

    const handlePurchase = (price) => {
        if (playerMoney[currentPlayer] >= price) {
            reducePlayerMoney(currentPlayer, price);
        }

        else {
            setAlertContent("Nincs elég pénzed!");
            setShowAlertOnPopup(true);
        }
    }

    return (
        <>
        <div className='ins-header'>
            <h1 className='ins-title'>Biztosító</h1>
            <h1 className='ins-balance'>Egyenleg: {formatMoney(playerMoney[currentPlayer])}</h1>
        </div>
        <div className="insurance">
        <p>
          <button
            className="insBuyButton"
            disabled={playerHasCASCO}
            onClick={() => {
              handleCASCOPurchase(120000);
              setPlayerHasCASCO(true);
            }}
          >
            CASCO - 120 000 Ft
          </button>
        </p>

        <p>
          <button
            className="insBuyButton"
            disabled={playerHasAccIns}
            onClick={() => {
              handlePurchase(100000);
              setPlayerHasAccIns(true);
            }}
          >
            Balesetbiztosítás - 100 000 Ft
          </button>
        </p>

        <p>
          <button
            className="insBuyButton"
            disabled={playerHasHomeIns}
            onClick={() => {
              handlePurchase(1000000);
              setPlayerHasHomeIns(true);
            }}
          >
            Lakásbiztosítás - 1 000 000 Ft
          </button>
        </p>
        <button
            className="ins-close"
            onClick={onClose}
        >
            Bezárás
        </button>
        </div>
        </>
    )
}

export default Insurance;