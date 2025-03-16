import { useAlert } from "@/hooks/use-alert";
import { useGame } from "@/hooks/use-game";
import { formatMoney, getRandomNumber } from "@/lib/utils.js";
import { useEffect, useState } from "react";

export function Casino() {
  const { currentPlayer, placeBet, loseBet, winBet, refundBet, closePopup } =
    useGame();
  const { showAlert } = useAlert();

  const [playerCards, setPlayerCards] = useState([]);
  const [dealerCards, setDealerCards] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");
  const [bet, setBet] = useState(10);
  const [gameStarted, setGameStarted] = useState(false);

  /**
   * @param {number[]} cards
   * @returns {number}
   */
  function sumCards(cards) {
    return cards.reduce((a, b) => a + b, 0);
  }

  function getRandomCard() {
    return getRandomNumber(1, 11);
  }

  useEffect(() => {
    if (currentPlayer.currentBet) {
      setBet(currentPlayer.currentBet);
      setPlayerCards([getRandomCard(), getRandomCard()]);
      setDealerCards([getRandomCard(), getRandomCard()]);

      setGameOver(false);
      setGameStarted(true);
      setMessage("");
    }
  }, [currentPlayer.currentBet]);

  function startGame() {
    if (currentPlayer.money < bet) {
      showAlert("Nincs elég pénzed a tét megtételéhez!");
      return;
    }

    placeBet(currentPlayer.index, bet);

    setPlayerCards([getRandomCard(), getRandomCard()]);
    setDealerCards([getRandomCard(), getRandomCard()]);

    setGameOver(false);
    setGameStarted(true);
    setMessage("");
  }

  function hit() {
    if (gameOver) return;
    const newCards = [...playerCards, getRandomCard()];
    setPlayerCards(newCards);
    if (sumCards(newCards) > 21) {
      setMessage("Túlmentél 21-en, vesztettél!");
      setGameOver(true);
      loseBet(currentPlayer.index);
    }
  }

  function stand() {
    if (gameOver) return;
    let newDealerCards = [...dealerCards];
    while (sumCards(newDealerCards) < 17) {
      newDealerCards.push(getRandomCard());
    }
    setDealerCards(newDealerCards);

    const finalDealerTotal = sumCards(newDealerCards);
    const finalPlayerTotal = sumCards(playerCards);

    if (finalDealerTotal > 21 || finalPlayerTotal > finalDealerTotal) {
      setMessage("Nyertél!");
      winBet(currentPlayer.index);
    } else if (finalPlayerTotal < finalDealerTotal) {
      setMessage("Vesztettél!");
      loseBet(currentPlayer.index);
    } else {
      setMessage("Döntetlen! Visszakaptad a tétet.");
      refundBet(currentPlayer.index);
    }
    setGameOver(true);
  }

  return (
    <>
      <div className="flex gap-6 items-center justify-between">
        <h1 className="flex-1 text-center text-2xl bg-black/50 font-semibold text-white rounded-xl p-2">
          Kaszinó
        </h1>
        <h1 className="flex-1 text-center text-2xl bg-black/50 font-semibold text-white rounded-xl p-2">
          Egyenleg: {formatMoney(currentPlayer.money)}
        </h1>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-[0_0_1.5rem_rgba(0,0,0,0.2)] flex flex-col gap-4">
        <h1 className="text-center text-3xl font-semibold my-2">Blackjack</h1>
        <div className="w-full h-[0.1rem] bg-neutral-300"></div>

        {!gameStarted ? (
          <>
            <div className="flex my-16 gap-4 items-center justify-center">
              <label htmlFor="bet" className="text-2xl font-semibold">
                Tét:
              </label>
              <input
                id="bet"
                type="number"
                placeholder="X Ft"
                value={bet}
                min="1"
                max={currentPlayer.money}
                onChange={(e) => setBet(parseInt(e.target.value) || 1)}
                className="text-2xl font-medium border-[0.1rem] border-neutral-400 rounded-lg p-2 px-4 w-48 text-center"
              />
              <span className="text-2xl font-semibold">Ft</span>
            </div>
            <button
              className="rounded-lg text-lg px-4 py-2 bg-gradient-to-b from-green-500/75 to-green-600/100 text-white border-none"
              onClick={startGame}
            >
              Játék indítása
            </button>
          </>
        ) : (
          <>
            <div className="flex gap-4 mb-12 text-center">
              <div className="flex flex-1 flex-col gap-4">
                <span className="font-semibold text-2xl bg-neutral-200/50 border-[0.1rem] border-neutral-300 rounded-lg p-2">
                  Játékos kártyái
                </span>

                <span className="text-xl">{playerCards.join(", ")}</span>
                <span className="text-xl font-semibold">
                  Összeg: {sumCards(playerCards)}
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-4">
                <span className="font-semibold text-2xl bg-neutral-200/50 border-[0.1rem] border-neutral-300 rounded-lg p-2">
                  Gép kártyái
                </span>

                <span className="text-xl">
                  {gameOver ? dealerCards.join(", ") : "??, " + dealerCards[1]}
                </span>
                <span className="text-xl font-semibold">
                  Összeg: {gameOver ? sumCards(dealerCards) : "?"}
                </span>
              </div>
            </div>
            {!gameOver ? (
              <>
                <div className="flex gap-4">
                  <button
                    className="rounded-lg flex-1 text-lg px-4 py-2 bg-gradient-to-b from-green-500/75 to-green-600/100 text-white border-none"
                    onClick={hit}
                  >
                    Kártya kérés
                  </button>

                  <button
                    className="bg-gradient-to-b flex-1 from-red-600/65 text-lg to-red-600 font-medium text-white rounded-lg px-4 py-2"
                    onClick={stand}
                  >
                    Passz
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-2xl font-semibold text-center">{message}</p>
                <button
                  className="rounded-lg text-lg mt-6 px-4 py-2 bg-gradient-to-b from-green-500/75 to-green-600/100 text-white border-none"
                  onClick={() => setGameStarted(false)}
                >
                  Új játék
                </button>
              </>
            )}
          </>
        )}
        <div className="w-full h-[0.1rem] bg-neutral-300"></div>
        <button
          className="bg-gradient-to-b from-red-600/65 text-lg to-red-600 font-medium text-white rounded-lg px-4 py-2"
          onClick={closePopup}
        >
          Bezárás
        </button>
      </div>
    </>
  );
}
