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
  Switch,
  useDisclosure,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

/** @typedef {import("@/lib/types").OnlineGameData} OnlineGameData */

export default function LocalGames() {
  const navigate = useNavigate();
  const { player } = useOnlinePlayer();

  const [onlineGames, setOnlineGames] = useState(
    /** @type {OnlineGameData[]} */ ([])
  );
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [newGame, setNewGame] = useState({
    name: "",
    isPublic: true,
    maxPlayers: 4,
  });

  useEffect(() => {
    listOnlineGames().then(setOnlineGames);
  }, []);

  async function listOnlineGames() {
    const res = await fetch(`${SERVER_URL}/games`);
    const data = await res.json();
    return data;
  }

  /**
   * @param {string} gameID
   */
  function enterLobby(gameID) {
    navigate(`/lobby/${gameID}`);
  }

  async function handleCreateGame() {
    const res = await fetch(`${SERVER_URL}/create-game?hostID=${player.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newGame),
    });
    const data = await res.json();
    navigate(`/lobby/${data.id}`);
  }

  return (
    <div className="w-full h-[100dvh] flex justify-center items-center bg-dot-white/20 relative flex-col gap-8 p-8">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

      <h1 className="text-5xl z-10 pb-1 font-bold text-center bg-gradient-to-b from-white from-35% to-neutral-500 bg-clip-text text-transparent">
        Online játékok
      </h1>

      <ScrollShadow
        hideScrollBar
        visibility="auto"
        className="w-full md:w-fit overflow-y-auto flex flex-col items-center"
      >
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          {onlineGames.map((game) => (
            <Card
              key={game.id}
              className="w-full md:w-xs border-1 border-default-200 shrink-0"
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
                    <span className="text-sm text-default-400">{game.id}</span>
                  </span>

                  <Progress
                    className="mt-auto"
                    color="success"
                    label="Játékosok"
                    maxValue={game.maxPlayers}
                    showValueLabel={true}
                    valueLabel={`${game.playerCount ?? 0} / ${game.maxPlayers}`}
                    size="sm"
                    value={game.playerCount ?? 0}
                  />
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </ScrollShadow>

      <Button
        href="/new-local-game"
        className="mt-auto w-full max-w-md shrink-0"
        color="default"
        variant="flat"
        onPress={onOpen}
      >
        Új online játék
      </Button>

      <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Új online játék</ModalHeader>
          <ModalBody>
            <Input
              label="Játék neve"
              placeholder="Játék neve"
              value={newGame.name}
              onChange={(e) =>
                setNewGame({
                  ...newGame,
                  name: e.target.value,
                })
              }
            />

            <NumberInput
              label="Maximális játékosok száma"
              placeholder="Maximális játékosok száma"
              value={newGame.maxPlayers}
              onValueChange={(value) =>
                setNewGame({
                  ...newGame,
                  maxPlayers: value,
                })
              }
            />

            <Switch
              checked={newGame.isPublic}
              onValueChange={(value) =>
                setNewGame({
                  ...newGame,
                  isPublic: value,
                })
              }
              classNames={{
                base: cn(
                  "inline-flex flex-row-reverse w-full max-w-md bg-content1 hover:bg-content2 items-center",
                  "justify-between cursor-pointer rounded-xl gap-2 p-4 border-2 border-transparent",
                  "data-[selected=true]:border-primary"
                ),
              }}
            >
              <div className="flex flex-col gap-1">
                <p className="text-medium">Privát játék</p>
                <p className="text-tiny text-default-400">
                  A játékhoz csak egy kód beírásával lehet csatlakozni.
                </p>
              </div>
            </Switch>
          </ModalBody>
          <ModalFooter>
            <Button
              className="w-full font-bold"
              size="lg"
              color="primary"
              onPress={handleCreateGame}
            >
              Játék létrehozása
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
