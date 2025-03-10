import { useGame } from "@/hooks/use-game";
import { FIELDS } from "@/lib/fields-config";

export function Players() {
  const { state } = useGame();

  return (
    <div className="players">
      {state.players.map((player, index) => {
        const field = FIELDS[player.position];
        return (
          <img
            key={player.name}
            src={player.image}
            alt={`Bábu ${index + 1}`}
            className="transition-[top,left] duration-1000"
            style={{
              position: "absolute",
              left: `${field?.x}%`,
              top: `${field?.y}%`,
              width: "2%",
            }}
          />
        );
      })}
    </div>
  );
}
