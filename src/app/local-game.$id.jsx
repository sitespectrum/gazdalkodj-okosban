import { Game } from "@/Components/Game";
import { DEFAULT_GAME_STATE } from "@/lib/constants";
import {
  GameDataProvider,
  LocalGameProvider,
  Providers,
} from "@/lib/providers";
import { useParams } from "react-router";

export default function LocalGame() {
  const { id } = useParams();

  const dataJson = localStorage.getItem(`local-game-${id}`);

  const data = dataJson
    ? JSON.parse(dataJson)
    : {
        meta: {
          id,
          name: "Local Game",
        },
        state: DEFAULT_GAME_STATE,
      };

  return (
    <Providers>
      <GameDataProvider key={id} initialData={data}>
        <LocalGameProvider key={id}>
          <Game key={id} />
        </LocalGameProvider>
      </GameDataProvider>
    </Providers>
  );
}
