import { WinnerAlert } from "@/Components/WinnerAlert";
import { gameDataContext } from "@/lib/contexts";
import { createElement, useContext, useEffect } from "react";
import { useAlert } from "../use-alert";
import { usePopup } from "../use-popup";
import { useCallback } from "react";
import { useRef } from "react";
import { SERVER_URL } from "@/lib/constants";
import { FIELDS } from "@/lib/fields-config";

/** @typedef {import("@/lib/types").GameManager} GameManager */
/** @typedef {import("@/lib/types").GameState} GameState */
/** @typedef {import("@/lib/types").Player} Player */
/** @typedef {import("@/lib/types").ShopItem} ShopItem */
/**
 * @template T
 * @typedef {import("@/lib/types").Result<T>} Result
 */
/**
 * @template [T=any]
 * @typedef {import("@/lib/types").WebSocketMessage<T>} WebSocketMessage
 */

/**
 * @returns {GameManager}
 */
export function useOnlineGame() {
  const { isOpen, popupContent, openPopup, closePopup } = usePopup();
  const { showAlert } = useAlert();

  const { meta, setMeta, state, setState } = useContext(gameDataContext);

  if (!meta || !state || !setMeta || !setState) {
    throw new Error("Game context not found or not initialized");
  }

  const ws = useRef(/** @type {WebSocket} */ (null));

  useEffect(() => {
    ws.current = new WebSocket(`${SERVER_URL}/ws`);
    ws.current.onmessage = handleMessage;
    ws.current.onopen = () => {
      console.log("WebSocket is open");
    };
    ws.current.onclose = () => {
      console.log("WebSocket is closed");
    };

    return () => {
      ws.current.close();
    };
  }, []);

  useEffect(() => {
    if (state.winningPlayerIndex !== -1) {
      showAlert(createElement(WinnerAlert), { showCloseButton: false });
    }
  }, [state.winningPlayerIndex]);

  const updateState = useCallback(
    /**
     * @param {GameState | ((state: GameState) => GameState)} updater
     * @param {(state: GameState) => any} callback
     */
    (updater, callback = null) => {
      setState(updater, (newState) => {
        if (callback) {
          callback(newState);
        }
      });
    },
    [meta, setState]
  );

  const updateCurrentPlayer = useCallback(
    (
      /** @type {Player | ((player: Player) => Player)} */ playerOrUpdater,
      /** @type {(player: Player) => any} */ callback
    ) => {
      updateState(
        (prev) => {
          const currentPlayer = prev.players[prev.currentPlayer];
          const updatedPlayer =
            typeof playerOrUpdater === "function"
              ? playerOrUpdater(currentPlayer)
              : playerOrUpdater;

          return {
            ...prev,
            players: prev.players.map((p, index) =>
              index === prev.currentPlayer ? updatedPlayer : p
            ),
          };
        },
        (newState) => {
          if (callback) {
            callback(newState.players[newState.currentPlayer]);
          }
        }
      );
    },
    [updateState]
  );

  /**
   * @param {number} playerIndex
   */
  async function rollDiceCaller(playerIndex) {
    sendMessage({
      type: "roll-dice",
      data: { playerIndex },
    });
    updateState((prev) => {
      prev.players[playerIndex].rollingDice = true;
      return {
        ...prev,
      };
    });
  }

  /**
   * @param {WebSocketMessage<{playerIndex: number}>} message
   */
  async function rollDiceStartedReceiver(message) {
    updateState((prev) => {
      prev.players[message.data.playerIndex].rollingDice = true;
      return {
        ...prev,
      };
    });
  }

  /**
   * @param {WebSocketMessage<{playerIndex: number, result: number}>} message
   */
  async function rollDiceReceiver(message) {
    updateState((prev) => {
      prev.players[message.data.playerIndex].rolledDice = message.data.result;
      return {
        ...prev,
      };
    });
  }

  /**
   * @param {number} playerIndex
   * @param {number} steps
   */
  async function movePlayerCaller(playerIndex, steps) {
    sendMessage({
      type: "move-player",
      data: { playerIndex, steps },
    });
  }

  /**
   * @param {WebSocketMessage<{playerIndex: number, steps: number}>} message
   */
  async function movePlayerReceiver(message) {
    const { playerIndex, steps } = message.data;

    const oldPlayer = state.players[playerIndex];

    if (state.players[playerIndex].inJail && steps !== 6) {
      updateState(
        (prevGameState) => {
          prevGameState.players[playerIndex].canRollDice = false;
          return {
            ...prevGameState,
          };
        },
        async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          showAlert(`Csak hatos dobással lehet kiszabadulni a börtönből!`);
          updateState((prevGameState) => {
            prevGameState.players[playerIndex].state = "rolledDice";
            return {
              ...prevGameState,
            };
          });
        }
      );
      return;
    }

    const isStartingGame =
      oldPlayer.position === 0 &&
      oldPlayer.money === 400_000 &&
      oldPlayer.inventory.length === 0;

    updateState(
      (prevGameState) => {
        prevGameState.players[playerIndex].canRollDice = false;
        if (prevGameState.players[playerIndex].inJail) {
          if (steps === 6) {
            prevGameState.players[playerIndex].inJail = false;
            prevGameState.players[playerIndex].position = 9 + steps;
            return prevGameState;
          }
        } else {
          prevGameState.players[playerIndex].position =
            (prevGameState.players[playerIndex].position + steps) % 27;
          prevGameState.players[playerIndex].canEndTurn = false;
          prevGameState.players[playerIndex].state = "rolledDice";
        }

        return {
          ...prevGameState,
        };
      },
      (newGameState) => {
        const newField = FIELDS[newGameState.players[playerIndex].position];

        const crossedStart =
          oldPlayer.position > newGameState.players[playerIndex].position &&
          newGameState.players[playerIndex].position !== 0 &&
          !oldPlayer.inJail;

        updateState(
          (prevGameState) => {
            if (crossedStart && newField.id !== 0) {
              prevGameState.players[playerIndex].money += 150_000;
            }

            if (
              (crossedStart || oldPlayer.position === 0) &&
              !oldPlayer.inventory.includes("Ház") &&
              !isStartingGame
            ) {
              prevGameState.players[playerIndex].money -= 70_000;
            }

            return {
              ...prevGameState,
            };
          },
          async (_) => {
            await new Promise((resolve) => setTimeout(resolve, 1000));

            updateState(
              (prevGameState) => ({
                ...prevGameState,
                players: prevGameState.players.map((player) => ({
                  ...player,
                  canEndTurn: true,
                })),
              }),
              () => {
                updateState(
                  (prev) => {
                    prev.players[playerIndex].state = newField.isActionInstant
                      ? "actionEnded"
                      : "actionStarted";
                    return {
                      ...prev,
                    };
                  },
                  (newState) => {
                    newField.action?.({
                      currentPlayer: newState.players[playerIndex],
                      updateCurrentPlayer: updateCurrentPlayer,
                      gameState: newState,
                      updateGameState: updateState,
                      playerIndex: playerIndex,
                      openPopup: openPopup,
                    });
                  }
                );
              }
            );
            openPopup("", null);
            closePopup();
          }
        );
      }
    );
  }

  const sendMessage = useCallback(
    /**
     * @param {WebSocketMessage} message
     */
    (message) => {
      ws.current.send(JSON.stringify(message));
    },
    [ws]
  );

  const handleMessage = useCallback(
    /**
     * @param {MessageEvent} wsMessage
     */
    (wsMessage) => {
      const message = JSON.parse(wsMessage.data);
      console.log("message", message);

      switch (message.type) {
        case "roll-dice-started":
          rollDiceStartedReceiver(message);
          break;
        case "roll-dice-result":
          rollDiceReceiver(message);
          break;
        case "move-player-result":
          movePlayerReceiver(message);
          break;
      }
    },
    [updateState]
  );

  return {
    meta,
    state,
    currentPlayer: state.players[state.currentPlayer],

    updateMeta: setMeta,
    updateState,
    updateCurrentPlayer,

    rollDice: rollDiceCaller,
    movePlayer: movePlayerCaller,
  };
}
