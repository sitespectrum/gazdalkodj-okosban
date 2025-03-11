import { WinnerAlert } from "@/Components/WinnerAlert";
import { FIXED_DICE_ROLL, PURCHASEABLE_ITEMS } from "@/lib/constants";
import { gameDataContext } from "@/lib/contexts";
import { FIELDS } from "@/lib/fields-config";
import { getRandomNumber } from "@/lib/utils";
import { createElement, useCallback, useContext } from "react";
import { useAlert } from "../use-alert";
import { usePopup } from "../use-popup";
import { useEffect } from "react";

/** @typedef {import("@/lib/types").GameManager} GameManager */
/** @typedef {import("@/lib/types").GameState} GameState */
/** @typedef {import("@/lib/types").Player} Player */
/** @typedef {import("@/lib/types").ShopItem} ShopItem */
/**
 * @template T
 * @typedef {import("@/lib/types").Result<T>} Result
 */

/**
 * @returns {GameManager}
 */
export function useLocalGame() {
  const { isOpen, popupContent, openPopup, closePopup } = usePopup();
  const { showAlert } = useAlert();

  const { meta, setMeta, state, setState } = useContext(gameDataContext);

  if (!meta || !state || !setMeta || !setState) {
    throw new Error("Game context not found or not initialized");
  }

  useEffect(() => {
    if (
      !isOpen &&
      popupContent &&
      state.players[state.currentPlayer].state === "actionStarted"
    ) {
      updateState((prev) => {
        prev.players[prev.currentPlayer].state = "actionEnded";
        return {
          ...prev,
        };
      });
    }
  }, [isOpen]);

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
        if (meta.id !== "temp") {
          const jsonData = JSON.stringify({
            meta,
            state: newState,
          });
          localStorage.setItem(`local-game-${meta.id}`, jsonData);
        }

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
  async function rollDice(playerIndex) {
    if (FIXED_DICE_ROLL) {
      updateState((prev) => {
        prev.players[playerIndex].rollingDice = true;
        prev.players[playerIndex].rolledDice = FIXED_DICE_ROLL;
        return {
          ...prev,
        };
      });
      return;
    }

    const result = getRandomNumber(1, 6);
    updateState((prev) => {
      prev.players[playerIndex].rollingDice = true;
      prev.players[playerIndex].rolledDice = result;
      return {
        ...prev,
      };
    });
  }

  /**
   * @param {number} playerIndex
   * @param {ShopItem} item
   * @returns {Promise<Result<null>>}
   */
  async function buyItem(playerIndex, item) {
    const player = state.players[playerIndex];
    if (player.money < item.price) {
      return {
        success: false,
        error: "Nincs elég pénzed!",
      };
    }

    updateState((prev) => {
      const updatedPlayer = {
        ...player,
        money: player.money - item.price,
        inventory: [...player.inventory, item.id],
      };
      return {
        ...prev,
        players: prev.players.map((p, index) =>
          index === playerIndex ? updatedPlayer : p
        ),
      };
    });

    return {
      success: true,
      data: null,
    };
  }

  /**
   * @param {number} playerIndex
   * @param {number} steps
   * @returns {Promise<void>}
   */
  async function movePlayer(playerIndex, steps) {
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

  /**
   * @param {number} playerIndex
   * @returns {Promise<Result<null>>}
   */
  async function endTurn(playerIndex) {
    updateState((prev) => {
      prev.currentPlayer = (playerIndex + 1) % prev.players.length;
      prev.players[prev.currentPlayer].state = "justStarted";
      prev.players[prev.currentPlayer].canRollDice = true;
      prev.players[prev.currentPlayer].canEndTurn = false;
      prev.players[prev.currentPlayer].rollingDice = false;
      prev.players[prev.currentPlayer].rolledDice = null;

      if (prev.players[prev.currentPlayer].inHospital) {
        prev.players[prev.currentPlayer].canRollDice = false;
        prev.players[prev.currentPlayer].canEndTurn = true;
        prev.players[prev.currentPlayer].state = "actionEnded";
        prev.players[prev.currentPlayer].inHospital = false;
      }

      prev.winningPlayerIndex = prev.players.findIndex((player) => {
        const allItems = Object.values(PURCHASEABLE_ITEMS);
        return allItems
          .filter((item) => !item.optional)
          .every((item) => player.inventory.includes(item.id));
      });

      return {
        ...prev,
      };
    });

    return {
      success: true,
      data: null,
    };
  }

  return {
    meta,
    state,
    currentPlayer: state.players[state.currentPlayer],
    isMyTurn: true,

    updateMeta: setMeta,
    updateState,
    updateCurrentPlayer,

    rollDice,
    movePlayer,
    endTurn,

    buyItem,
  };
}
