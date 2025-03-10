import { gameContext } from "@/lib/contexts";
import { useContext } from "react";

/** @typedef {import("@/lib/types").GameManager} GameManager */

/**
 * @returns {GameManager}
 */
export function useGame() {
  const game = useContext(gameContext);

  if (!game) {
    throw new Error("Game context not found");
  }

  return game;
}
