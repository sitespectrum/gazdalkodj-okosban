//@ts-check
import React from "react";
import { useCurrentPlayer } from "../hooks/use-current-player";
import { FIXED_DICE_ROLL } from "../lib/constants";

/**
 * @param {Object} props
 * @param {(steps: number) => any} props.onDiceRoll
 */
export default function RollDiceButton({ onDiceRoll }) {
  const { player } = useCurrentPlayer();

  function rollDice() {
    if (FIXED_DICE_ROLL) {
      return FIXED_DICE_ROLL;
    }
    return Math.floor(Math.random() * 6) + 1;
  }

  function handleClick() {
    const steps = rollDice();

    onDiceRoll(steps);
  }

  return (
    <button
      onClick={handleClick}
      disabled={!player.canRollDice}
      className="w-full h-full text-2xl font-medium flex flex-col gap-10 items-center justify-center hover:bg-white/15 disabled:bg-black/30! disabled:opacity-50 active:not-disabled:scale-[.98] transition-all duration-100 bg-black/30 rounded-xl"
    >
      <DicesIcon />
      Dobás
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
