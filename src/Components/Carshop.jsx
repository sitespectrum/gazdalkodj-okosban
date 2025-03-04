//@ts-check
import React from "react";
import { formatMoney } from "../lib/utils.js";
import { useCurrentPlayer } from "../hooks/use-current-player.js";
import { useAlert } from "../hooks/use-alert.js";
import { usePopup } from "../hooks/use-popup.js";

export default function Carshop() {
  const { player, updatePlayer } = useCurrentPlayer();
  const { showAlert } = useAlert();
  const { closePopup } = usePopup();

  /**
   * @param {number} price
   */
  function handlePurchase(price) {
    if (!player.hasCar) {
      if (player.money >= price) {
        updatePlayer({
          ...player,
          money: player.money - price,
          hasCar: true,
        });
      } else {
        showAlert("Nincs elég pénzed!");
      }
    } else {
      showAlert("Már van autód!");
    }
  }

  return (
    <>
      <div className="flex gap-6 items-center justify-between">
        <h1 className="flex-1 text-center text-2xl bg-black/50 font-semibold text-white rounded-xl p-2">
          Autóvásárlás
        </h1>
        <h1 className="flex-1 text-center text-2xl whitespace-nowrap bg-black/50 font-semibold text-white rounded-xl p-2">
          Egyenleg: {formatMoney(player.money)}
        </h1>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-[0_0_1.5rem_rgba(0,0,0,0.2)] flex flex-col gap-16">
        <p className="mt-12 text-center text-3xl font-semibold">
          Ár: 1 000 000 Ft
        </p>
        <img className="h-48 mx-auto" src="../src/HQ Pictures/Auto.png" />
        <div className="flex w-full gap-6">
          <button
            className="flex-1 bg-gradient-to-b from-green-500/85 text-lg to-green-600 font-medium text-white rounded-lg px-4 py-2 disabled:from-neutral-300/75 disabled:to-neutral-600/85"
            disabled={player.hasCar || player.money < 1_000_000}
            onClick={() => handlePurchase(1_000_000)}
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
