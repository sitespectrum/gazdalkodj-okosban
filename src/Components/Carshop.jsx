import React, { useState, useEffect } from "react";

const Carshop = ({ onClose, currentPlayer, reducePlayerMoney, playerMoney }) => {
    const [isCarButtonDisabled, setIsCarButtonDisabled] = useState(false);

    const handlePurchase = (price) => {
        if (playerMoney[currentPlayer] >= price) {
            reducePlayerMoney(currentPlayer, price);
            setIsCarButtonDisabled(true);
        } 
        
        else {
            alert("Nincs elég pénzed!");
            setIsCarButtonDisabled(true);
        }
    };

    return (
        <div className="carshop">
            <button
                className="CarButton"
                disabled={isCarButtonDisabled}
                onClick={() => handlePurchase(1000000)}
            >
                Vásárlás
            </button>
            <button
                className="carshop-close"
                onClick={onClose}
            ></button>
        </div>
    );
};

export default Carshop;
