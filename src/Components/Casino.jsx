import React, { useState } from "react";

const Casino = ({ onClose, currentPlayer, playerMoney, reducePlayerMoney, addPlayerMoney }) =>{
    const [playerCards, setPlayerCards] = useState([]);
    const [dealerCards, setDealerCards] = useState([]);
    const [gameOver, setGameOver] = useState(false);
    const [message, setMessage] = useState("");
    const [bet, setBet] = useState(10);
    const [gameStarted, setGameStarted] = useState(false);

    const getTotal = (cards) => cards.reduce((sum, card) => sum + card, 0);

    const startGame = () => {
      if (playerMoney[currentPlayer] < bet) {
        setMessage("Nincs elég pénzed a tét megtételéhez!");
        return;
      }

      // Levonás a pénzből
      reducePlayerMoney(currentPlayer, bet);

      // Kártyák osztása
      setPlayerCards([getRandomCard(), getRandomCard()]);
      setDealerCards([getRandomCard(), getRandomCard()]);

      // Játék indítása
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

    // A kártyák generálása
    const getRandomCard = () => Math.floor(Math.random() * 11) + 1; // A kártyák értéke 1-11 között van

    return (
      <div className="p-4 text-center bg-white rounded-lg shadow-lg relative">
        <button className="absolute top-2 right-2 text-gray-600" onClick={onClose}>
          ✖
        </button>
        <h1 className="text-xl font-bold">Blackjack</h1>
        <p>Pénzed: {playerMoney[currentPlayer]} $</p>
        <div className="my-2">
          <label className="block text-sm font-medium">Tét:</label>
          <input
            type="number"
            value={bet}
            min="1"
            max={playerMoney[currentPlayer]}
            onChange={(e) => setBet(parseInt(e.target.value) || 1)}
            className="border p-1 rounded w-20 text-center"
            disabled={gameStarted}
          />
        </div>
        {!gameStarted ? (
          <button className="m-2" onClick={startGame}>
            Játék indítása
          </button>
        ) : (
          <>
            <div className="my-4">
              <p>Játékos kártyái: {playerCards.join(", ")} (Összeg: {getTotal(playerCards)})</p>
              <p>
                Gép kártyái: {gameOver ? dealerCards.join(", ") : "??, " + dealerCards[1]} (Összeg:{" "}
                {gameOver ? getTotal(dealerCards) : "?"})
              </p>
            </div>
            {!gameOver ? (
              <>
                <button className="m-2" onClick={hit}>
                  Kártya kérés
                </button>
                <button className="m-2" onClick={stand}>
                  Passz
                </button>
              </>
            ) : (
              <>
                <p className="text-lg font-bold">{message}</p>
                <button className="m-2" onClick={() => setGameStarted(false)}>
                  Új játék
                </button>
              </>
            )}
          </>
        )}
      </div>
    );
  }

export default Casino;