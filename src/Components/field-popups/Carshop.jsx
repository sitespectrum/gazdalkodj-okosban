import { useGame } from "@/hooks/use-game";
import { PURCHASEABLE_ITEMS } from "@/lib/constants";
import { formatMoney } from "@/lib/utils.js";

/** @typedef {import("@/lib/types").ShopItem} ShopItem */

export function Carshop() {
  const { currentPlayer, buyItem, closePopup } = useGame();

  return (
    <>
      <div className="flex gap-6 items-center justify-between">
        <h1 className="flex-1 text-center text-2xl bg-black/50 font-semibold text-white rounded-xl p-2">
          Autóvásárlás
        </h1>
        <h1 className="flex-1 text-center text-2xl whitespace-nowrap bg-black/50 font-semibold text-white rounded-xl p-2">
          Egyenleg: {formatMoney(currentPlayer.money)}
        </h1>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-[0_0_1.5rem_rgba(0,0,0,0.2)] flex flex-col gap-16">
        <p className="mt-12 text-center text-3xl font-semibold">
          Ár: 2 500 000 Ft
        </p>
        <img className="h-48 mx-auto" src="/src/HQ Pictures/Auto.png" />
        <div className="flex w-full gap-6">
          <button
            className="flex-1 bg-gradient-to-b from-green-500/85 text-lg to-green-600 font-medium text-white rounded-lg px-4 py-2 disabled:from-neutral-300/75 disabled:to-neutral-600/85"
            disabled={
              currentPlayer.inventory.includes("car") ||
              currentPlayer.money < 1_000_000
            }
            onClick={() => buyItem(currentPlayer.index, PURCHASEABLE_ITEMS.car)}
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
