import React, { useState, useEffect } from "react";

const Carshop = ({ onClose, currentPlayer, reducePlayerMoney, playerMoney, playerHasCar, updatePlayerHasCar }) => {
    const handlePurchase = (price) => {
        if (playerHasCar[currentPlayer] === 0) {
            if (playerMoney[currentPlayer] >= price) {
                reducePlayerMoney(currentPlayer, price);
                updatePlayerHasCar(currentPlayer);
            } else {
                alert("Nincs elég pénzed!");
            }
        } else {
            alert("Már van autód!");
        }
    };

    return (
        <div className="carshop">
            <img className="carshop-image" src="../src/HQ Pictures/Auto.png"/>
            <button
                className="CarButton"
                disabled={playerHasCar[currentPlayer] === 1}
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
