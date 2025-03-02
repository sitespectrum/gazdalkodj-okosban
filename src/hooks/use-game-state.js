//@ts-check
import { useContext } from "react";
import { gameStateContext } from "../lib/contexts.js";

/** @typedef {import("../lib/types").GameState} GameState */

/** @returns {[GameState, React.Dispatch<React.SetStateAction<GameState>>]} */
export function useGameState() {
  const [gameState, setGameState] = useContext(gameStateContext);
  return [gameState, setGameState];
}
