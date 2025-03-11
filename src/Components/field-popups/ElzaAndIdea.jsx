import { useGame } from "@/hooks/use-game";
import { PURCHASEABLE_ITEMS } from "@/lib/constants";
import { formatMoney } from "@/lib/utils.js";
import { Fragment, useEffect, useState } from "react";

const shopItems = Object.values(PURCHASEABLE_ITEMS).filter(
  (item) => !["house", "car", "phone"].includes(item.id)
);

export function ElzaAndIdea() {
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
      <div className="flex gap-6 items-center justify-between">
        <h1 className="flex-1 text-center text-2xl bg-black/50 font-semibold text-white rounded-xl p-2">
          Bevásárlóközpont
        </h1>
        <h1 className="flex-1 text-center text-2xl bg-black/50 font-semibold text-white rounded-xl p-2">
          Egyenleg: {formatMoney(currentPlayer.money)}
        </h1>
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
          className="bg-gradient-to-b from-yellow-600/85 text-lg to-orange-600 mt-8 font-medium text-white rounded-lg px-4 py-2"
          onClick={closePopup}
        >
          Bezárás
        </button>
      </div>
    </>
  );
}
