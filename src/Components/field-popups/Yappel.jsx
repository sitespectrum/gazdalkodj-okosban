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
      <div className="bg-white rounded-xl p-6 flex flex-col gap-4 text-white">
        <div>
          <p className="mt-4 mb-4 text-center text-3xl font-semibold text-black">
            Sumasang P25 Ultra Pro Max Slim 1TB <br />
            Ár: 1 000 000 Ft
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 flex flex-col gap-4">
          <img src="/src/HQ Pictures/Telefon.png" className="h-80 mx-auto"/>
        </div>
        <div className="flex w-full gap-6">
        <button
          className="flex-1 bg-gradient-to-b from bg-[#004a86] to-[#002340] font-medium text-white rounded-lg px-4 py-2 disabled:from-neutral-300/75 disabled:to-neutral-600/85"
          disabled={
            currentPlayer.inventory.includes("phone") ||
            currentPlayer.money < 1_000_000
          }
          onClick={() => buyItem(currentPlayer.index, PURCHASEABLE_ITEMS.phone)}
          >
            Vásárlás
          </button>

          <button
            className="flex-1 rounded-lg text-lg px-4 py-2 bg-gradient-to-b from bg-[#004a86] to-[#002340] text-white border-none"
            onClick={closePopup}
          >
            Bezárás
          </button>
        </div>
      </div>
    </>
  );
}
