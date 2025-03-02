//@ts-check
import { useGameState } from "./use-game-state";

/** @typedef {import("../lib/types").Player} Player */

export const useCurrentPlayer = () => {
  const [gameState, setGameState] = useGameState();

  return {
    player: gameState.players[gameState.currentPlayer],
    updatePlayer: (
      /** @type {Player | ((player: Player) => Player)} */ playerOrUpdater
    ) => {
      setGameState((prev) => {
        const currentPlayer = prev.players[prev.currentPlayer];
        const updatedPlayer =
          typeof playerOrUpdater === "function"
            ? playerOrUpdater(currentPlayer)
            : playerOrUpdater;

        return {
          ...prev,
          players: prev.players.map((p, index) =>
            index === prev.currentPlayer ? updatedPlayer : p
          ),
        };
      });
    },
  };
};
