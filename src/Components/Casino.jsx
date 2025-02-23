import React, { useState, useContext } from "react";
import { moneyContext, alertContext } from "../main.jsx";
import { formatMoney } from "./CurrentPlayerPanel.jsx";

const Casino = ({
  onClose,
  currentPlayer,
  reducePlayerMoney,
  addPlayerMoney,
}) => {
  const [playerMoney] = useContext(moneyContext);
  const [_, setAlertContent, __, setShowAlertOnPopup] =
    useContext(alertContext);

  const [playerCards, setPlayerCards] = useState([]);
  const [dealerCards, setDealerCards] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");
  const [bet, setBet] = useState(10);
  const [gameStarted, setGameStarted] = useState(false);

  const getTotal = (cards) => cards.reduce((sum, card) => sum + card, 0);

  const startGame = () => {
    if (playerMoney[currentPlayer] < bet) {
      setAlertContent("Nincs elég pénzed a tét megtételéhez!");
      setShowAlertOnPopup(true);
      return;
    }

    reducePlayerMoney(currentPlayer, bet);

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
      addPlayerMoney(currentPlayer, bet * 2);
    } else if (finalPlayerTotal < finalDealerTotal) {
      setMessage("Vesztettél!");
    } else {
      setMessage("Döntetlen! Visszakaptad a tétet.");
      addPlayerMoney(currentPlayer, bet);
    }
    setGameOver(true);
  };

  const getRandomCard = () => Math.floor(Math.random() * 11) + 1;

  return (
    <>
      <div className="casino-header">
        <h1 className="casino-title">Casino</h1>
        <h1 className="casino-balance">
          Egyenleg: {formatMoney(playerMoney[currentPlayer])}
        </h1>
      </div>
      <div className="casino">
        <h1 className="game-title">Blackjack</h1>
        <input
          type="number"
          placeholder="Tét"
          value={bet}
          min="1"
          max={playerMoney[currentPlayer]}
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
        <button className="casino-close" onClick={onClose}>
          Bezárás
        </button>
      </div>
    </>
  );
};

export default Casino;
