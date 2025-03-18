import { useOnlinePlayer } from "@/hooks/use-online-player";
import { SERVER_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  Button,
  Card,
  CardBody,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  NumberInput,
  Progress,
  ScrollShadow,
  Spinner,
  Switch,
  useDisclosure,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

/** @typedef {import("@/lib/types").OnlineGameData} OnlineGameData */

export default function OnlineGames() {
  const navigate = useNavigate();
  const location = useLocation();

  const [onlineGames, setOnlineGames] = useState(
    /** @type {OnlineGameData[]} */ ([])
  );

  const [gamesLoading, setGamesLoading] = useState(false);

  useEffect(() => {
    setGamesLoading(true);
    listOnlineGames().then((games) => {
      setOnlineGames(games);
      setGamesLoading(false);
    });
  }, []);

  async function listOnlineGames() {
    const res = await fetch(`${SERVER_URL}/admin/games`);
    const data = await res.json();
    return data.sort(
      (
        /** @type {{ playerCount: number; }} */ a,
        /** @type {{ playerCount: number; }} */ b
      ) => b.playerCount - a.playerCount
    );
  }

  /**
   * @param {string} gameID
   */
  function enterLobby(gameID) {
    navigate(
      `/admin-game/${gameID}?password=${new URLSearchParams(
        location.search
      ).get("password")}`
    );
  }

  return (
    <div className="w-full h-[100dvh] flex justify-center items-center bg-dot-white/20 relative flex-col gap-8 p-8">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

      <h1 className="text-5xl z-10 pb-1 font-bold text-center bg-gradient-to-b from-white from-35% to-neutral-500 bg-clip-text text-transparent">
        Folyamatban lévő játékok
      </h1>

      {gamesLoading && (
        <div className="w-full flex-1 h-full flex items-center justify-center">
          <Spinner variant="simple" size="lg" />
        </div>
      )}

      {!gamesLoading && onlineGames.length === 0 && (
        <div className="w-full flex-1 h-full flex items-center justify-center">
          <Card
            isBlurred
            className="text-2xl flex flex-col gap-6 text-center font-semibold py-6 px-10 text-foreground/50 border-3 border-default-100"
          >
            <span>Még nincsenek online játékok.</span>
          </Card>
        </div>
      )}

      {!gamesLoading && onlineGames.length > 0 && (
        <ScrollShadow
          hideScrollBar
          visibility="auto"
          className="w-full flex-1 md:w-2xl overflow-y-auto flex flex-col items-center"
        >
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            {onlineGames.map((game) => (
              <Card
                key={game.id}
                className="w-full border-1 border-default-200 shrink-0"
                isPressable
                onPress={() => enterLobby(game.id)}
              >
                <CardBody className="flex flex-row gap-4 bg-[#050505] shrink-0">
                  <div className="size-16 shrink-0 bg-blue-500/15 border-1 border-blue-500/50 shadow-md shadow-blue-500/20 rounded-lg text-2xl font-bold text-blue-500 flex items-center justify-center">
                    {game.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 flex flex-col">
                    <span className="text-lg font-bold flex items-center justify-between w-full gap-2 h-fit">
                      {game.name}{" "}
                      <span className="text-sm text-default-400">
                        {game.id}
                      </span>
                    </span>

                    <Progress
                      className="mt-auto"
                      color="success"
                      label="Játékosok"
                      maxValue={game.maxPlayers}
                      showValueLabel={true}
                      valueLabel={`${game.playerCount ?? 0} / ${
                        game.maxPlayers
                      }`}
                      size="sm"
                      value={game.playerCount ?? 0}
                    />
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </ScrollShadow>
      )}
    </div>
  );
}
