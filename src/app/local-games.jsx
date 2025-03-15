import { makeID, timeAgo } from "@/lib/utils";
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
  ScrollShadow,
  useDisclosure,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

/** @typedef {import("@/lib/types").GameData} GameData */
/** @typedef {import("@/lib/types").Player} Player */

/** @type {Player} */
const defaultPlayer = {
  index: 0,
  name: "Játékos",
  image: "/src/Pictures/Puppets/Piros bábú 1.png",
  money: 400_000,
  position: 0,
  inventory: [],
  insurances: [],
  inHospital: false,
  inJail: false,
  canRollDice: true,
  canEndTurn: false,
  state: "justStarted",
};

export default function LocalGames() {
  const navigate = useNavigate();

  const [localGames, setLocalGames] = useState(/** @type {GameData[]} */ ([]));
  const { isOpen, onOpen, onClose } = useDisclosure();

  /** @type {[GameData, React.Dispatch<React.SetStateAction<GameData>>]} */
  const [newGame, setNewGame] = useState({
    meta: {
      id: makeID(8),
      name: "Helyi játék",
      lastPlayed: 0,
    },
    state: {
      isGameOver: false,
      winningPlayerIndex: -1,
      currentPlayer: 0,
      players: [defaultPlayer],
    },
  });

  useEffect(() => {
    setLocalGames(listLocalGames());
  }, []);

  function listLocalGames() {
    const localGames = [];
    for (const key in localStorage) {
      if (key.startsWith("local-game-")) {
        localGames.push(JSON.parse(localStorage.getItem(key)));
      }
    }
    return localGames.sort(
      (a, b) => (b.meta.lastPlayed || 0) - (a.meta.lastPlayed || 0)
    );
  }

  /**
   * @param {string} gameID
   */
  function enterGame(gameID) {
    navigate(`/local-game/${gameID}`);
    console.log(gameID);
  }

  return (
    <div className="w-full h-[100dvh] flex justify-center items-center bg-dot-white/20 relative flex-col gap-8 p-8">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

      <h1 className="text-5xl z-10 pb-1 font-bold text-center bg-gradient-to-b from-white from-35% to-neutral-500 bg-clip-text text-transparent">
        Helyi játékok
      </h1>

      <ScrollShadow
        hideScrollBar
        visibility="auto"
        className="w-fit min-w-2xl overflow-y-auto flex flex-col items-center"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          {localGames.map((game) => (
            <Card
              key={game.meta.id}
              className="w-full max-w-md border-1 border-default-200 shrink-0"
              isPressable
              onPress={() => enterGame(game.meta.id)}
            >
              <CardBody className="flex flex-row gap-4 bg-[#050505] shrink-0">
                <div className="size-16 shrink-0 bg-blue-500/15 border-1 border-blue-500/50 shadow-md shadow-blue-500/20 rounded-lg text-2xl font-bold text-blue-500 flex items-center justify-center">
                  {game.meta.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 flex flex-col">
                  <span className="text-lg font-bold flex items-center justify-between w-full gap-2 h-fit">
                    {game.meta.name}{" "}
                    <span className="text-sm text-default-400">
                      {game.meta.id}
                    </span>
                  </span>
                  <span className="text-sm text-default-400">
                    {game.state.players.length} játékos
                  </span>
                  <span className="text-sm text-default-400">
                    Utolsó játék:{" "}
                    {game.meta.lastPlayed
                      ? timeAgo(new Date(game.meta.lastPlayed))
                      : "soha"}
                  </span>
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
        Új helyi játék
      </Button>

      <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Új helyi játék</ModalHeader>
          <ModalBody>
            <Input
              label="Játék neve"
              placeholder="Játék neve"
              value={newGame?.meta?.name}
              onChange={(e) =>
                setNewGame({
                  ...newGame,
                  meta: { ...newGame.meta, name: e.target.value },
                })
              }
            />
          </ModalBody>
          <ModalFooter>
            <Button
              className="w-full font-bold"
              size="lg"
              color="primary"
              onPress={() => {
                localStorage.setItem(
                  `local-game-${newGame.meta.id}`,
                  JSON.stringify(newGame)
                );
                navigate(`/local-game/${newGame.meta.id}`);
              }}
            >
              Játék létrehozása
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
