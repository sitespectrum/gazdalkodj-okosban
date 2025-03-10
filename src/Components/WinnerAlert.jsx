import { useLocalGame } from "@/hooks/managers/use-local-game";
import { useNavigate } from "react-router";

export function WinnerAlert() {
  const { state } = useLocalGame();
  const navigate = useNavigate();

  return (
    <>
      A játék véget ért!
      <br />
      <strong>{state.players[state.winningPlayerIndex]?.name} nyert!</strong>
      <button
        className="new-game-button"
        onClick={() => {
          navigate("/new-game");
        }}
      >
        Új játék
      </button>
    </>
  );
}
