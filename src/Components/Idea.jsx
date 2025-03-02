import React, { useContext, useState } from "react";
import { alertContext } from "../lib/contexts.js";
import { formatMoney } from "../lib/utils.js";

const Idea = ({
  onClose,
  currentPlayer,
  playerInventory,
  reducePlayerMoney,
  addItemToInventory,
}) => {
  const [playerMoney] = useContext(moneyContext);
  const [_, setAlertContent, __, setShowAlertOnPopup] =
    useContext(alertContext);

  const [isKButtonDisabled, setIsKButtonDisabled] = useState(
    playerInventory[currentPlayer].includes("Konyhabútor")
  );
  const [isRButtonDisabled, setIsRButtonDisabled] = useState(
    playerInventory[currentPlayer].includes("Szobabútor")
  );
  const [isBRButtonDisabled, setIsBRButtonDisabled] = useState(
    playerInventory[currentPlayer].includes("Fürdőszobabútor")
  );

  const handlePurchase = (item, price) => {
    if (playerMoney[currentPlayer] >= price) {
      reducePlayerMoney(currentPlayer, price);
      addItemToInventory(currentPlayer, item);
    } else {
      setAlertContent("Nincs elég pénzed!");
      setShowAlertOnPopup(true);
    }
  };

  return (
    <>
      <div className="idea-header">
        <img src="./src/Logos/Idea logo.png" className="idea-logo" />
        <div className="idea-balance">
          Egyenleg: {formatMoney(playerMoney[currentPlayer])}
        </div>
      </div>
      <div className="idea">
        <p>
          Konyhabútor - 549 990 Ft
          <button
            className="buyButton"
            disabled={isKButtonDisabled}
            onClick={() => {
              handlePurchase("Konyhabútor", 549990);
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
              handlePurchase("Szobabútor", 999990);
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
              handlePurchase("Fürdőszobabútor", 349990);
              setIsBRButtonDisabled(true);
            }}
          >
            Vásárlás
          </button>
        </p>
        <button className="idea-close" onClick={onClose}>
          Bezárás
        </button>
      </div>
    </>
  );
};

export default Idea;
