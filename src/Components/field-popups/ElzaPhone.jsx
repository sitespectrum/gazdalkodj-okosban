import { useGame } from "@/hooks/use-game";
import { usePopup } from "@/hooks/use-popup.js";
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

export function ElzaPhone({ time, battery, closeApp }) {
  const { currentPlayer, buyItem } = useGame();

  /** @type {[string[], React.Dispatch<React.SetStateAction<string[]>>]} */
  const [disabledItems, setDisabledItems] = useState(
    /** @type {string[]} */ ([]),
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
        <div className='bg-white flex flex-col absolute inset-0 bg-cover bg-center top-[0.6rem] right-[0.6rem] left-[0.6rem] bottom-[0.6rem] rounded-[2.4rem] items-center'>
            <div className="grid grid-cols-3 gap-20 ml-[1.1rem] mt-[0.6rem] mb-[0.6rem] mr-[1.1rem] h-[3rem]">
                <div className='text-[1.1rem] font-bold'>{time.toLocaleTimeString("hu-HU", { hour: "2-digit", minute: "2-digit" })}</div>
                <div className='font-bold text-[8rem] mt-[-7.5rem] pl-[0.4rem]'>.</div>
                <div className='font-bold text-[1.1rem] text-right'>{battery}%</div>
            </div>
            <div className="grid grid-cols-1 gap-6 mt-[3rem] mb-[0.6rem] absolute">
                <div className="bg-white rounded-xl pl-9 pr-9 pt-5 pb-5 shadow-[0_0_1.5rem_rgba(0,0,0,0.2)] flex flex-col gap-4 max-h-[32rem] overflow-y-auto no-scrollbar">
                    {shopItems.map((item, index) => (
                    <Fragment key={item.id}>
                        <div className="flex flex-col gap-4">
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
                </div>
                <button
                className="rounded-xl text-lg mb-[0.5rem] px-4 py-2 bg-gradient-to-b from-lime-500/75 to-lime-600/100 text-white border-none"
                onClick={closeApp}
                >
                Bezárás
                </button>
            </div>
        </div>
    </>
  );
}
