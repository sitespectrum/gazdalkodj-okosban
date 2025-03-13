import "@/game.css";
import { Game } from "@/Components/Game";
import { DEFAULT_GAME_STATE } from "@/lib/constants";
import {
  GameDataProvider,
  OnlineGameProvider,
  Providers,
} from "@/lib/providers";
import { useParams } from "react-router";

export default function OnlineGame() {
  const { id } = useParams();

  /** @type {import("@/lib/types").GameData} */
  const data = {
    meta: {
      id: "temp",
      name: "Temporary Local Game",
      lastPlayed: 0,
    },
    state: {
      ...DEFAULT_GAME_STATE,
      players: DEFAULT_GAME_STATE.players.map((player, index) => ({
        ...player,
        id: `player-${index}`,
      })),
    },
  };

  return (
    <Providers>
      <GameDataProvider key="online" initialData={data}>
        <OnlineGameProvider key="online" id={id}>
          <Game key="online" />
        </OnlineGameProvider>
      </GameDataProvider>
    </Providers>
  );
}
