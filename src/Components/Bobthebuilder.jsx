import React, { useState, useEffect } from "react";

const Bobthebuilder = ({ onClose, currentPlayer, reducePlayerMoney, playerMoney, addItemToInventory }) => {
    const [isBoButtonDisabled, setIsBoButtonDisabled] = useState(false);

    const handlePurchase = (item, price) => {
        if (playerMoney[currentPlayer] >= price) {
            reducePlayerMoney(currentPlayer, price);
            addItemToInventory(currentPlayer, item);
            setIsBoButtonDisabled(true);
        } 
        
        else {
            alert("Nincs elég pénzed!");
            setIsBoButtonDisabled(true);
        }
    };

    return (
        <div className="bobthebuilder">
            <button
                className="BoButton"
                disabled={isBoButtonDisabled}
                onClick={() => handlePurchase("Ház", 25000000)}
            >
                Vásárlás
            </button>
            <button
                className="bobthebuilder-close"
                onClick={onClose}
            ></button>
        </div>
    );
};

export default Bobthebuilder;
