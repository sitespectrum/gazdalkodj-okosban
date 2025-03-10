import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router";

/** @typedef {import("@/lib/types").GameData} GameData */

export default function LocalGames() {
  const [localGames, setLocalGames] = useState(/** @type {GameData[]} */ ([]));

  useEffect(() => {
    setLocalGames(listLocalGames());
  }, []);

  function listLocalGames() {
    const localGames = [];
    for (const key in localStorage) {
      if (key.startsWith("local-game-")) {
        localGames.push(JSON.parse(localStorage.getItem(key)));
      }
    }
    return localGames;
  }

  return (
    <div className="flex flex-col gap-6 text-white font-bold items-center justify-center h-screen">
      <h1 className="text-3xl">Local Games</h1>
      <ul className="flex flex-col gap-2">
        {localGames.map((game) => (
          <li key={game.meta.id}>
            <Link to={`/local-game/${game.meta.id}`}>{game.meta.name}</Link>
          </li>
        ))}
      </ul>

      <Link to="/new-local-game" className="text-2xl">
        New Local Game
      </Link>
    </div>
  );
}
