import React, { useState, useContext } from "react";
import { alertContext } from "../main.jsx";

const Bobthebuilder = ({
  onClose,
  currentPlayer,
  playerInventory,
  playerMoney,
  reducePlayerMoney,
  addItemToInventory,
}) => {
  const [isBoButtonDisabled, setIsBoButtonDisabled] = useState(
    playerInventory[currentPlayer].includes("Ház")
  );
  const [_, setAlertContent, __, setShowAlertOnPopup] =
    useContext(alertContext);

  const handlePurchase = (item, price) => {
    if (playerMoney[currentPlayer] >= price) {
      reducePlayerMoney(currentPlayer, price);
      addItemToInventory(currentPlayer, item);
      setIsBoButtonDisabled(true);
    } else {
      setAlertContent("Nincs elég pénzed!");
      setShowAlertOnPopup(true);
      setIsBoButtonDisabled(true);
    }
  };

  return (
    <div className="bobthebuilder">
      <p className="price">Ár: 25 000 000 Ft</p>
      <button
        className="BoButton"
        disabled={isBoButtonDisabled}
        onClick={() => handlePurchase("Ház", 25000000)}
      >
        Vásárlás
      </button>
      <button className="bobthebuilder-close" onClick={onClose}>
        Bezárás
      </button>
    </div>
  );
};

export default Bobthebuilder;
