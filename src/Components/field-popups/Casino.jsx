import { useAlert } from "@/hooks/use-alert";
import { useGame } from "@/hooks/use-game";
import { formatMoney } from "@/lib/utils.js";
import { useState } from "react";

export function Casino() {
  const { currentPlayer, updateCurrentPlayer, closePopup } = useGame();
  const { showAlert } = useAlert();

  const [playerCards, setPlayerCards] = useState([]);
  const [dealerCards, setDealerCards] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");
  const [bet, setBet] = useState(10);
  const [gameStarted, setGameStarted] = useState(false);

  const getTotal = (cards) => cards.reduce((sum, card) => sum + card, 0);

  const startGame = () => {
    if (currentPlayer.money < bet) {
      showAlert("Nincs elég pénzed a tét megtételéhez!");
      return;
    }

    updateCurrentPlayer({
      ...currentPlayer,
      money: currentPlayer.money - bet,
    });

    setPlayerCards([getRandomCard(), getRandomCard()]);
    setDealerCards([getRandomCard(), getRandomCard()]);

    setGameOver(false);
    setGameStarted(true);
    setMessage("");
  };

  const hit = () => {
    if (gameOver) return;
    const newCards = [...playerCards, getRandomCard()];
    setPlayerCards(newCards);
    if (getTotal(newCards) > 21) {
      setMessage("Túlmentél 21-en, vesztettél!");
      setGameOver(true);
    }
  };

  const stand = () => {
    if (gameOver) return;
    let newDealerCards = [...dealerCards];
    while (getTotal(newDealerCards) < 17) {
      newDealerCards.push(getRandomCard());
    }
    setDealerCards(newDealerCards);

    const finalDealerTotal = getTotal(newDealerCards);
    const finalPlayerTotal = getTotal(playerCards);

    if (finalDealerTotal > 21 || finalPlayerTotal > finalDealerTotal) {
      setMessage("Nyertél!");
      updateCurrentPlayer({
        ...currentPlayer,
        money: currentPlayer.money + bet * 2,
      });
    } else if (finalPlayerTotal < finalDealerTotal) {
      setMessage("Vesztettél!");
    } else {
      setMessage("Döntetlen! Visszakaptad a tétet.");
      updateCurrentPlayer({
        ...currentPlayer,
        money: currentPlayer.money + bet,
      });
    }
    setGameOver(true);
  };

  const getRandomCard = () => Math.floor(Math.random() * 11) + 1;

  return (
    <>
      <div className="casino-header">
        <h1 className="casino-title">Casino</h1>
        <h1 className="casino-balance">
          Egyenleg: {formatMoney(currentPlayer.money)}
        </h1>
      </div>
      <div className="casino">
        <h1 className="game-title">Blackjack</h1>
        <input
          type="number"
          placeholder="Tét"
          value={bet}
          min="1"
          max={currentPlayer.money}
          onChange={(e) => setBet(parseInt(e.target.value) || 1)}
          className="bet"
          disabled={gameStarted}
        />
        {!gameStarted ? (
          <button className="game-start" onClick={startGame}>
            Játék indítása
          </button>
        ) : (
          <>
            <div className="cards">
              <p>
                Játékos kártyái: {playerCards.join(", ")} (Összeg:{" "}
                {getTotal(playerCards)})
              </p>
              <p>
                Gép kártyái:{" "}
                {gameOver ? dealerCards.join(", ") : "??, " + dealerCards[1]}{" "}
                (Összeg: {gameOver ? getTotal(dealerCards) : "?"})
              </p>
            </div>
            {!gameOver ? (
              <>
                <button className="hit" onClick={hit}>
                  Kártya kérés
                </button>
                <button className="stand" onClick={stand}>
                  Passz
                </button>
              </>
            ) : (
              <>
                <p className="message">{message}</p>
                <button
                  className="new-game"
                  onClick={() => setGameStarted(false)}
                >
                  Új játék
                </button>
              </>
            )}
          </>
        )}
        <button className="casino-close" onClick={closePopup}>
          Bezárás
        </button>
      </div>
    </>
  );
}
