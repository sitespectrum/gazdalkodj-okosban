//@ts-check
import React from "react";
import { useGameState } from "./hooks/use-game-state";
import { FIELDS } from "./lib/fields-config";

const Players = () => {
  const [gameState] = useGameState();

  return (
    <div className="players">
      {gameState.players.map((player, index) => {
        const field = FIELDS[player.position];
        return (
          <img
            key={index}
            src={player.image}
            alt={`Bábu ${index + 1}`}
            className="player"
            style={{
              position: "absolute",
              left: `${field.x}%`,
              top: `${field.y}%`,
              width: "2%",
            }}
          />
        );
      })}
    </div>
  );
};

export default Players;
