import { useGame } from "@/hooks/use-game";
import { PURCHASEABLE_ITEMS } from "@/lib/constants";
import { formatMoney } from "@/lib/utils.js";
import { Fragment, useEffect, useState } from "react";

const shopItems = [
  PURCHASEABLE_ITEMS.tv,
  PURCHASEABLE_ITEMS.washingMachine,
  PURCHASEABLE_ITEMS.dryer,
  PURCHASEABLE_ITEMS.fridge,
  PURCHASEABLE_ITEMS.dishwasher,
  PURCHASEABLE_ITEMS.vacuumCleaner,
];

export function Elza() {
  const { currentPlayer, buyItem, closePopup } = useGame();

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
        <img src="/src/Logos/Elza logo.png" className="w-48 -mt-4" />
        <div className="bg-black/50 rounded-xl px-8 py-3 text-2xl flex items-center justify-center text-white font-semibold">
          Egyenleg: {formatMoney(currentPlayer.money)}
        </div>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-[0_0_1.5rem_rgba(0,0,0,0.2)] flex flex-col gap-4">
        {shopItems.map((item, index) => (
          <Fragment key={item.id}>
            <div className="flex justify-between items-center gap-4">
              <span className="text-lg">{item.name}</span>
              <span className="text-lg font-semibold ml-auto">
                {formatMoney(item.price)}
              </span>
              <button
                className="buyButton rounded-lg px-4 py-2 bg-gradient-to-b from-[lightgrey]/50 to-[grey]/50 text-black border-none"
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
          className="rounded-lg text-lg mt-8 px-4 py-2 bg-gradient-to-b from-lime-500/75 to-lime-600/100 text-white border-none"
          onClick={closePopup}
        >
          Bezárás
        </button>
      </div>
    </>
  );
}
