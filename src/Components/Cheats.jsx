import { useState } from "react";

export function Cheats({ onClose, currentPlayer, movePlayer }) {
  const [cheatValue, setCheatValue] = useState("");

  const handleMove = () => {
    const steps = parseInt(cheatValue, 10);
    if (!isNaN(steps)) {
      movePlayer(currentPlayer, steps);
      setCheatValue("");
    }
  };

  return (
    <div className="hidden z-30 fixed bg-black p-6 rounded-xl">
      <input
        type="number"
        value={cheatValue}
        onChange={(e) => setCheatValue(e.target.value)}
        placeholder="Lépések száma"
      />
      <button onClick={handleMove}>Lépés</button>
      <button className="close-cheats" onClick={onClose}>
        Bezárás
      </button>
    </div>
  );
}
