//@ts-check
import React, { useEffect, useMemo, useState } from "react";
import { BigActiveField, Board } from "./Board.jsx";
import { CurrentPlayerPanel } from "./Components/CurrentPlayerPanel.jsx";
import Menu from "./Components/Menu.jsx";
import RollDiceButton from "./Components/RollDiceButton.jsx";
import Players from "./Players.jsx";
import { useAlert } from "./hooks/use-alert.js";
import { useCurrentPlayer } from "./hooks/use-current-player.js";
import { useGameState } from "./hooks/use-game-state.js";
import { usePopup } from "./hooks/use-popup.js";
import { IS_MENU_OPEN, PURCHASEABLE_ITEMS } from "./lib/constants.js";
import { FIELDS } from "./lib/fields-config.jsx";

export default function App() {
  const [gameState, setGameState] = useGameState();
  const { player, updatePlayer } = useCurrentPlayer();
  const {
    popupClass,
    popupContent,
    isOpen: isPopupOpen,
    openPopup,
    closePopup,
  } = usePopup();
  const {
    content: alertContent,
    showOnPopup: showAlertOnPopup,
    showCloseButton,
    isOpen: isAlertOpen,
    showAlert,
    closeAlert,
  } = useAlert();

  const [isMenuOpen, setIsMenuOpen] = useState(IS_MENU_OPEN);

  const winningPlayerIndex = useMemo(() => {
    return gameState.players.findIndex((player) =>
      PURCHASEABLE_ITEMS.every((item) => player.inventory.includes(item))
    );
  }, [gameState.players]);

  useEffect(() => {
    if (winningPlayerIndex !== -1) {
      showAlert(
        <>
          A játék véget ért! A(z){" "}
          <strong>{winningPlayerIndex + 1}. játékos nyert!</strong>
          <button
            className="new-game-button"
            onClick={() => {
              window.location.reload();
            }}
          >
            Új játék
          </button>
        </>,
        { showCloseButton: false }
      );
    }
  }, [winningPlayerIndex]);

  /** @param {number} steps */
  async function movePlayer(steps) {
    showAlert(`Dobott szám: ${steps}`);

    const playerIndex = gameState.currentPlayer;
    const oldPlayer = gameState.players[playerIndex];
    console.log("playerIndex", playerIndex);

    if (gameState.players[playerIndex].inJail && steps !== 6) {
      showAlert(
        `Csak hatos dobással lehet kiszabadulni a börtönből! (Dobott szám: ${steps})`
      );
      return;
    }

    const isStartingGame =
      oldPlayer.position === 0 &&
      oldPlayer.money === 400_000 &&
      oldPlayer.inventory.length === 0;

    setGameState(
      (prevGameState) => {
        if (prevGameState.players[playerIndex].inJail) {
          if (steps === 6) {
            prevGameState.players[playerIndex].inJail = false;
            prevGameState.players[playerIndex].position = 9 + steps;
            return prevGameState;
          }
        } else {
          prevGameState.players[playerIndex].position =
            (prevGameState.players[playerIndex].position + steps) % 27;
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

        setGameState(
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
          (newGameState) => {
            newField.action?.({
              currentPlayer: newGameState.players[playerIndex],
              updateCurrentPlayer: updatePlayer,
              gameState: newGameState,
              updateGameState: setGameState,
              playerIndex: playerIndex,
              openPopup: openPopup,
            });
          }
        );
      }
    );

    // Missing actions in field-config.jsx:
    // TODO: add casino
    // TODO: add insurance
    // TODO: add steelroad
  }

  /** @param {number} steps */
  function handleDiceRoll(steps) {
    updatePlayer((prevPlayer) => ({ ...prevPlayer, canRollDice: false }));
    movePlayer(steps);
  }

  function handleEndTurn() {
    // can leave hospital
    if (player.inHospital === "healed") {
      updatePlayer({ ...player, inHospital: "no" });
    }
    // can roll dice
    if (player.inHospital !== "arrived") {
      updatePlayer({ ...player, canRollDice: true });
    } else {
      // arrived to hospital, will be healed next turn
      updatePlayer({ ...player, inHospital: "healed" });
    }
    setGameState((prevGameState) => ({
      ...prevGameState,
      currentPlayer: (prevGameState.currentPlayer + 1) % 4,
    }));
  }

  return (
    <div>
      <Board>
        <div className="w-full h-full bg-[#0862e1] flex justify-between">
          {isMenuOpen ? (
            <Menu
              onClose={() => {
                document.documentElement.requestFullscreen();
                setIsMenuOpen(false);
              }}
            />
          ) : (
            <div className="flex w-full">
              <div className="p-4 h-full flex-2/6">
                <CurrentPlayerPanel />
              </div>
              <div className="flex-2/6 p-4 flex items-center justify-center">
                <BigActiveField />
              </div>

              <div className="flex-2/6 p-4">
                <div className="flex flex-col bg-black/50 rounded-xl text-white text-lg h-full text-center">
                  <div className="flex py-2 items-center justify-center bg-black/30 rounded-t-xl h-16">
                    <strong>Irányítás</strong>
                  </div>
                  <div className="flex flex-col gap-6 p-6 justify-center h-full items-center">
                    <div className="flex-1 w-full">
                      <RollDiceButton onDiceRoll={handleDiceRoll} />
                    </div>

                    <button
                      className="text-2xl w-full font-medium hover:bg-white/85 active:scale-[.98] transition-all duration-100 bg-white text-black rounded-xl py-2 px-6"
                      onClick={() => handleEndTurn()}
                    >
                      Kör vége
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <Players />
        </div>
      </Board>

      <div
        className={`popup-wrapper transition-opacity duration-200 ${
          isPopupOpen && !(!showAlertOnPopup && isAlertOpen)
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => closePopup()}
      >
        <div
          className={`popup-content popup-content-${popupClass} transition-transform duration-200 ${
            isPopupOpen && !(!showAlertOnPopup && isAlertOpen)
              ? "scale-100"
              : "scale-90"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {popupContent}
        </div>
      </div>

      <div
        className={`popup-wrapper transition-opacity duration-200 ${
          isAlertOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => {
          if (showCloseButton) {
            closeAlert();
          }
        }}
      >
        <div
          className={`alert-content transition-transform duration-200 ${
            isAlertOpen ? "scale-100" : "scale-70"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <span>{alertContent}</span>
          {showCloseButton && (
            <button
              className="hover:bg-black/80! active:scale-[.98] transition-all duration-100"
              onClick={() => {
                closeAlert();
              }}
            >
              Bezárás
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
