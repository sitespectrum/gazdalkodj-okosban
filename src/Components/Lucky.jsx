import React, { useState, useContext } from "react";
import { moneyContext } from "../main.jsx";

const Lucky = ({
  onClose,
  currentPlayer,
  addPlayerMoney,
  reducePlayerMoney,
  playerHasCASCO,
  playerHasAccIns,
  playerHasHomeIns,
  playerHasCar,
}) => {
  const [playerMoney, setPlayerMoney] = useContext(moneyContext);
  const luckyCards = [
    {
      id: 1,
      text: "Tipszmixen 100 000 forintot nyertél.",
      action: (currentPlayer, { addPlayerMoney }) =>
        addPlayerMoney(currentPlayer, 100000),
    },
    {
      id: 2,
      text: "Étteremben ebédeltél, fizess 20 000 Ft-ot.",
      action: (currentPlayer, { reducePlayerMoney }) =>
        reducePlayerMoney(currentPlayer, 20000),
    },
    {
      id: 3,
      text: "Szeretsz focizni, ezért meglepted magad egy 20 000 Ft értékű Pumba cipővel.",
      action: (currentPlayer, { reducePlayerMoney }) =>
        reducePlayerMoney(currentPlayer, 20000),
    },
    {
      id: 4,
      text: "Munkahelyeden túlóráztál, ezért kapsz 60 000 forintot.",
      action: (currentPlayer, { addPlayerMoney }) =>
        addPlayerMoney(currentPlayer, 60000),
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
    {
      id: 6,
      text: "Összetörted az autód. Ha nincs rá biztosításod, fizess 200 000 Ft-ot.",
      action: () => {
        CASCOCard;
      },
    },
    {
      id: 7,
      text: "Balesetet szenvedtél. Ha nincs rá biztosításod, fizess a 50 000 Ft-ot.",
      action: () => {
        AccInsCard;
      },
    },
    {
      id: 8,
      text: "Kigyulladt a házad. Ha nincs rá biztosításod, fizess a 500 000 Ft-ot.",
      action: () => {
        HouseInsCard;
      },
    },
    {
      id: 9,
      text: "Vettél munkába menet egy kaparós sorsjegyet 5000 Forintért. ÉS MILYEN JÓL TETTED! LEKAPARTAD A FŐDÍJAT, AMI 25 000 000 FT!",
      action: (currentPlayer, { addPlayerMoney }) =>
        addPlayerMoney(currentPlayer, 25000000),
    },
    {
      id: 10,
      text: "Adóztál.",
      action: (currentPlayer, { reducePlayerMoney }) =>
        reducePlayerMoney(currentPlayer, playerMoney[currentPlayer] * 0.45),
    },
  ];

  let [currentCard] = useState();

  const chance = Math.floor(Math.random() * 1000) + 1;

  switch (playerHasCar[currentPlayer]) {
    case 1: {
      //Lottó
      if (chance >= 1 && chance <= 10) {
        currentCard = luckyCards[8];
      }

      //Nulla
      if (chance >= 11 && chance <= 20) {
        currentCard = luckyCards[9];
      }

      //Háztűz
      if (chance >= 21 && chance <= 60) {
        currentCard = luckyCards[7];
      }

      //Adó
      if (chance >= 61 && chance <= 100) {
        currentCard = luckyCards[4];
      }

      //Tipszmix
      if (chance >= 101 && chance <= 250) {
        currentCard = luckyCards[0];
      }

      //Étterem
      if (chance >= 251 && chance <= 400) {
        currentCard = luckyCards[1];
      }

      //Foci
      if (chance >= 401 && chance <= 550) {
        currentCard = luckyCards[2];
      }

      //Túlóra
      if (chance >= 551 && chance <= 700) {
        currentCard = luckyCards[3];
      }

      //CASCO
      if (chance >= 701 && chance <= 850) {
        currentCard = luckyCards[5];
      }

      //Baleset
      if (chance >= 851 && chance <= 1000) {
        currentCard = luckyCards[6];
      }
    }

    case 0: {
      //Lottó
      if (chance >= 1 && chance <= 10) {
        currentCard = luckyCards[8];
      }

      //Nulla
      if (chance >= 11 && chance <= 20) {
        currentCard = luckyCards[9];
      }

      //Háztűz
      if (chance >= 21 && chance <= 60) {
        currentCard = luckyCards[7];
      }

      //Adó
      if (chance >= 61 && chance <= 100) {
        currentCard = luckyCards[4];
      }

      //Tipszmix
      if (chance >= 101 && chance <= 250) {
        currentCard = luckyCards[0];
      }

      //Étterem
      if (chance >= 251 && chance <= 400) {
        currentCard = luckyCards[1];
      }

      //Foci
      if (chance >= 401 && chance <= 625) {
        currentCard = luckyCards[2];
      }

      //Túlóra
      if (chance >= 626 && chance <= 850) {
        currentCard = luckyCards[3];
      }

      //Baleset
      if (chance >= 851 && chance <= 1000) {
        currentCard = luckyCards[6];
      }
    }
  }

  const CASCOCard = () => {
    if (!playerHasCASCO) {
      reducePlayerMoney(currentPlayer, 60000);
    }
  };

  const AccInsCard = () => {
    if (!playerHasAccIns) {
      reducePlayerMoney(currentPlayer, 50000);
    }
  };

  const HouseInsCard = () => {
    if (!playerHasHomeIns) {
      reducePlayerMoney(currentPlayer, 500000);
    }
  };

  const handleCardAction = () => {
    currentCard.action(currentPlayer, { addPlayerMoney, reducePlayerMoney });
    onClose();
  };

  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  return (
    <>
      <h1 className="text-center font-semibold text-3xl bg-black/50 text-white rounded-xl p-2">
        Szerencsemező
      </h1>
      <div className="bg-[lightblue] shadow-[0_0_1.5rem_rgba(0,0,0,0.5)] rounded-xl p-12 px-20 flex flex-col gap-12 justify-center items-center">
        <div className="relative aspect-video h-56">
          <div
            className={`luckycard-front p-4 text-center absolute top-0 left-0 w-full font-semibold bg-[#fff77e] border-[0.15rem] shadow-xl shadow-black/20 border-black rounded-xl text-xl h-full flex justify-center items-center ${
              flipped ? "animate" : ""
            }`}
          >
            <p>Szerencsekártya</p>
          </div>
          <div
            className={`luckycard-text p-4 text-center absolute top-0 left-0 w-full font-semibold bg-[#fff77e] border-[0.15rem] shadow-xl shadow-black/20 border-black rounded-xl text-xl h-full flex justify-center items-center ${
              flipped ? "animate" : ""
            }`}
          >
            <p>{currentCard.text}</p>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <button
            disabled={flipped}
            className="bg-[#a0ecff] rounded-lg py-2.5 px-6 border-[0.15rem] border-black text-lg font-semibold"
            onClick={handleFlip}
          >
            Húzás
          </button>
          <button
            className="bg-[#a0ecff] rounded-lg py-2.5 px-6 border-[0.15rem] border-black text-lg font-semibold"
            onClick={handleCardAction}
          >
            Bezárás
          </button>
        </div>
      </div>
    </>
  );
};

export default Lucky;
