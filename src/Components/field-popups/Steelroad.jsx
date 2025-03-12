import { useGame } from "@/hooks/use-game";
import { useEffect, useState } from "react";

export function Steelroad() {
  const { currentPlayer, closePopup, buyTrainTicket, freeRideTrain } =
    useGame();

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const earlierTime = new Date(time.getTime() - 20 * 60000);

  return (
    <>
      <div className="flex gap-6 items-center justify-center">
        <img src="/src/Logos/MKV logo.png" alt="MKV logo" className="h-24" />
      </div>
      <div className="bg-[#c6eef8] rounded-xl p-6 pt-12 shadow-[0_0_1.5rem_rgba(0,0,0,0.4)] flex flex-col gap-12">
        <h2 className="text-center text-2xl font-bold">
          Utazás a következő megállóra
        </h2>
        <div className="bg-[lightblue] rounded-lg p-2 flex flex-col gap-2 items-center">
          <div className="flex gap-4 items-center w-full my-8">
            <div className="flex-1 flex gap-2 flex-col items-center">
              <div className="font-semibold text-3xl">
                {earlierTime.toLocaleTimeString("hu-HU", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                -{" "}
                {earlierTime.toLocaleTimeString("hu-HU", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              <div className="font-medium italic text-3xl text-red-500">
                {time.toLocaleTimeString("hu-HU", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                -{" "}
                {time.toLocaleTimeString("hu-HU", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
            <div className="flex-1 text-red-500 text-lg">
              Biztosítóberendezési hiba miatti késés
              <br />
              Pálya állapota miatti késés
            </div>
          </div>
          <div className="font-semibold text-xl mt-4">
            {currentPlayer.name}, szeretnél jegyet vásárolni? (3000 Ft)
          </div>
          <div className="flex gap-4 mt-1 mb-2">
            <button
              className="font-medium text-lg bg-[#c6eef8] hover:bg-[#d4f4fc] active:scale-95 border-[0.1rem] border-black rounded-lg py-2 w-36 transition-all duration-100"
              onClick={() =>
                buyTrainTicket(currentPlayer.index, currentPlayer.position)
              }
            >
              Igen
            </button>
            <button
              className="font-medium text-lg bg-[#c6eef8] hover:bg-[#d4f4fc] active:scale-95 border-[0.1rem] border-black rounded-lg py-2 w-36 transition-all duration-100"
              onClick={() =>
                freeRideTrain(currentPlayer.index, currentPlayer.position)
              }
            >
              Bliccelek
            </button>
          </div>
        </div>
        <button
          className="bg-[lightblue] text-lg hover:bg-[lightblue]/50 active:scale-98 active:scale-x-99 border-[0.1rem] font-medium border-black rounded-lg p-2 mt-4 transition-all duration-100"
          onClick={closePopup}
        >
          Bezárás
        </button>
      </div>
    </>
  );
}
