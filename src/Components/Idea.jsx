//@ts-check
import React, { useEffect, useState } from "react";
import { useAlert } from "../hooks/use-alert.js";
import { useCurrentPlayer } from "../hooks/use-current-player.js";
import { usePopup } from "../hooks/use-popup.js";
import { formatMoney } from "../lib/utils.js";

const shopItems = [
  {
    name: "Konyhabútor",
    price: 549990,
  },
  {
    name: "Szobabútor",
    price: 999990,
  },
  {
    name: "Fürdőszobabútor",
    price: 349990,
  },
];

export default function Idea() {
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

  /**
   * @param {string} item
   * @param {number} price
   */
  function handlePurchase(item, price) {
    if (player.money >= price) {
      updatePlayer({
        ...player,
        money: player.money - price,
        inventory: [...player.inventory, item],
      });
    } else {
      showAlert("Nincs elég pénzed!");
    }
  }

  return (
    <>
      <div className=" flex gap-12 items-stretch justify-between">
        <img src="./src/Logos/Idea logo.png" className="w-48 rounded-xl" />
        <div className="bg-black/50 rounded-xl px-8 py-3 text-2xl flex items-center justify-center text-white font-semibold">
          Egyenleg: {formatMoney(player.money)}
        </div>
      </div>
      <div className="bg-[#007cc1] text-white rounded-xl p-6 shadow-[0_0_1.5rem_rgba(0,0,0,0.2)] flex flex-col gap-4">
        {shopItems.map((item, index) => (
          <React.Fragment key={item.name}>
            <div className="flex justify-between items-center gap-4">
              <span className="text-lg">{item.name}</span>
              <span className="text-lg font-semibold ml-auto">
                {formatMoney(item.price)}
              </span>
              <button
                className="buyButton rounded-lg px-4 py-2 bg-gradient-to-b from-neutral-100 to-neutral-300 disabled:from-neutral-300/75 disabled:to-neutral-600/85 disabled:text-neutral-200! !text-black border-none"
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
          className="rounded-lg text-lg mt-8 px-4 py-2 bg-gradient-to-b from-neutral-100 to-neutral-200 disabled:from-neutral-300/75 disabled:to-neutral-600/85 disabled:text-neutral-200! !text-black border-none"
          onClick={closePopup}
        >
          Bezárás
        </button>
      </div>
    </>
  );
}
