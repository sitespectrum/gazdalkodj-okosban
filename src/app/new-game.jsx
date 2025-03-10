import { Link } from "react-router";

export default function NewGame() {
  return (
    <div className="flex flex-col gap-4 text-2xl text-white font-bold items-center justify-center h-screen">
      <Link to="/temp-game">Temp Game</Link>
      <Link to="/new-local-game">Local Game</Link>
    </div>
  );
}
