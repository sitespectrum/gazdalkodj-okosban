import { useGame } from "@/hooks/use-game";
import { INSTANT_DICE_ROLL } from "@/lib/constants";
import { getRandomNumber } from "@/lib/utils";
import { useEffect, useMemo, useRef, useState } from "react";

/**
 * @param {Object} props
 * @param {(steps: number) => any} props.onDiceRoll
 */
export function RollDiceButton({ onDiceRoll }) {
  const { state, currentPlayer, isMyTurn, rollDice } = useGame();

  const [isRolling, setIsRolling] = useState(false);
  const [currentDice, setCurrentDice] = useState(1);
  const [isFinished, setIsFinished] = useState(false);

  const lastRandomDice = useRef(-1);
  const shouldEndRollingAnimation = useRef(false);
  const rolledDice = useRef(null);
  const interval = useRef(/**@type {NodeJS.Timeout | null}*/ (null));
  const timeout = useRef(/**@type {NodeJS.Timeout | null}*/ (null));

  const isCurrentPlayerRolling = useMemo(() => {
    return state.players[state.currentPlayer].rollingDice;
  }, [state]);

  useEffect(() => {
    if (isCurrentPlayerRolling && !isRolling) {
      startRollingAnimation();
      setIsRolling(true);
    }
  }, [isCurrentPlayerRolling]);

  const currentRolledDice = useMemo(() => {
    return state.players[currentPlayer.index].rolledDice;
  }, [state]);

  useEffect(() => {
    rolledDice.current = currentRolledDice;
    if (!currentRolledDice) {
      resetState();
    }
  }, [currentRolledDice]);

  async function startRollingAnimation() {
    interval.current = setInterval(() => {
      let step = lastRandomDice.current;
      while (step === lastRandomDice.current) {
        step = getRandomNumber(1, 6);
      }

      setCurrentDice(step);
      lastRandomDice.current = step;

      if (rolledDice.current && shouldEndRollingAnimation.current) {
        endRollingAnimation();
        onDiceRoll(rolledDice.current);
      }
    }, 400);

    timeout.current = setTimeout(
      () => {
        shouldEndRollingAnimation.current = true;
        if (rolledDice.current) {
          endRollingAnimation();
          onDiceRoll(rolledDice.current);
        }
      },
      INSTANT_DICE_ROLL ? 0 : 2000
    );
  }

  function endRollingAnimation() {
    setCurrentDice(rolledDice.current);
    setIsRolling(false);
    setIsFinished(true);
    clearInterval(interval.current ?? undefined);
    clearTimeout(timeout.current ?? undefined);
  }

  function resetState() {
    setIsRolling(false);
    setIsFinished(false);
    setCurrentDice(1);
    clearInterval(interval.current ?? undefined);
    clearTimeout(timeout.current ?? undefined);
    lastRandomDice.current = -1;
    shouldEndRollingAnimation.current = false;
  }

  async function handleClick() {
    rollDice(currentPlayer.index);
  }

  return (
    <button
      onClick={handleClick}
      disabled={!currentPlayer.canRollDice || isRolling || !isMyTurn}
      className="w-full h-full text-2xl font-medium flex flex-col gap-10 items-center justify-center hover:bg-white/15 disabled:bg-black/15! disabled:text-white/50! active:not-disabled:scale-[.98] transition-all duration-100 bg-black/30 rounded-xl"
    >
      {isRolling || isFinished ? (
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
