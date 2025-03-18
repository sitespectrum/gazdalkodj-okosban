import { useGame } from "@/hooks/use-game";
import { DEFAULT_GAME_STATE, PURCHASEABLE_ITEMS } from "@/lib/constants";
import {
  GameDataProvider,
  OnlineGameProvider,
  Providers,
} from "@/lib/providers";
import { ModalBody, NumberInput } from "@heroui/react";
import { Input } from "@heroui/react";
import { ModalFooter } from "@heroui/react";
import { SelectItem } from "@heroui/react";
import { Select } from "@heroui/react";
import { ModalHeader } from "@heroui/react";
import { ModalContent } from "@heroui/react";
import { useDisclosure } from "@heroui/react";
import { Modal } from "@heroui/react";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  ScrollShadow,
  Spinner,
} from "@heroui/react";
import { useState } from "react";
import { useParams } from "react-router";

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

function LockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1rem"
      height="1rem"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className=""
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

export default function AdminGame() {
  const { id } = useParams();

  /** @type {import("@/lib/types").GameData} */
  const data = {
    meta: {
      id: "temp",
      name: "Temporary Local Game",
      lastPlayed: 0,
    },
    state: {
      ...DEFAULT_GAME_STATE,
      players: DEFAULT_GAME_STATE.players.map((player, index) => ({
        ...player,
        id: `player-${index}`,
      })),
    },
  };

  return (
    <Providers>
      <GameDataProvider key="admin" initialData={data}>
        <OnlineGameProvider key="admin" id={id} isAdmin>
          <AdminPanel key="admin" />
        </OnlineGameProvider>
      </GameDataProvider>
    </Providers>
  );
}

function AdminPanel() {
  const {
    meta,
    state,
    currentPlayer,
    loading,
    rollDice,
    movePlayer,
    endTurn,
    buyItem,
    successfulBankRobbery,
  } = useGame();

  const moveModal = useDisclosure();
  const buyItemModal = useDisclosure();
  const addMoneyModal = useDisclosure();

  const [moveValue, setMoveValue] = useState(1);
  const [item, setItem] = useState(null);
  const [addMoneyValue, setAddMoneyValue] = useState(0);

  return (
    <div className="w-full h-[100dvh] flex justify-center items-center bg-dot-white/20 relative flex-col gap-8 p-8">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

      <h1 className="text-5xl z-10 pb-1 font-bold text-center bg-gradient-to-b from-white from-35% to-neutral-500 bg-clip-text text-transparent">
        Admin nézet
      </h1>

      {loading && (
        <div className="w-full flex-1 h-full flex items-center justify-center">
          <Spinner variant="simple" size="lg" />
        </div>
      )}

      {!loading && (
        <div className="w-full h-full md:w-xl flex flex-col gap-8">
          <div className="text-2xl z-10 -mb-6 font-bold">
            Jelenlegi játékos:
          </div>
          <Card
            key={currentPlayer.id}
            isBlurred
            className="w-full border-1 border-default-200 shrink-0"
          >
            <CardBody className="flex flex-row gap-4 items-center">
              <Avatar
                classNames={{
                  base: "rounded-lg bg-transparent",
                  img: "object-contain",
                }}
                src={currentPlayer.image}
              />

              <div className="flex-1 flex flex-col">
                <span className="font-bold flex items-center gap-2">
                  {currentPlayer.name}
                </span>
                <span className="text-sm text-default-400">
                  {currentPlayer.id}
                </span>
              </div>
            </CardBody>
          </Card>

          <div className="h-fit w-full md:w-xl flex flex-wrap gap-4">
            <Button
              className="basis-[calc(50%-0.5rem)]"
              color="primary"
              onPress={() => rollDice(currentPlayer.index)}
            >
              Random dobás
            </Button>
            <Button
              className="basis-[calc(50%-0.5rem)]"
              color="primary"
              onPress={moveModal.onOpen}
            >
              Fix számú lépés
            </Button>
            <Button
              className="basis-[calc(50%-0.5rem)]"
              color="primary"
              onPress={buyItemModal.onOpen}
            >
              Termék vásárlás
            </Button>
            <Button
              className="basis-[calc(50%-0.5rem)]"
              color="primary"
              onPress={addMoneyModal.onOpen}
            >
              Pénzfeltöltés
            </Button>
            <Button
              className="basis-full"
              color="success"
              onPress={() => endTurn(currentPlayer.index)}
            >
              Kör vége
            </Button>
          </div>
        </div>
      )}

      <Modal isOpen={moveModal.isOpen} onClose={moveModal.onClose}>
        <ModalContent>
          <ModalHeader>Fix számú lépés</ModalHeader>
          <ModalBody>
            <NumberInput
              label="Lépés"
              placeholder="Lépés"
              value={moveValue}
              onValueChange={(value) => setMoveValue(value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              className="w-full"
              onPress={() => {
                moveModal.onClose();
                movePlayer(currentPlayer.index, moveValue);
              }}
            >
              Lépés
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={buyItemModal.isOpen} onClose={buyItemModal.onClose}>
        <ModalContent>
          <ModalHeader>Termék vásárlás</ModalHeader>
          <ModalBody>
            <Select
              aria-label="Termék"
              onSelectionChange={(value) => setItem(value.currentKey)}
            >
              {Object.values(PURCHASEABLE_ITEMS).map((item) => (
                <SelectItem
                  aria-label={item.name}
                  key={item.id}
                  accessKey={item.id}
                >
                  {item.name}
                </SelectItem>
              ))}
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              className="w-full"
              onPress={() => {
                buyItemModal.onClose();
                buyItem(currentPlayer.index, PURCHASEABLE_ITEMS[item]);
              }}
            >
              Vásárlás
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={addMoneyModal.isOpen} onClose={addMoneyModal.onClose}>
        <ModalContent>
          <ModalHeader>Pénzfeltöltés</ModalHeader>
          <ModalBody>
            <NumberInput
              label="Pénz"
              placeholder="Pénz"
              value={addMoneyValue}
              onValueChange={(value) => setAddMoneyValue(value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              className="w-full"
              onPress={() => {
                addMoneyModal.onClose();
                successfulBankRobbery(currentPlayer.index, addMoneyValue);
              }}
            >
              Feltöltés
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
