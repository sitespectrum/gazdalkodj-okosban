//@ts-check
import { useContext } from "react";
import { gameStateContext } from "../lib/contexts.js";

/** @typedef {import("../lib/types").GameState} GameState */
/** @typedef {import("../lib/types").CallbackState<GameState>} CallbackGameState */

/** @returns {CallbackGameState} */
export function useGameState() {
  const [gameState, setGameState] = useContext(gameStateContext);
  return [gameState, setGameState];
}
