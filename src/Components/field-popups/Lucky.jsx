import { useGame } from "@/hooks/use-game";
import { LUCKY_CARDS } from "@/lib/constants";

/** @typedef {import("@/lib/types").LuckyCard} LuckyCard */

export function Lucky() {
  const { currentPlayer, flipLuckyCard, closePopup } = useGame();

  const luckyCard = LUCKY_CARDS.find(
    (card) => card.id === currentPlayer.luckyID
  );

  return (
    <>
      <h1 className="text-center font-semibold text-3xl bg-black/50 text-white rounded-xl p-2">
        Szerencsemező
      </h1>
      <div className="bg-[lightblue] shadow-[0_0_1.5rem_rgba(0,0,0,0.5)] rounded-xl p-12 px-20 flex flex-col gap-12 justify-center items-center">
        <div className="relative aspect-video h-56">
          <div
            className={`luckycard-front z-[10001] p-4 text-center absolute top-0 left-0 w-full font-semibold bg-[#fff77e] border-[0.15rem] shadow-xl shadow-black/20 border-black rounded-xl text-xl h-full flex justify-center items-center ${
              currentPlayer.luckyFlipped ? "animate" : ""
            }`}
          >
            <p>Szerencsekártya</p>
          </div>
          <div
            className={`luckycard-text z-[10000] p-4 text-center absolute top-0 left-0 w-full font-semibold bg-[#fff77e] border-[0.15rem] shadow-xl shadow-black/20 border-black rounded-xl text-xl h-full flex justify-center items-center ${
              currentPlayer.luckyFlipped ? "animate" : ""
            }`}
          >
            <p>{luckyCard?.text}</p>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <button
            disabled={currentPlayer.luckyFlipped}
            className="bg-[#a0ecff] rounded-lg py-2.5 px-6 border-[0.15rem] border-black text-lg font-semibold"
            onClick={() => flipLuckyCard(currentPlayer.index)}
          >
            Húzás
          </button>
          <button
            className="bg-[#a0ecff] rounded-lg py-2.5 px-6 border-[0.15rem] border-black text-lg font-semibold"
            onClick={closePopup}
          >
            Bezárás
          </button>
        </div>
      </div>
    </>
  );
}
