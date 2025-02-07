import React, { useState, useEffect } from "react";
import App from "../App.jsx";

const Carshop = ({ onClose, currentPlayer, reducePlayerMoney, playerMoney, playerHasCar, setPlayerHasCar}) => {

    const [isCarButtonDisabled, setIsCarButtonDisabled] = useState(false);

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
                alert("Nincs elég pénzed!");
                setIsCarButtonDisabled(true);
            }
        } else {
            alert("Már van autód!");
            setIsCarButtonDisabled(true);
        }
    };

    return (
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
    );
};


export default Carshop;
