import { BigActiveFieldFader, Board } from "@/Components/Board.jsx";
import { CurrentPlayerPanel } from "@/Components/CurrentPlayerPanel.jsx";
import { Players } from "@/Components/Players.jsx";
import { RollDiceButton } from "@/Components/RollDiceButton.jsx";
import { useAlert } from "@/hooks/use-alert.js";
import { useGame } from "@/hooks/use-game";
import { usePopup } from "@/hooks/use-popup.js";
import { FIELDS } from "@/lib/fields-config";
import { useEffect, useRef, useState } from "react";
import { Phone } from "./field-popups/Phone";
import { TimeTravel } from "./TimeTravel";

export function Game() {
  const {
    popupClass,
    popupContent,
    isOpen: isPopupOpen,
    openPopup,
  } = usePopup();
  const {
    content: alertContent,
    showOnPopup: showAlertOnPopup,
    showCloseButton,
    isOpen: isAlertOpen,
    closeAlert,
  } = useAlert();

  const {
    state,
    loading,
    loadingRef,
    updateState,
    currentPlayer,
    isMyTurn,
    isMyTurnRef,
    updateCurrentPlayer,
    movePlayer,
    endTurn,
    closePopup,
  } = useGame();

  useEffect(() => {
    if (
      currentPlayer.state === "actionStarted" ||
      currentPlayer.state === "rolledDice"
    ) {
      if (!isMyTurnRef.current) return;
      const field = FIELDS[currentPlayer.position];
      field?.action?.({
        currentPlayer,
        updateCurrentPlayer,
        gameState: state,
        updateGameState: updateState,
        playerIndex: currentPlayer.index,
        openPopup,
      });
    }
  }, []);

  const [faded, setFaded] = useState(true);

  const timerOverRef = useRef(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setFaded(false);
    setTimeout(() => {
      timerOverRef.current = true;
      if (loadingRef.current) return;
      setIsReady(true);
    }, 2000);
  }, []);

  useEffect(() => {
    if (timerOverRef.current && !loading) {
      setIsReady(true);
    }
  }, [loading]);

  return (
    <>
      <div className="bg-[#0862e1] text-black">
        <Board>
          <div className="w-full h-full bg-[#0862e1] flex justify-between">
            <div className="flex w-full">
              <div className="p-4 h-full flex-2/6">
                <CurrentPlayerPanel />
              </div>
              <div className="flex-2/6 p-4 flex items-center justify-center">
                <BigActiveFieldFader />
              </div>

              <div className="flex-2/6 p-4">
                <div className="flex flex-col bg-black/50 rounded-xl text-white text-lg h-full text-center">
                  <div className="flex py-2 items-center justify-center bg-black/30 rounded-t-xl h-16">
                    <strong>Irányítás</strong>
                  </div>
                  <div className="flex flex-col gap-6 p-6 justify-center h-full items-center">
                    <div className="flex-1 w-full">
                      <RollDiceButton
                        onDiceRoll={(steps) => {
                          updateCurrentPlayer((prev) => ({
                            ...prev,
                            rollingDice: false,
                          }));
                          if (isMyTurnRef.current) {
                            movePlayer(currentPlayer.index, steps);
                          }
                        }}
                      />
                    </div>

                    <button
                      className="text-2xl w-full font-medium hover:bg-white/85 active:not-disabled:scale-[.98] transition-all duration-100 bg-white text-black rounded-xl py-2 px-6 disabled:bg-white! disabled:text-black! disabled:opacity-50"
                      onClick={() => openPopup("phone", <Phone />)}
                      disabled={
                        !currentPlayer.inventory.includes("phone") ||
                        currentPlayer.batteryPercentage <= 0
                      }
                    >
                      Telefon
                    </button>

                    <button
                      className="text-2xl w-full font-medium hover:bg-white/85 active:not-disabled:scale-[.98] transition-all duration-100 bg-white text-black rounded-xl py-2 px-6 disabled:bg-white! disabled:text-black! disabled:opacity-50"
                      onClick={() => endTurn(currentPlayer.index)}
                      disabled={!currentPlayer.canEndTurn || !isMyTurn}
                    >
                      Kör vége
                    </button>
                  </div>
                </div>
              </div>
            </div>
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

      <div
        className={`absolute inset-0 transition-opacity duration-500 z-[10000] ${
          !isReady
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <TimeTravel />
      </div>

      <div
        className={`absolute z-[10000] bg-black inset-0 transition-opacity duration-500 ${
          faded
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      ></div>
    </>
  );
}
