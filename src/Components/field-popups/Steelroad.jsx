import { useAlert } from "@/hooks/use-alert.js";
import { useGame } from "@/hooks/use-game";
import { usePopup } from "@/hooks/use-popup.js";
import { FIELDS } from "@/lib/fields-config.jsx";
import { useEffect, useState } from "react";

export function Steelroad() {
  const { currentPlayer, updateCurrentPlayer } = useGame();
  const { closePopup } = usePopup();
  const { showAlert } = useAlert();

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const earlierTime = new Date(time.getTime() - 20 * 60000);

  /**
   * @returns {[number, boolean]}
   */
  function getNextStop() {
    let nextStop = FIELDS.find(
      (x) => x.isStop && x.id > currentPlayer.position
    )?.id;
    let crossedStart = false;
    if (!nextStop) {
      nextStop = FIELDS.find((x) => x.isStop)?.id;
      crossedStart = true;
    }
    if (!nextStop) {
      console.log("[steelroad] No next stop found", {
        playerPosition: currentPlayer.position,
        fields: FIELDS,
      });
      nextStop = currentPlayer.position;
    }
    return [nextStop, crossedStart];
  }

  function handleBuyTicket() {
    if (currentPlayer.money < 3000) {
      showAlert("Nincs elég pénzed a jegyvásárláshoz!");
      return;
    }

    const [nextStop, crossedStart] = getNextStop();
    let moneyAdjustment = -3000;
    if (crossedStart) {
      moneyAdjustment += 150_000;
      if (!currentPlayer.inventory.includes("Ház")) {
        moneyAdjustment -= 70_000;
      }
    }

    updateCurrentPlayer((prevPlayer) => ({
      ...prevPlayer,
      money: currentPlayer.money + moneyAdjustment,
      position: nextStop,
    }));

    closePopup();
  }

  function handleNoTicket() {
    const shouldFine = Math.random();
    const [nextStop, crossedStart] = getNextStop();

    let moneyAdjustment = 0;
    if (shouldFine < 0.5) {
      moneyAdjustment = -40_000;
    }
    if (crossedStart) {
      moneyAdjustment += 150_000;
      if (!currentPlayer.inventory.includes("Ház")) {
        moneyAdjustment -= 70_000;
      }
    }

    updateCurrentPlayer((prevPlayer) => ({
      ...prevPlayer,
      position: nextStop,
      money: currentPlayer.money + moneyAdjustment,
    }));

    closePopup();

    if (shouldFine < 0.5) {
      showAlert(
        <>
          {currentPlayer.name} büntetést kapott!
          <br /> 40 000 Ft levonva.
        </>
      );
    }
  }

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
              onClick={handleBuyTicket}
            >
              Igen
            </button>
            <button
              className="font-medium text-lg bg-[#c6eef8] hover:bg-[#d4f4fc] active:scale-95 border-[0.1rem] border-black rounded-lg py-2 w-36 transition-all duration-100"
              onClick={handleNoTicket}
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
