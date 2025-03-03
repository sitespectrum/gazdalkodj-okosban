//@ts-check
import React, { useState } from "react";
import { useAlert } from "../hooks/use-alert.js";
import { useCurrentPlayer } from "../hooks/use-current-player.js";
import { usePopup } from "../hooks/use-popup.js";
import { formatMoney } from "../lib/utils.js";

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
  {
    name: "Konyhabútor",
    price: 549_990,
  },
  {
    name: "Szobabútor",
    price: 999_990,
  },
  {
    name: "Fürdőszobabútor",
    price: 349_990,
  },
];

export default function ElzaAndIdea() {
  const { player, updatePlayer } = useCurrentPlayer();
  const { showAlert } = useAlert();
  const { closePopup } = usePopup();

  /** @type {[string[], React.Dispatch<React.SetStateAction<string[]>>]} */
  const [disabledItems, setDisabledItems] = useState(
    /** @type {string[]} */ ([])
  );

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
      <div className="flex gap-6 items-center justify-between">
        <h1 className="flex-1 text-center text-2xl bg-black/50 font-semibold text-white rounded-xl p-2">
          Bevásárlóközpont
        </h1>
        <h1 className="flex-1 text-center text-2xl bg-black/50 font-semibold text-white rounded-xl p-2">
          Egyenleg: {formatMoney(player.money)}
        </h1>
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
          className="bg-gradient-to-b from-yellow-600/85 text-lg to-orange-600 mt-8 font-medium text-white rounded-lg px-4 py-2"
          onClick={closePopup}
        >
          Bezárás
        </button>
      </div>
    </>
  );
}
