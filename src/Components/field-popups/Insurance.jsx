import { useAlert } from "@/hooks/use-alert.js";
import { useGame } from "@/hooks/use-game";
import { formatMoney } from "@/lib/utils.js";
import { useState } from "react";

export function Insurance() {
  const { currentPlayer, updateCurrentPlayer, closePopup } = useGame();
  const { showAlert } = useAlert();

  const [playerHasCASCO, setPlayerHasCASCO] = useState(false);
  const [playerHasAccIns, setPlayerHasAccIns] = useState(false);
  const [playerHasHomeIns, setPlayerHasHomeIns] = useState(false);

  const handleCASCOPurchase = (price) => {
    if (
      currentPlayer.money >= price &&
      currentPlayer.inventory.includes("car")
    ) {
      updateCurrentPlayer({
        ...currentPlayer,
        money: currentPlayer.money - price,
        hasCASCO: true,
      });
    } else if (currentPlayer.money <= price) {
      showAlert("Nincs elég pénzed!");
    } else if (!currentPlayer.inventory.includes("car")) {
      showAlert("Nincs autód!");
    }
  };

  const handlePurchase = (price) => {
    if (currentPlayer.money >= price) {
      updateCurrentPlayer({
        ...currentPlayer,
        money: currentPlayer.money - price,
      });
    } else {
      showAlert("Nincs elég pénzed!");
    }
  };

  return (
    <>
      <div className="ins-header">
        <h1 className="ins-title">Biztosító</h1>
        <h1 className="ins-balance">
          Egyenleg: {formatMoney(currentPlayer.money)}
        </h1>
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
        <button className="ins-close" onClick={closePopup}>
          Bezárás
        </button>
      </div>
    </>
  );
}
