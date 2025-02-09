import React, { useState, useContext } from "react";
import { formatMoney } from "./CurrentPlayerPanel.jsx";
import { alertContext } from "../main.jsx";
import { moneyContext } from "../main.jsx";

const Carshop = ({ onClose, currentPlayer, reducePlayerMoney, playerHasCar, setPlayerHasCar}) => {

    const [isCarButtonDisabled, setIsCarButtonDisabled] = useState(playerHasCar[currentPlayer]);
    const [_, setAlertContent, __, setShowAlertOnPopup] = useContext(alertContext);
    const [playerMoney] = useContext(moneyContext);

    const handlePurchase = (price) => {
        if (playerHasCar[currentPlayer] === 0) {
            if (playerMoney[currentPlayer] >= price) {
                setPlayerHasCar((prev) => {
                    const updated = [...prev];
                    updated[currentPlayer] = 1;
                    return updated;
                  });
                reducePlayerMoney(currentPlayer, price);
                setIsCarButtonDisabled(true);
            } else {
                setAlertContent("Nincs elég pénzed!");
                setShowAlertOnPopup(true);
                setIsCarButtonDisabled(true);
            }
        } else {
            setAlertContent("Már van autód!");
            setShowAlertOnPopup(true);
            setIsCarButtonDisabled(true);
        }
    };

    return (
        <>
        <div className='car-header'>
            <h1 className='car-title'>Autóvásárlás</h1>
            <h1 className='car-balance'>Egyenleg: {formatMoney(playerMoney[currentPlayer])}</h1>
        </div>
        <div className="carshop">
            <img className="carshop-image" src="../src/HQ Pictures/Auto.png"/>
            <button
                className="CarButton"
                disabled={isCarButtonDisabled}
                onClick={() => handlePurchase(1000000)}
            >
                Vásárlás
            </button>
            <button className="carshop-close" onClick={onClose}>
                Bezárás
            </button>
        </div>
        </>
    );
};


export default Carshop;
