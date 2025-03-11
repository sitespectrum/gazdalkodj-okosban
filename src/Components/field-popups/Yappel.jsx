import { useGame } from "@/hooks/use-game";
import { usePopup } from "@/hooks/use-popup.js";
import { formatMoney } from "@/lib/utils.js";
import { useState } from "react";
import { PURCHASEABLE_ITEMS } from "@/lib/constants";

/** @typedef {import("@/lib/types").ShopItem} ShopItem */

export function Yappel() {
  const { currentPlayer, buyItem } = useGame();
  const { closePopup } = usePopup();

  /** @type {[string[], React.Dispatch<React.SetStateAction<string[]>>]} */
  const [disabledItems, setDisabledItems] = useState(
    /** @type {string[]} */ ([])
  );

  return (
    <>
      <div className=" flex gap-12 items-stretch justify-between">
        <img src="/src/Logos/Yappel logo.png" className="w-48 mt-4 ml-2 object-contain" />
        <div className="bg-black/50 rounded-xl px-8 py-3 text-2xl flex items-center justify-center text-white font-semibold">
          Egyenleg: {formatMoney(currentPlayer.money)}
        </div>
      </div>
      <div className="bg-[#002340] rounded-xl p-6 shadow-[0_0_1.5rem_rgba(0,0,0,0.2)] flex flex-col gap-4 text-white">
        <div className="">

        </div>

        <div>

        </div>

        <button
            className="flex-1 bg-[#76a900] font-medium text-white rounded-lg px-4 py-2 disabled:from-neutral-300/75 disabled:to-neutral-600/85"
            disabled={
              currentPlayer.inventory.includes("phone") ||
              currentPlayer.money < 1_000_000
            }
            onClick={() => buyItem(currentPlayer.index, PURCHASEABLE_ITEMS.phone)}
          >
            Vásárlás
          </button>

        <button
          className="rounded-lg text-lg mt-8 px-4 py-2 bg-[#76a900] text-white border-none"
          onClick={closePopup}
        >
          Bezárás
        </button>
      </div>
    </>
  );
}
