import { DEFAULT_GAME_STATE } from "@/lib/constants";
import { makeID } from "@/lib/utils";
import { useNavigate } from "react-router";

export default function NewLocalGame() {
  const navigate = useNavigate();

  function handleNewDefaultGame() {
    const id = makeID(8);
    const jsonData = {
      meta: {
        id,
        name: `Local Game ${id}`,
      },
      state: DEFAULT_GAME_STATE,
    };
    console.log("New Default Local Game", id);
    localStorage.setItem(`local-game-${id}`, JSON.stringify(jsonData));
    navigate(`/local-game/${id}`);
  }

  return (
    <div className="flex flex-col gap-4 text-2xl text-white font-bold items-center justify-center h-screen">
      <button onClick={handleNewDefaultGame}>New Default Local Game</button>
    </div>
  );
}
