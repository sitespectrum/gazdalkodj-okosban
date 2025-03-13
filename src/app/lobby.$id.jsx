import { useLobby } from "@/hooks/use-lobby";
import { useOnlinePlayer } from "@/hooks/use-online-player";
import { Button } from "@heroui/react";
import { Avatar, Chip } from "@heroui/react";
import { Card, CardBody, Progress, ScrollShadow } from "@heroui/react";
import { useNavigate, useParams } from "react-router";

/** @typedef {import("@/lib/types").OnlineGameData} OnlineGameData */

function CrownIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1.5rem"
      height="1.5rem"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mr-2 text-yellow-500"
    >
      <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z" />
      <path d="M5 21h14" />
    </svg>
  );
}

export default function Lobby() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { lobby, startGame } = useLobby(id);
  const { player: onlinePlayer } = useOnlinePlayer();

  return (
    <div className="w-full h-[100dvh] flex justify-center items-center bg-dot-white/20 relative flex-col gap-8 p-8">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

      <h1 className="text-5xl z-10 pb-1 font-bold text-center bg-gradient-to-b from-white from-35% to-neutral-500 bg-clip-text text-transparent">
        Váróterem
      </h1>

      <div className="w-full h-full md:w-xl flex flex-col gap-8">
        <Card isBlurred className="w-full border-1 border-default-200 shrink-0">
          <CardBody className="flex flex-row gap-4 shrink-0">
            <div className="size-16 shrink-0 bg-blue-500/15 border-1 border-blue-500/50 shadow-md shadow-blue-500/20 rounded-lg text-2xl font-bold text-blue-500 flex items-center justify-center">
              {lobby?.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 flex flex-col">
              <span className="text-lg font-bold flex items-center justify-between w-full gap-2 h-fit">
                {lobby?.name}{" "}
                <span className="text-sm text-default-400">{lobby?.id}</span>
              </span>

              <Progress
                className="mt-auto"
                color="success"
                label="Játékosok"
                maxValue={lobby?.maxPlayers}
                showValueLabel={true}
                valueLabel={`${lobby?.players.length} / ${lobby?.maxPlayers}`}
                size="sm"
                value={lobby?.players.length}
              />
            </div>
          </CardBody>
        </Card>

        <ScrollShadow
          hideScrollBar
          visibility="auto"
          className="w-full overflow-y-auto flex flex-col items-center"
        >
          <div className="w-full flex flex-col gap-4">
            {lobby?.players.map((player) => (
              <Card
                key={player.id}
                isBlurred
                className="w-full border-1 border-default-200 shrink-0"
              >
                <CardBody className="flex flex-row gap-4 items-center">
                  <Avatar className="rounded-lg" src={player.image} />
                  <div className="flex-1 flex flex-col">
                    <span className="font-bold flex items-center gap-2">
                      {player.name}
                      {player.id === onlinePlayer.id && (
                        <Chip
                          color="success"
                          classNames={{
                            base: "px-1 py-0.5",
                            content: "font-medium",
                          }}
                          size="sm"
                        >
                          Te
                        </Chip>
                      )}
                    </span>
                    <span className="text-sm text-default-400">
                      {player.id}
                    </span>
                  </div>
                  {player.isHost && <CrownIcon />}
                </CardBody>
              </Card>
            ))}
          </div>
        </ScrollShadow>

        {lobby?.players.find((x) => x.id === onlinePlayer.id)?.isHost && (
          <Button
            className="mt-auto"
            color="primary"
            onPress={() => startGame()}
          >
            Kezdés
          </Button>
        )}
      </div>
    </div>
  );
}
