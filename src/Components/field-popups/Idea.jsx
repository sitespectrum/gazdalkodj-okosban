import { useGame } from "@/hooks/use-game";
import { usePopup } from "@/hooks/use-popup.js";
import { PURCHASEABLE_ITEMS } from "@/lib/constants";
import { formatMoney } from "@/lib/utils.js";
import { Fragment, useEffect, useState } from "react";

const shopItems = [
  PURCHASEABLE_ITEMS.kitchenFurniture,
  PURCHASEABLE_ITEMS.livingRoomFurniture,
  PURCHASEABLE_ITEMS.bathroomFurniture,
];

export function Idea() {
  const { currentPlayer, buyItem } = useGame();
  const { closePopup } = usePopup();

  /** @type {[string[], React.Dispatch<React.SetStateAction<string[]>>]} */
  const [disabledItems, setDisabledItems] = useState(
    /** @type {string[]} */ ([])
  );

  useEffect(() => {
    setDisabledItems([
      ...disabledItems,
      ...shopItems
        .filter((item) => currentPlayer.inventory.includes(item.id))
        .map((item) => item.id),
    ]);
  }, [currentPlayer.inventory]);

  return (
    <>
      <div className=" flex gap-12 items-stretch justify-between">
        <img src="/src/Logos/Idea logo.png" className="w-48 rounded-xl" />
        <div className="bg-black/50 rounded-xl px-8 py-3 text-2xl flex items-center justify-center text-white font-semibold">
          Egyenleg: {formatMoney(currentPlayer.money)}
        </div>
      </div>
      <div className="bg-[#007cc1] text-white rounded-xl p-6 shadow-[0_0_1.5rem_rgba(0,0,0,0.2)] flex flex-col gap-4">
        {shopItems.map((item, index) => (
          <Fragment key={item.id}>
            <div className="flex justify-between items-center gap-4">
              <span className="text-lg">{item.name}</span>
              <span className="text-lg font-semibold ml-auto">
                {formatMoney(item.price)}
              </span>
              <button
                className="buyButton rounded-lg px-4 py-2 bg-gradient-to-b from-neutral-100 to-neutral-300 disabled:from-neutral-300/75 disabled:to-neutral-600/85 disabled:text-neutral-200! !text-black border-none"
                disabled={
                  disabledItems.includes(item.id) ||
                  currentPlayer.money < item.price
                }
                onClick={() => {
                  buyItem(currentPlayer.index, item);
                  setDisabledItems([...disabledItems, item.id]);
                }}
              >
                Vásárlás
              </button>
            </div>
            {index !== shopItems.length - 1 && (
              <div className="border-b border-gray-300" />
            )}
          </Fragment>
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
