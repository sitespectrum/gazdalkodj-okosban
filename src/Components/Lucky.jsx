import React, { useState, useContext } from "react";
import { moneyContext } from "../main.jsx";

const Lucky = ({ onClose, currentPlayer, addPlayerMoney, reducePlayerMoney}) => {

  const [playerMoney, setPlayerMoney] = useContext(moneyContext);
  const luckyCards = [
    {
      id: 1,
      text: "Tipszmixen 100 000 forintot nyertél.",
      action: (currentPlayer, { addPlayerMoney }) => addPlayerMoney(currentPlayer, 100000),
    },
    {
      id: 2,
      text: "Étteremben ebédeltél, fizess 20 000 Ft-ot.",
      action: (currentPlayer, { reducePlayerMoney }) => reducePlayerMoney(currentPlayer, 20000),
    },
    {
      id: 3,
      text: "Szeretsz focizni, ezért meglepted magad egy 20 000 Ft értékű Pumba cipővel.",
      action: (currentPlayer, { reducePlayerMoney }) => reducePlayerMoney(currentPlayer, 20000),
    },
    {
      id: 4,
      text: "Munkahelyeden túlóráztál, ezért kapsz 60 000 forintot.",
      action: (currentPlayer, { addPlayerMoney }) => addPlayerMoney(currentPlayer, 60000),
    },
    {
      id: 5,
      text: "Egy kétes megbízhatóságú weboldalon ingyen Sumasang P25 Ultrákat osztottak, neked csak meg kellett adnod a kártyaadataidat. Ellopták az összes pénzed.",
      action: () => {
        setPlayerMoney((prevMoney) => {
          const newMoney = [...prevMoney];
          newMoney[currentPlayer] = 0;
          return newMoney;
        });
      },    
    },
  ];

  const [currentCard] = useState(
    luckyCards[Math.floor(Math.random() * luckyCards.length)]
  );

  const handleCardAction = () => {
    currentCard.action(currentPlayer, { addPlayerMoney, reducePlayerMoney });
    onClose();
  };

  const [flipped, setFlipped] = useState(false);

    const handleFlip = () => {
    setFlipped(!flipped);
    };


  return (
    <div className="lucky">
        <div className={`luckycard-front ${flipped ? "animate" : ""}`}><p>Szerencsekártya</p></div>
        <div className={`luckycard-text ${flipped ? "animate" : ""}`}><p>{currentCard.text}</p></div>
        <button disabled={flipped} className="flip-button" onClick={handleFlip}>Húzás</button>
        <button className="close-lucky" onClick={handleCardAction}>Bezárás</button>
    </div>
  );
};

export default Lucky;