import { useLobby } from "@/hooks/use-lobby";
import { useOnlinePlayer } from "@/hooks/use-online-player";
import { DEFAULT_PLAYER_IMAGES } from "@/lib/constants";
import { ModalHeader, ModalBody, Input, ModalFooter } from "@heroui/react";
import { useDisclosure } from "@heroui/react";
import { ModalContent } from "@heroui/react";
import { Modal } from "@heroui/react";
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
  Progress,
  ScrollShadow,
  Spinner,
} from "@heroui/react";
import { useEffect } from "react";
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

export default function Lobby() {
  const { id } = useParams();
  const { lobby, fading, startGame, updatePlayer, isNotFound, loading } =
    useLobby(id);
  const { player: onlinePlayer, setPlayer: setOnlinePlayer } =
    useOnlinePlayer();

  const profilePopup = useDisclosure();

  const [isStartLoading, setIsStartLoading] = useState(false);

  useEffect(() => {
    console.log("player", onlinePlayer);
    if (onlinePlayer) {
      const oldImage = (lobby?.players ?? []).find(
        (p) => p.id === onlinePlayer?.id
      )?.image;

      updatePlayer({
        ...(lobby?.players ?? []).find((p) => p.id === onlinePlayer?.id),
        name: onlinePlayer.name,
        isHost:
          onlinePlayer.id === (lobby?.players ?? []).find((p) => p.isHost)?.id,
        image:
          DEFAULT_PLAYER_IMAGES.find((p) => p.image === oldImage)?.image ??
          onlinePlayer.image,
      });
    }
  }, [onlinePlayer]);

  return (
    <div className="w-full h-[100dvh] flex justify-center items-center bg-dot-white/20 relative flex-col gap-8 p-8">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

      <h1 className="text-5xl z-10 pb-1 font-bold text-center bg-gradient-to-b from-white from-35% to-neutral-500 bg-clip-text text-transparent">
        Váróterem
      </h1>

      {loading && !isNotFound && (
        <div className="w-full flex-1 h-full flex items-center justify-center">
          <Spinner variant="simple" size="lg" />
        </div>
      )}

      {isNotFound && (
        <div className="w-full flex-1 flex flex-col gap-6 h-full items-center justify-center">
          <span className="text-2xl font-semibold">A játék nem található</span>
          <Button
            as={Link}
            href="/"
            className="font-medium"
            size="lg"
            color="primary"
          >
            Vissza a főoldalra
          </Button>
        </div>
      )}

      {!loading && !isNotFound && (
        <div className="w-full h-full md:w-xl flex flex-col gap-8">
          <Card
            isBlurred
            className="w-full border-1 border-default-200 shrink-0"
          >
            <CardBody className="flex flex-row gap-4 shrink-0">
              <Badge
                color="primary"
                placement="bottom-right"
                classNames={{
                  badge: "p-1 rounded-lg right-[11%] bottom-[11%]",
                }}
                isInvisible={lobby?.isPublic}
                content={<LockIcon />}
              >
                <div className="size-16 shrink-0 bg-blue-500/15 border-1 border-blue-500/50 shadow-md shadow-blue-500/20 rounded-lg text-2xl font-bold text-blue-500 flex items-center justify-center">
                  {lobby?.name.slice(0, 2).toUpperCase()}
                </div>
              </Badge>
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
                    <Dropdown
                      showArrow
                      isTriggerDisabled={player.id !== onlinePlayer.id}
                    >
                      <DropdownTrigger className="opacity-100 cursor-pointer disabled:cursor-default">
                        <Avatar
                          classNames={{
                            base: "rounded-lg bg-transparent",
                            img: "object-contain",
                          }}
                          src={player.image}
                        />
                      </DropdownTrigger>
                      <DropdownMenu
                        selectionMode="single"
                        selectedKeys={[
                          DEFAULT_PLAYER_IMAGES.find(
                            (x) => x.image === player.image
                          )?.id ?? "custom",
                        ]}
                        onSelectionChange={(value) => {
                          if (value.currentKey === "custom") {
                            updatePlayer({
                              ...player,
                              image: onlinePlayer.image,
                            });
                            return;
                          }

                          updatePlayer({
                            ...player,
                            image: DEFAULT_PLAYER_IMAGES.find(
                              (x) => x.id === value.currentKey
                            ).image,
                          });
                        }}
                        children={[
                          onlinePlayer.image && (
                            <DropdownItem
                              key="custom"
                              classNames={{
                                title: "font-medium ml-2",
                              }}
                              startContent={
                                <Avatar
                                  classNames={{
                                    base: "rounded-lg h-8 bg-transparent w-fit",
                                    img: "object-contain",
                                  }}
                                  src={onlinePlayer.image}
                                  size="sm"
                                  isBordered
                                  className="border-1 border-default-200"
                                />
                              }
                            >
                              Egyéni
                            </DropdownItem>
                          ),
                          ...DEFAULT_PLAYER_IMAGES.map((image) => (
                            <DropdownItem
                              key={image.id}
                              classNames={{
                                title: "font-medium ml-2",
                              }}
                              startContent={
                                <Avatar
                                  classNames={{
                                    base: "rounded-lg h-8 w-8 bg-transparent",
                                    img: "object-contain",
                                  }}
                                  src={image.image}
                                />
                              }
                            >
                              {image.name}
                            </DropdownItem>
                          )),
                        ].filter(Boolean)}
                      ></DropdownMenu>
                    </Dropdown>
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

          <div className="w-full md:w-xl overflow-y-auto flex gap-4 items-center mt-auto">
            <Button
              className="flex-1 shrink-0 font-medium"
              color="default"
              onPress={profilePopup.onOpen}
            >
              Profil
            </Button>
            {lobby?.players.find((x) => x.id === onlinePlayer.id)?.isHost && (
              <Button
                className="mt-auto flex-4"
                color="primary"
                onPress={async () => {
                  setIsStartLoading(true);
                  await startGame();
                }}
                isLoading={isStartLoading}
                spinner={<Spinner variant="simple" size="sm" color="current" />}
              >
                Kezdés
              </Button>
            )}
          </div>
        </div>
      )}

      <Modal
        backdrop="blur"
        isOpen={profilePopup.isOpen}
        onClose={profilePopup.onClose}
      >
        <ModalContent>
          <ModalHeader>Profil</ModalHeader>
          <ModalBody>
            <Input
              label="Név"
              placeholder="Név"
              value={onlinePlayer?.name}
              onChange={(e) =>
                setOnlinePlayer({
                  ...onlinePlayer,
                  name: e.target.value,
                })
              }
            />

            <Input
              label="Egyéni bábu URL"
              placeholder="Egyéni bábu URL"
              value={onlinePlayer?.image}
              onChange={(e) =>
                setOnlinePlayer({
                  ...onlinePlayer,
                  image: e.target.value,
                })
              }
            />
          </ModalBody>
          <ModalFooter>
            <Button
              className="w-full font-medium mb-2"
              color="primary"
              onPress={profilePopup.onClose}
            >
              Mentés
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <div
        className={`absolute z-10 bg-black inset-0 transition-opacity duration-500 ${
          fading
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      ></div>
    </div>
  );
}
