import { useEffect, useState } from "react";

export function useOnlinePlayer() {
  const [player, setPlayer] = useState(
    localStorage.getItem("online-player")
      ? JSON.parse(localStorage.getItem("online-player"))
      : null
  );

  useEffect(() => {
    localStorage.setItem("online-player", JSON.stringify(player));
  }, [player]);

  return { player, setPlayer };
}
