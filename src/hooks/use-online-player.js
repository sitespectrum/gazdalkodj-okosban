import { useEffect, useState } from "react";

/** @typedef {import("@/lib/types").OnlinePlayerData} OnlinePlayerData */

export function useOnlinePlayer() {
  const [player, setPlayer] = useState(
    /** @type {OnlinePlayerData} */ (
      localStorage.getItem("online-player")
        ? JSON.parse(localStorage.getItem("online-player"))
        : null
    )
  );

  useEffect(() => {
    localStorage.setItem("online-player", JSON.stringify(player));
  }, [player]);

  useEffect(() => {
    if (!player) {
      const player = {
        id: crypto.randomUUID(),
        key: crypto.randomUUID(),
        name: "Player",
        image: "https://placedog.net/500/500",
      };
      setPlayer(player);
    }
  }, []);

  return { player, setPlayer };
}
