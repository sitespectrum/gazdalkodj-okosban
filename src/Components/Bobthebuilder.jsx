//@ts-check
import React from "react";
import { useAlert } from "../hooks/use-alert.js";
import { useCurrentPlayer } from "../hooks/use-current-player.js";
import { usePopup } from "../hooks/use-popup.js";
import { formatMoney } from "../lib/utils.js";

export default function Bobthebuilder() {
  const { player, updatePlayer } = useCurrentPlayer();
  const { showAlert } = useAlert();
  const { closePopup } = usePopup();

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
      <div className="flex gap-6 items-center justify-between">
        <h1 className="flex-1 text-center text-2xl bg-black/50 font-semibold text-white rounded-xl p-2">
          Házépítés
        </h1>
        <h1 className="flex-1 text-center text-2xl whitespace-nowrap bg-black/50 font-semibold text-white rounded-xl p-2">
          Egyenleg: {formatMoney(player.money)}
        </h1>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-[0_0_1.5rem_rgba(0,0,0,0.2)] flex flex-col gap-4">
        <p className="my-16 text-center text-3xl font-semibold">
          Ár: 25 000 000 Ft
        </p>
        <div className="flex w-full gap-6">
          <button
            className="flex-1 bg-gradient-to-b from-green-500/85 text-lg to-green-600 font-medium text-white rounded-lg px-4 py-2 disabled:from-neutral-300/75 disabled:to-neutral-600/85"
            disabled={
              player.inventory.includes("Ház") || player.money < 25_000_000
            }
            onClick={() => handlePurchase("Ház", 25_000_000)}
          >
            Vásárlás
          </button>
          <button
            className="flex-1 bg-gradient-to-b from-red-500/75 text-lg to-red-600 font-medium text-white rounded-lg px-4 py-2"
            onClick={closePopup}
          >
            Bezárás
          </button>
        </div>
      </div>
    </>
  );
}
