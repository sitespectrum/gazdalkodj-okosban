import { useLocalGame } from "@/hooks/managers/use-local-game";
import { useOnlineGame } from "@/hooks/managers/use-online-game";
import { useCallbackState } from "@/hooks/use-callback-state.js";
import {
  alertContext,
  gameContext,
  gameDataContext,
  popupContext,
} from "@/lib/contexts.js";
import { Button, Link, Modal } from "@heroui/react";
import { ModalContent } from "@heroui/react";
import { useDisclosure } from "@heroui/react";
import { useState } from "react";

/** @typedef {import("@/lib/types").GameData} GameData */
/** @typedef {import("@/lib/types").GameState} GameState */
/** @typedef {import("@/lib/types").GameMeta} GameMeta */
/**
 * @template T
 * @typedef {import("@/lib/types").CallbackState<T>} CallbackState
 */

export function Providers({ children }) {
  /** @type {[string, React.Dispatch<React.SetStateAction<string>>]} */
  const [popupClass, setPopupClass] = useState("");
  /** @type {[any, React.Dispatch<React.SetStateAction<any>>]} */
  const [popupContent, setPopupContent] = useState(null);
  /** @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]} */
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  /** @type {[any, React.Dispatch<React.SetStateAction<any>>]} */
  const [alertContent, setAlertContent] = useState(null);
  /** @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]} */
  const [showAlertOnPopup, setShowAlertOnPopup] = useState(false);
  /** @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]} */
  const [showCloseButton, setShowCloseButton] = useState(true);
  /** @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]} */
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  return (
    <popupContext.Provider
      value={[
        popupClass,
        setPopupClass,
        popupContent,
        setPopupContent,
        isPopupOpen,
        setIsPopupOpen,
      ]}
    >
      <alertContext.Provider
        value={[
          alertContent,
          setAlertContent,
          showAlertOnPopup,
          setShowAlertOnPopup,
          showCloseButton,
          setShowCloseButton,
          isAlertOpen,
          setIsAlertOpen,
        ]}
      >
        {children}
      </alertContext.Provider>
    </popupContext.Provider>
  );
}

/**
 * @param {Object} props
 * @param {GameData} props.initialData
 * @param {React.ReactNode} props.children
 */
export function GameDataProvider({ initialData, children }) {
  const [meta, setMeta] = useCallbackState(initialData.meta);
  const [state, setState] = useCallbackState(initialData.state);

  return (
    <gameDataContext.Provider value={{ meta, setMeta, state, setState }}>
      {children}
    </gameDataContext.Provider>
  );
}

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
export function LocalGameProvider({ children }) {
  const game = useLocalGame();

  return <gameContext.Provider value={game}>{children}</gameContext.Provider>;
}

/**
 * @param {Object} props
 * @param {string} props.id
 * @param {React.ReactNode} props.children
 */
export function OnlineGameProvider({ id, children }) {
  const game = useOnlineGame(id);

  return (
    <>
      <gameContext.Provider value={game}>{children}</gameContext.Provider>

      <Modal
        isOpen={game.connectionError !== null}
        backdrop="blur"
        className="light text-foreground bg-background"
        hideCloseButton
        placement="center"
        classNames={{
          backdrop: "z-[10000]",
          wrapper: "z-[10001]",
          body: "z-[10002]",
        }}
      >
        <ModalContent>
          <div className="p-8 flex flex-col gap-8 items-center text-center justify-center">
            {game.connectionError === "game-not-found" && (
              <span className="text-3xl">Játék nem található</span>
            )}
            {game.connectionError === "game-already-started" && (
              <span className="text-3xl">Játék már elkezdődött</span>
            )}
            {game.connectionError === "player-not-found" && (
              <span className="text-3xl">Nem vagy benne ebben a játékban</span>
            )}
            {game.connectionError === "Closing" && (
              <span className="text-3xl">A kapcsolat megszakadt</span>
            )}

            <Button
              as={Link}
              href="/"
              size="lg"
              color="primary"
              className="text-3xl px-10 py-8"
            >
              Vissza a főoldalra
            </Button>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
}
