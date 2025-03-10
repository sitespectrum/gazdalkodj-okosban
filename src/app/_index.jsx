import { Link } from "react-router";

export default function Index() {
  return (
    <div className="flex text-2xl text-white font-bold flex-col items-center justify-center h-screen">
      <Link to="/local-games">Local Games</Link>
      <Link to="/new-game">New Game</Link>
    </div>
  );
}
