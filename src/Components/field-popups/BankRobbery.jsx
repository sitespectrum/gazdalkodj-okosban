import { useGame } from "@/hooks/use-game";
import { formatMoney } from "@/lib/utils.js";
import { useEffect, useState } from "react";

export function BankRobbery() {
  const {
    currentPlayer,
    successfulBankRobbery,
    failedBankRobbery,
    closePopup,
  } = useGame();

  const [isRobbing, setIsRobbing] = useState(false);
  const [countdown, setCountdown] = useState(
    /** @type {number | null} */ (null)
  );
  const [clickCount, setClickCount] = useState(0);
  const [escapeVisible, setEscapeVisible] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (isRobbing && countdown !== null) {
      let timer = setTimeout(() => {
        setCountdown((prev) => (prev ?? 0) - 1);
      }, 500);

      if (countdown === 1) {
        setEscapeVisible(true);
      } else if (countdown === 0) {
        handleFail();
      }

      return () => clearTimeout(timer);
    }
  }, [isRobbing, countdown]);

  function startRobbery() {
    setIsRobbing(true);
    setCountdown(Math.floor(Math.random() * 6) + 20);
    setClickCount(0);
    setEscapeVisible(false);
  }

  function handleEscape() {
    if (isRobbing && escapeVisible) {
      setGameOver(true);
      successfulBankRobbery(currentPlayer.index, clickCount * 10000);
    }
  }

  function handleFail() {
    if (!gameOver) {
      setEscapeVisible(false);
      failedBankRobbery(currentPlayer.index);
      setGameOver(true);
    }
  }

  return (
    <>
      <h1 className="text-center font-semibold text-3xl bg-black/50 text-white rounded-xl p-2">
        Bankrablás
      </h1>
      <div className="bg-white rounded-xl p-12 px-20 gap-12 text-black font-bold flex flex-col items-center justify-center shadow-2xl">
        {!isRobbing ? (
          <>
            <p className="text-center text-3xl">Akarsz bankot rabolni?</p>
            <div className="flex gap-6">
              <button
                className="bg-white font-medium text-xl text-black px-6 py-3 rounded-lg border-[0.1rem] border-black"
                onClick={startRobbery}
              >
                Igen
              </button>
              <button
                className="bg-white font-medium text-xl text-black px-6 py-3 rounded-lg border-[0.1rem] border-black"
                onClick={closePopup}
              >
                Nem
              </button>
            </div>
          </>
        ) : !gameOver ? (
          <>
            <h1 className="text-3xl font-bold">Bankrablás!</h1>
            <p className="text-xl">Kattints minél többször a pénzszerzéshez!</p>
            <div className="flex flex-col gap-4">
              <button
                className={`bg-[#c6eef8] text-xl text-black px-6 py-3 rounded-lg border-[0.1rem] border-black ${
                  escapeVisible ? "opacity-100" : "opacity-0"
                }`}
                onClick={handleEscape}
              >
                🚨 Menekülés!
              </button>
              <button
                className="bg-[#c6eef8] text-xl text-black px-6 py-3 rounded-lg border-[0.1rem] border-black"
                onClick={() => setClickCount((prev) => prev + 1)}
              >
                💰 Rablás ({clickCount})
              </button>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold pb-12">Bankrablás vége!</h1>
            {escapeVisible ? (
              <p className="text-2xl">
                Sikeresen megszereztél {formatMoney(clickCount * 10000)}-ot!
              </p>
            ) : (
              <p className="text-2xl">Lebuktál! Börtönbe mész.</p>
            )}
            <button
              className="bg-white -mt-6 font-medium text-xl text-black px-6 py-3 rounded-lg border-[0.1rem] border-black"
              onClick={closePopup}
            >
              Bezárás
            </button>
          </>
        )}
      </div>
    </>
  );
}
