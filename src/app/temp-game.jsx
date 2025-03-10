import { Game } from "@/Components/Game";
import { DEFAULT_GAME_STATE } from "@/lib/constants";
import {
  LocalGameDataProvider,
  LocalGameProvider,
  Providers,
} from "@/lib/providers";

export default function LocalGame() {
  /** @type {import("@/lib/types").GameData} */
  const data = {
    meta: {
      id: "temp",
      name: "Temporary Local Game",
    },
    state: DEFAULT_GAME_STATE,
  };

  return (
    <Providers>
      <LocalGameDataProvider key="temp" initialData={data}>
        <LocalGameProvider key="temp">
          <Game key="temp" />
        </LocalGameProvider>
      </LocalGameDataProvider>
    </Providers>
  );
}
