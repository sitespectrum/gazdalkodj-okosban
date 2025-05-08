import { WinnerAlert } from "@/Components/WinnerAlert";
import {
  FIXED_DICE_ROLL,
  LUCKY_CARDS,
  PURCHASEABLE_ITEMS,
} from "@/lib/constants";
import { gameDataContext } from "@/lib/contexts";
import { FIELDS } from "@/lib/fields-config";
import { getRandomNumber } from "@/lib/utils";
import { createElement, useCallback, useContext } from "react";
import { useAlert } from "../use-alert";
import { usePopup } from "../use-popup";
import { useEffect } from "react";
import { useRef } from "react";
import { FineAlert } from "@/Components/FineAlert";

/** @typedef {import("@/lib/types").GameManager} GameManager */
/** @typedef {import("@/lib/types").GameState} GameState */
/** @typedef {import("@/lib/types").Player} Player */
/** @typedef {import("@/lib/types").ShopItem} ShopItem */
/** @typedef {import("@/lib/types").Insurance} Insurance */
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

  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const isMyTurnRef = useRef(true);
  const loadingRef = useRef(false);

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
            meta: {
              ...meta,
              lastPlayed: Date.now(),
            },
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
   */
  async function buyItem(playerIndex, item) {
    const player = state.players[playerIndex];
    if (player.money < item.price) {
      showAlert(`Nincs elég pénzed!`);
      return;
    }

    if (player.inventory.includes(item.id)) {
      showAlert(`Már van ilyen terméked!`);
      return;
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
  }

  /**
   * @param {number} playerIndex
   * @param {Insurance} insurance
   */
  async function buyInsurance(playerIndex, insurance) {
    const player = stateRef.current.players[playerIndex];
    if (player.money < insurance.price) {
      showAlert(`Nincs elég pénzed!`);
      return;
    }

    if (player.insurances.includes(insurance.id)) {
      showAlert(`Már van ilyen biztosításod!`);
      return;
    }

    updateState((prev) => {
      const updatedPlayer = {
        ...player,
        money: player.money - insurance.price,
        insurances: [...player.insurances, insurance.id],
      };
      return {
        ...prev,
        players: prev.players.map((p, index) =>
          index === playerIndex ? updatedPlayer : p
        ),
      };
    });
  }

  /**
   * @param {number} playerIndex
   * @param {number} steps
   * @returns {Promise<void>}
   */
  async function movePlayer(playerIndex, steps) {
    const oldPlayerPosition = stateRef.current.players[playerIndex].position;
    const oldPlayerHasHouse =
      stateRef.current.players[playerIndex].inventory.includes("house");
    const oldPlayerInJail = stateRef.current.players[playerIndex].inJail;

    if (oldPlayerInJail && steps !== 6) {
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
            prevGameState.players[playerIndex].canEndTurn = true;
            return {
              ...prevGameState,
            };
          });
        }
      );
      return;
    }

    const isStartingGame =
      stateRef.current.players[playerIndex].position === 0 &&
      stateRef.current.players[playerIndex].money === 400_000 &&
      stateRef.current.players[playerIndex].inventory.length === 0;

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
          oldPlayerPosition > newGameState.players[playerIndex].position &&
          newGameState.players[playerIndex].position !== 0 &&
          !oldPlayerInJail;

        updateState(
          (prevGameState) => {
            if (crossedStart && newField.id !== 0) {
              prevGameState.players[playerIndex].money += 150_000;
            }

            if (
              (crossedStart || oldPlayerPosition === 0) &&
              !oldPlayerHasHouse &&
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
                    newField?.action?.({
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
   * @returns {Promise<void>}
   */
  async function endTurn(playerIndex) {
    updateState((prev) => {
      prev.currentPlayer = (playerIndex + 1) % prev.players.length;
      prev.players[prev.currentPlayer].state = "justStarted";
      prev.players[prev.currentPlayer].canRollDice = true;
      prev.players[prev.currentPlayer].canEndTurn = false;
      prev.players[prev.currentPlayer].rollingDice = false;
      prev.players[prev.currentPlayer].rolledDice = null;
      prev.players[prev.currentPlayer].luckyID = null;
      prev.players[prev.currentPlayer].luckyFlipped = false;
      prev.players[prev.currentPlayer].batteryPercentage = 100;

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
  }

  /**
   * @param {number} position
   * @returns {[number, boolean]}
   */
  function getNextStop(position) {
    let nextStop = FIELDS.find((x) => x.isStop && x.id > position)?.id;
    let crossedStart = false;
    if (!nextStop) {
      nextStop = FIELDS.find((x) => x.isStop)?.id;
      crossedStart = true;
    }
    if (!nextStop) {
      console.log("[steelroad] No next stop found", {
        playerPosition: position,
        fields: FIELDS,
      });
      nextStop = position;
    }
    return [nextStop, crossedStart];
  }

  /**
   * @param {number} playerIndex
   * @param {number} stop
   */
  async function buyTrainTicket(playerIndex, stop) {
    const player = stateRef.current.players[playerIndex];
    if (player.money < 3000) {
      showAlert("Nincs elég pénzed a jegyvásárláshoz!");
      return;
    }

    const [nextStop, crossedStart] = getNextStop(stop);
    let moneyAdjustment = -3000;
    if (crossedStart) {
      moneyAdjustment += 150_000;
      if (!player.inventory.includes("house")) {
        moneyAdjustment -= 70_000;
      }
    }

    updateCurrentPlayer((prev) => ({
      ...prev,
      money: prev.money + moneyAdjustment,
      position: nextStop,
    }));

    closePopup();
  }

  /**
   * @param {number} playerIndex
   * @param {number} stop
   */
  async function freeRideTrain(playerIndex, stop) {
    const player = stateRef.current.players[playerIndex];
    const [nextStop, crossedStart] = getNextStop(stop);

    let moneyAdjustment = 0;

    const shouldFine = Math.random();
    if (shouldFine < 0.5) {
      moneyAdjustment = -40_000;
      showAlert(createElement(FineAlert, { name: player.name }));
    }
    if (crossedStart) {
      moneyAdjustment += 150_000;
      if (!player.inventory.includes("house")) {
        moneyAdjustment -= 70_000;
      }
    }

    updateCurrentPlayer((prev) => ({
      ...prev,
      money: prev.money + moneyAdjustment,
      position: nextStop,
    }));

    closePopup();
  }

  /**
   * @param {number} playerIndex
   */
  async function flipLuckyCard(playerIndex) {
    const cards = LUCKY_CARDS.filter(
      (card) =>
        card.condition?.({
          currentPlayer: stateRef.current.players[playerIndex],
          gameState: stateRef.current,
          playerIndex: playerIndex,
        }) ?? true
    );

    const totalWeight = cards
      .map((card) => card.weight)
      .reduce((a, b) => a + b, 0);

    if (cards.length === 0) {
      showAlert("Nincs elérhető szerencsekártya!");
      return;
    }

    const random = getRandomNumber(0, totalWeight);

    console.log("[lucky] Random", {
      cards,
      totalWeight,
      random,
    });

    let currentWeight = 0;
    let chosenCard = null;
    for (const card of cards) {
      currentWeight += card.weight;
      if (random <= currentWeight) {
        chosenCard = card;
        break;
      }
    }

    updateState(
      (prev) => {
        prev.players[playerIndex].luckyID = chosenCard.id;
        prev.players[playerIndex].luckyFlipped = true;
        return {
          ...prev,
        };
      },
      () => {
        chosenCard.action({
          currentPlayer: stateRef.current.players[playerIndex],
          updateCurrentPlayer: updateCurrentPlayer,
          gameState: stateRef.current,
          updateGameState: updateState,
          playerIndex: playerIndex,
          openPopup: openPopup,
        });
      }
    );
  }

  /**
   * @param {number} playerIndex
   * @param {number} money
   */
  async function successfulBankRobbery(playerIndex, money) {
    updateState((prev) => {
      prev.players[playerIndex].money += money;
      prev.players[playerIndex].state = "actionEnded";
      return {
        ...prev,
      };
    });
  }

  /**
   * @param {number} playerIndex
   */
  async function failedBankRobbery(playerIndex) {
    updateState((prev) => {
      prev.players[playerIndex].inJail = true;
      prev.players[playerIndex].position = 27;
      prev.players[playerIndex].state = "actionEnded";
      return {
        ...prev,
      };
    });
  }

  /**
   * @param {number} playerIndex
   * @param {number} bet
   */
  async function placeBet(playerIndex, bet) {
    updateState((prev) => {
      prev.players[playerIndex].money -= bet;
      prev.players[playerIndex].currentBet = bet;
      return {
        ...prev,
      };
    });
  }

  /**
   * @param {number} playerIndex
   */
  async function loseBet(playerIndex) {
    updateState((prev) => {
      prev.players[playerIndex].currentBet = null;
      return {
        ...prev,
      };
    });
  }

  /**
   * @param {number} playerIndex
   */
  async function winBet(playerIndex) {
    updateState((prev) => {
      prev.players[playerIndex].money +=
        prev.players[playerIndex].currentBet * 2;
      prev.players[playerIndex].currentBet = null;
      return {
        ...prev,
      };
    });
  }

  /**
   * @param {number} playerIndex
   */
  async function refundBet(playerIndex) {
    updateState((prev) => {
      prev.players[playerIndex].money += prev.players[playerIndex].currentBet;
      prev.players[playerIndex].currentBet = null;
      return {
        ...prev,
      };
    });
  }

  return {
    meta,
    state,
    currentPlayer: state.players[state.currentPlayer],
    isMyTurn: true,
    isMyTurnRef,
    loading: false,
    loadingRef,

    closePopup,

    updateMeta: setMeta,
    updateState,
    updateCurrentPlayer,

    rollDice,
    movePlayer,
    endTurn,

    buyItem,
    buyInsurance,
    buyTrainTicket,
    freeRideTrain,
    flipLuckyCard,

    successfulBankRobbery,
    failedBankRobbery,

    placeBet,
    loseBet,
    winBet,
    refundBet,
  };
}
