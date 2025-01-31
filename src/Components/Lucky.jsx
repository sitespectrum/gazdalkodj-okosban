import React, { useState } from "react";

const luckyCards = [
  {
    id: 1,
    text: "Kapsz 50,000 Ft-ot.",
    action: (currentPlayer, { addPlayerMoney }) => addPlayerMoney(currentPlayer, 50000),
  },
  {
    id: 2,
    text: "Fizess 200,000 Ft-ot.",
    action: (currentPlayer, { reducePlayerMoney }) => reducePlayerMoney(currentPlayer, 200000),
  },
  {
    id: 3,
    text: "Elveszítettél 20,000 Ft-ot.",
    action: (currentPlayer, { reducePlayerMoney }) => reducePlayerMoney(currentPlayer, 20000),
  },
  {
    id: 4,
    text: "Kapsz 70,000 Ft-ot.",
    action: (currentPlayer, { addPlayerMoney }) => addPlayerMoney(currentPlayer, 70000),
  },
];

const Lucky = ({ onClose, currentPlayer, addPlayerMoney, reducePlayerMoney }) => {
  const [currentCard] = useState(
    luckyCards[Math.floor(Math.random() * luckyCards.length)]
  );

  const handleCardAction = () => {
    currentCard.action(currentPlayer, { addPlayerMoney, reducePlayerMoney });
    onClose();
  };

  return (
    <div className="lucky">
      <h2>Szerencsekártya</h2>
      <p>{currentCard.text}</p>
      <button onClick={handleCardAction}>
        OK
      </button>
    </div>
  );
};

export default Lucky;