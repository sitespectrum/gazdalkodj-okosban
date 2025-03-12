import "@/game.css";
import { Game } from "@/Components/Game";
import { DEFAULT_GAME_STATE } from "@/lib/constants";
import {
  GameDataProvider,
  LocalGameProvider,
  Providers,
} from "@/lib/providers";

export default function LocalGame() {
  /** @type {import("@/lib/types").GameData} */
  const data = {
    meta: {
      id: "temp",
      name: "Temporary Local Game",
      lastPlayed: 0,
    },
    state: DEFAULT_GAME_STATE,
  };

  return (
    <Providers>
      <GameDataProvider key="temp" initialData={data}>
        <LocalGameProvider key="temp">
          <Game key="temp" />
        </LocalGameProvider>
      </GameDataProvider>
    </Providers>
  );
}
