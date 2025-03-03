//@ts-check
import React, { useEffect, useMemo, useState } from "react";
import { Board } from "./Board.jsx";
import { CurrentPlayerPanel } from "./Components/CurrentPlayerPanel.jsx";
import Menu from "./Components/Menu.jsx";
import "./Fields.css";
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
  const { popupClass, popupContent, openPopup, closePopup } = usePopup();
  const {
    content: alertContent,
    showOnPopup: showAlertOnPopup,
    showCloseButton,
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
              !oldPlayer.inventory.includes("Ház")
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

    // setPlayerPositions((prevPositions) => {
    //   const newPositions = [...prevPositions];
    //   let newPosition = newPositions[playerIndex] + steps;
    //   if (newPositions[playerIndex] === 27 && steps !== 6) {
    //     showAlert("Csak hatos dobással lehet kiszabadulni a börtönből!");
    //     return prevPositions;
    //   } else if (newPositions[playerIndex] === 27 && steps === 6) {
    //     newPosition = 9;
    //   }

    //   const crossedStart = newPosition > 27;

    //   newPosition = newPosition % 27;

    //   if (crossedStart) {
    //     console.log(`Pénz hozzáadva a ${player.name}. játékosnak`);
    //     updatePlayer({ ...player, money: player.money + 80_000 });
    //   }

    //   newPositions[playerIndex] = newPosition;
    //   setPlayerPositions(newPositions);

    //   const currentField = FIELDS[newPosition];

    //   currentField.action?.({
    //     currentPlayer: player,
    //     updateCurrentPlayer: updatePlayer,
    //     gameState: gameState,
    //     updateGameState: setGameState,
    //   });

    //   if (newPositions[playerIndex] === 3) {
    //     setPopupClass("elza");
    //     setPopupContent(<Elza onClose={() => setPopupContent(null)} />);
    //   }

    //   if (newPositions[playerIndex] === 5) {
    //     setPopupClass("bankrobbery");
    //     setPopupContent(<BankRobbery onClose={() => setPopupContent(null)} />);
    //   }

    //   if (newPositions[playerIndex] === 6) {
    //     setPopupClass("elzaandidea");
    //     setPopupContent(<ElzaAndIdea onClose={() => setPopupContent(null)} />);
    //   }

    //   if (newPositions[playerIndex] === 12) {
    //     setPopupClass("casino");
    //     setPopupContent(<Casino onClose={() => setPopupContent(null)} />);
    //   }

    //   if (newPositions[playerIndex] === 14) {
    //     setPopupClass("bobthebuilder");
    //     setPopupContent(
    //       <>
    //         <h1 className="bobthebuilder-title">Házépítés</h1>
    //         <Bobthebuilder onClose={() => setPopupContent(null)} />
    //       </>
    //     );
    //   }

    //   if (newPositions[playerIndex] === 15) {
    //     setPopupClass("carshop");
    //     setPopupContent(<Carshop onClose={() => setPopupContent(null)} />);
    //   }

    //   if (newPositions[playerIndex] === 20) {
    //     setPopupClass("idea");
    //     setPopupContent(<Idea onClose={() => setPopupContent(null)} />);
    //   }

    //   if (newPositions[playerIndex] === 24) {
    //     setPopupClass("insurance");
    //     setPopupContent(<Insurance onClose={() => setPopupContent(null)} />);
    //   }

    //   if (
    //     newPositions[playerIndex] === 1 ||
    //     newPositions[playerIndex] === 7 ||
    //     newPositions[playerIndex] === 17
    //   ) {
    //     setPopupClass("lucky");
    //     setPopupContent(<Lucky onClose={() => setPopupContent(null)} />);
    //   }

    //   if (
    //     newPositions[playerIndex] === 4 ||
    //     newPositions[playerIndex] === 11 ||
    //     newPositions[playerIndex] === 18 ||
    //     newPositions[playerIndex] === 25
    //   ) {
    //     setPopupClass("steelroad");
    //     setPopupContent(
    //       <>
    //         <img src="./src/Logos/MKV logo.png" className="steelroad-logo" />
    //         <Steelroad onClose={() => setPopupContent(null)} />
    //       </>
    //     );
    //   }

    //   return newPositions;
    // });
  }

  function rollDice() {
    // return 5;
    return Math.floor(Math.random() * 6) + 1;
  }

  function handleDiceRoll() {
    const steps = rollDice();
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
              <div className="flex-2/6">
                <ActivePictures />
              </div>

              <div className="flex-2/6 p-4">
                <div className="flex flex-col bg-black/50 rounded-xl text-white text-lg h-full text-center">
                  <div className="flex py-2 items-center justify-center bg-black/30 rounded-t-xl h-16">
                    <strong>Irányítás</strong>
                  </div>
                  <div className="flex flex-col gap-8 justify-center h-full items-center">
                    <button
                      className="text-2xl bg-white text-black rounded-xl py-2 px-6 w-fit"
                      disabled={!player.canRollDice}
                      onClick={() => handleDiceRoll()}
                    >
                      Dobás
                    </button>

                    <button
                      className="text-2xl bg-white text-black rounded-xl py-2 px-6 w-fit"
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

      {popupContent && !(!showAlertOnPopup && alertContent) ? (
        <>
          <div
            className={`popup-wrapper-${popupClass}`}
            onClick={() => closePopup()}
          >
            <div
              className={`popup-content-${popupClass}`}
              onClick={(e) => e.stopPropagation()}
            >
              {popupContent}
            </div>
          </div>
        </>
      ) : (
        <></>
      )}

      {alertContent ? (
        <>
          <div
            className={`alert-wrapper`}
            onClick={() => {
              if (showCloseButton) {
                closeAlert();
              }
            }}
          >
            <div
              className={`alert-content`}
              onClick={(e) => e.stopPropagation()}
            >
              <span>{alertContent}</span>
              {showCloseButton && (
                <button
                  onClick={() => {
                    closeAlert();
                  }}
                >
                  Bezárás
                </button>
              )}
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

function ActivePictures() {
  const { player } = useCurrentPlayer();

  return player.position ? (
    <div className="w-full h-full flex p-4 items-center justify-center">
      <img
        src={`./src/HQ Pictures/${player.position + 1}. Mező.png`}
        alt={`${player.position + 1}. Mező`}
        className="w-full h-full object-contain"
      />
    </div>
  ) : null;
}
