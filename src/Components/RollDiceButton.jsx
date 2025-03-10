import { useAlert } from "@/hooks/use-alert";
import { useGame } from "@/hooks/use-game";
import { INSTANT_DICE_ROLL } from "@/lib/constants";
import { getRandomNumber } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

/**
 * @param {Object} props
 * @param {(steps: number) => any} props.onDiceRoll
 */
export function RollDiceButton({ onDiceRoll }) {
  const { state, currentPlayer, rollDice } = useGame();
  const { showAlert } = useAlert();

  const [isRolling, setIsRolling] = useState(false);
  const [currentDice, setCurrentDice] = useState(1);
  const [isFinished, setIsFinished] = useState(false);

  /**
   * @type {React.MutableRefObject<number>}
   */
  const startingPlayerID = useRef(-1);
  /**
   * @type {React.MutableRefObject<NodeJS.Timeout | null>}
   */
  const interval = useRef(null);
  /**
   * @type {React.MutableRefObject<NodeJS.Timeout | null>}
   */
  const timeout = useRef(null);

  //TODO: also handle the roll again field
  useEffect(() => {
    console.log(state.currentPlayer);
    console.log(state.players.findIndex((p) => p.name === currentPlayer.name));
    if (startingPlayerID.current !== state.currentPlayer) {
      startingPlayerID.current = state.currentPlayer;
      setIsRolling(false);
      setIsFinished(false);
      clearInterval(interval.current ?? undefined);
      clearTimeout(timeout.current ?? undefined);
    }
  }, [state.currentPlayer]);

  /**
   * @param {number} steps
   */
  async function startRollingAnimation(steps) {
    setIsRolling(true);
    return new Promise((resolve) => {
      const tempSteps = [];
      while (tempSteps.length < 5) {
        const step = getRandomNumber(1, 6);
        if (!tempSteps.includes(step) && step !== steps) {
          tempSteps.push(step);
        }
      }

      interval.current = setInterval(() => {
        const step = tempSteps.shift();
        if (step) {
          setCurrentDice(step);
        }
      }, 400);

      timeout.current = setTimeout(
        () => {
          clearInterval(interval.current ?? undefined);
          setCurrentDice(steps);
          setIsFinished(true);
          resolve(null);
        },
        INSTANT_DICE_ROLL ? 0 : 2000
      );
    });
  }

  async function handleClick() {
    const steps = await rollDice(currentPlayer.index);

    if (steps.success === true) {
      await startRollingAnimation(steps.data);
      onDiceRoll(steps.data);
    } else {
      showAlert(steps.error);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={!currentPlayer.canRollDice || isRolling}
      className="w-full h-full text-2xl font-medium flex flex-col gap-10 items-center justify-center hover:bg-white/15 disabled:bg-black/15! disabled:text-white/50! active:not-disabled:scale-[.98] transition-all duration-100 bg-black/30 rounded-xl"
    >
      {isRolling ? (
        <RollingDices currentDice={currentDice} isFinished={isFinished} />
      ) : (
        <DicesIcon />
      )}
      <span className={`${isFinished ? "text-white" : ""}`}>
        {isFinished
          ? `Dobott szám: ${currentDice}`
          : isRolling
          ? "Dobás..."
          : "Dobás"}
      </span>
    </button>
  );
}

function DicesIcon() {
  return (
    <div className="flex h-35 w-50 items-center justify-center relative">
      <div className="size-22 absolute bottom-0 left-0 rounded-lg shadow-[0_0_1rem_rgba(0,0,0,0.5)]">
        <img
          src="/src/Pictures/DiceSides/1.png"
          alt="1. kocka"
          className="rounded-lg"
        />
      </div>
      <div className="size-22 absolute top-0 left-1/2 -translate-x-1/2 rounded-lg shadow-[0_0_1rem_rgba(0,0,0,0.5)]">
        <img
          src="/src/Pictures/DiceSides/2.png"
          alt="2. kocka"
          className="rounded-lg"
        />
      </div>
      <div className="size-22 absolute bottom-0 right-0 rounded-lg shadow-[0_0_1rem_rgba(0,0,0,0.5)]">
        <img
          src="/src/Pictures/DiceSides/5.png"
          alt="5. kocka"
          className="rounded-lg"
        />
      </div>
    </div>
  );
}

/**
 * @param {Object} props
 * @param {number} props.currentDice
 * @param {boolean} props.isFinished
 */
function RollingDices({ currentDice, isFinished }) {
  return (
    <div
      className={`relative size-20 rounded-lg shadow-[0_0_1rem_rgba(0,0,0,0.5)] flex items-center justify-center ${
        isFinished ? "size-26" : "size-20"
      } transition-[width,height] duration-300`}
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <img
          key={index}
          src={`/src/Pictures/DiceSides/${index + 1}.png`}
          alt="kocka"
          className={`absolute inset-0 rounded-lg ${
            index === currentDice - 1 ? "opacity-100" : "opacity-0"
          } `}
        />
      ))}
    </div>
  );
}
