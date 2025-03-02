//@ts-check
import React, { useState, useEffect } from "react";
import { formatMoney } from "../lib/utils.js";
import { useCurrentPlayer } from "../hooks/use-current-player.js";
import { useAlert } from "../hooks/use-alert.js";
import { usePopup } from "../hooks/use-popup.js";

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

export default function Elza() {
  const { player, updatePlayer } = useCurrentPlayer();
  const { showAlert } = useAlert();
  const { closePopup } = usePopup();

  /** @type {[string[], React.Dispatch<React.SetStateAction<string[]>>]} */
  const [disabledItems, setDisabledItems] = useState(
    /** @type {string[]} */ ([])
  );

  useEffect(() => {
    setDisabledItems([
      ...disabledItems,
      ...shopItems
        .filter((item) => player.inventory.includes(item.name))
        .map((item) => item.name),
    ]);
  }, [player.inventory]);

  const handlePurchase = (item, price) => {
    if (player.money >= price) {
      updatePlayer({
        ...player,
        money: player.money - price,
        inventory: [...player.inventory, item],
      });
    } else {
      showAlert("Nincs elég pénzed!", {
        showOnPopup: true,
      });
    }
  };

  return (
    <>
      <div className=" flex gap-12 items-stretch justify-between">
        <img src="./src/Logos/Elza logo.png" className="w-48 -mt-4" />
        <div className="bg-black/50 rounded-xl px-8 py-3 text-2xl flex items-center justify-center text-white font-semibold">
          Egyenleg: {formatMoney(player.money)}
        </div>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-[0_0_1.5rem_rgba(0,0,0,0.2)] flex flex-col gap-4">
        {shopItems.map((item, index) => (
          <React.Fragment key={item.name}>
            <div className="flex justify-between items-center gap-4">
              <span className="text-lg">{item.name}</span>
              <span className="text-lg font-semibold ml-auto">
                {formatMoney(item.price)}
              </span>
              <button
                className="buyButton rounded-lg px-4 py-2 bg-gradient-to-b from-[lightgrey]/50 to-[grey]/50 text-black border-none"
                disabled={
                  disabledItems.includes(item.name) || player.money < item.price
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
          </React.Fragment>
        ))}

        <button
          className="rounded-lg text-lg mt-8 px-4 py-2 bg-gradient-to-b from-lime-500/75 to-lime-600/100 text-white border-none"
          onClick={closePopup}
        >
          Bezárás
        </button>
      </div>
    </>
  );
}
