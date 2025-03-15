import { useAlert } from "@/hooks/use-alert.js";
import { useGame } from "@/hooks/use-game";
import { INSURANCES } from "@/lib/constants";
import { formatMoney } from "@/lib/utils.js";
import { Fragment, useState } from "react";

export function Insurance() {
  const { currentPlayer, state, buyInsurance, closePopup } = useGame();

  return (
    <>
      <div className="flex gap-6 items-center justify-between">
        <h1 className="flex-1 text-center text-2xl bg-black/50 font-semibold text-white rounded-xl p-2">
          Biztosító
        </h1>
        <h1 className="flex-1 text-center text-2xl bg-black/50 font-semibold text-white rounded-xl p-2">
          Egyenleg: {formatMoney(currentPlayer.money)}
        </h1>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-[0_0_1.5rem_rgba(0,0,0,0.2)] flex flex-col gap-4">
        {INSURANCES.map((item, index) => (
          <Fragment key={item.id}>
            <div className="flex justify-between items-center gap-4">
              <span className="text-lg">{item.name}</span>
              <span className="text-lg font-semibold ml-auto">
                {formatMoney(item.price)}
              </span>
              <button
                className="buyButton rounded-lg px-4 py-2 bg-gradient-to-b from-[lightgrey]/50 to-[grey]/50 text-black border-none"
                disabled={
                  currentPlayer.insurances.includes(item.id) ||
                  currentPlayer.money < item.price ||
                  (item.condition &&
                    !item.condition({
                      currentPlayer,
                      gameState: state,
                      playerIndex: currentPlayer.index,
                    }))
                }
                onClick={() => {
                  buyInsurance(currentPlayer.index, item);
                }}
              >
                Vásárlás
              </button>
            </div>
            {index !== INSURANCES.length - 1 && (
              <div className="border-b border-gray-300" />
            )}
          </Fragment>
        ))}
        <button
          className="bg-gradient-to-b from-red-600/65 text-lg to-red-600 mt-20 font-medium text-white rounded-lg px-4 py-2"
          onClick={closePopup}
        >
          Bezárás
        </button>
      </div>
    </>
  );
}
