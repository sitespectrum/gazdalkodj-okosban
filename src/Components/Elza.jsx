import React, { useState, useContext, useEffect } from "react";
import { formatMoney } from "./CurrentPlayerPanel";
import { moneyContext, alertContext } from "../main.jsx";

const shopItems = [
  {
    name: "Sumasang 4K TV",
    price: 119_990,
  },
  {
    name: "GL előltöltős mosógép",
    price: 99_990,
  },
  {
    name: "Boss előltöltős szárítógép",
    price: 129_990,
  },
  {
    name: "Görénye alulfagyasztós hűtő",
    price: 84_990,
  },
  {
    name: "Kendi mosogatógép",
    price: 109_990,
  },
  {
    name: "Dájszon porszívó",
    price: 124_990,
  },
];

const Elza = ({
  onClose,
  currentPlayer,
  playerInventory,
  reducePlayerMoney,
  addItemToInventory,
}) => {
  const [playerMoney] = useContext(moneyContext);
  const [_, setAlertContent, __, setShowAlertOnPopup] =
    useContext(alertContext);

  const [disabledItems, setDisabledItems] = useState([]);

  useEffect(() => {
    setDisabledItems([
      ...disabledItems,
      ...shopItems.filter((item) =>
        playerInventory[currentPlayer].includes(item.name)
      ),
    ]);
  }, [playerInventory]);

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
      <div className=" flex gap-12 items-stretch justify-between">
        <img src="./src/Logos/Elza logo.png" className="w-48 -mt-4" />
        <div className="bg-black/50 rounded-xl px-8 py-3 text-2xl flex items-center justify-center text-white font-semibold">
          Egyenleg: {formatMoney(playerMoney[currentPlayer])}
        </div>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-[0_0_1.5rem_rgba(0,0,0,0.2)] flex flex-col gap-4">
        {shopItems.map((item, index) => (
          <>
            <div
              className="flex justify-between items-center gap-4"
              key={index}
            >
              <span className="text-lg">{item.name}</span>
              <span className="text-lg font-semibold ml-auto">
                {formatMoney(item.price)}
              </span>
              <button
                className="buyButton rounded-lg px-4 py-2 bg-gradient-to-b from-[lightgrey]/50 to-[grey]/50 text-black border-none"
                disabled={
                  disabledItems.includes(item.name) ||
                  playerMoney[currentPlayer] < item.price
                }
                onClick={() => {
                  handlePurchase(item.name, item.price);
                  setDisabledItems([...disabledItems, item.name]);
                }}
              >
                Vásárlás
              </button>
            </div>
            {index !== shopItems.length - 1 && (
              <div className="border-b border-gray-300" />
            )}
          </>
        ))}

        <button
          className="rounded-lg text-lg mt-8 px-4 py-2 bg-gradient-to-b from-lime-500/75 to-lime-600/100 text-white border-none"
          onClick={onClose}
        >
          Bezárás
        </button>
      </div>
    </>
  );
};

export default Elza;
