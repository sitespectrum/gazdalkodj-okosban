import { useGame } from "@/hooks/use-game";
import { PURCHASEABLE_ITEMS } from "@/lib/constants";
import { formatMoney } from "@/lib/utils.js";
import { Fragment } from "react";

const shopItems = [
  PURCHASEABLE_ITEMS.kitchenFurniture,
  PURCHASEABLE_ITEMS.livingRoomFurniture,
  PURCHASEABLE_ITEMS.bathroomFurniture,
];

export function IdeaPhone({ time, closeApp }) {
  const { currentPlayer, buyItem } = useGame();

  return (
    <>
      <div className="bg-gradient-to-b from-[#0176b6] to-[#005481] flex flex-col absolute inset-0 bg-cover bg-center top-[0.6rem] right-[0.6rem] left-[0.6rem] bottom-[0.6rem] rounded-[2.4rem] items-center">
        <div className="grid grid-cols-3 text-white gap-20 ml-[1.1rem] mt-[0.6rem] mb-[0.6rem] mr-[1.1rem] h-[3rem]">
          <div className="text-[1.1rem] font-bold">
            {time.toLocaleTimeString("hu-HU", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
          <div className="font-bold text-[8rem] mt-[-7.5rem] pl-[0.4rem] text-black">
            .
          </div>
          <div className="font-bold text-[1.1rem] text-right">
            {currentPlayer.batteryPercentage}%
          </div>
        </div>
        <div className="grid grid-cols-1 gap-5 mt-[3rem] absolute">
          <div className="bg-white text-black rounded-xl pl-9 pr-9 pt-7 pb-5 shadow-[0_0_1.5rem_rgba(0,0,0,0.2)] flex flex-col gap-4 h-[33.2rem] overflow-y-auto no-scrollbar w-[19.5rem]">
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
                      currentPlayer.inventory.includes(item.id) ||
                      currentPlayer.money < item.price
                    }
                    onClick={() => {
                      buyItem(currentPlayer.index, item);
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
            className="rounded-t-xl rounded-b-4xl text-lg px-4 py-2 bg-gradient-to-b from-[#0d9fee] to-[#007cc1] text-white border-none"
            onClick={closeApp}
          >
            Bezárás
          </button>
        </div>
      </div>
    </>
  );
}
