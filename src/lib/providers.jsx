//@ts-check
import { useState } from "react";
import { popupContext, alertContext, gameStateContext } from "./contexts.js";
import { DEFAULT_GAME_STATE } from "./constants.js";
import React from "react";

/** @typedef {import('./types').GameState} GameState */

export function Providers({ children }) {
  /** @type {[string, React.Dispatch<React.SetStateAction<string>>]} */
  const [popupClass, setPopupClass] = useState("");
  /** @type {[any, React.Dispatch<React.SetStateAction<any>>]} */
  const [popupContent, setPopupContent] = useState(null);

  /** @type {[any, React.Dispatch<React.SetStateAction<any>>]} */
  const [alertContent, setAlertContent] = useState(null);
  /** @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]} */
  const [showAlertOnPopup, setShowAlertOnPopup] = useState(false);
  /** @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]} */
  const [showCloseButton, setShowCloseButton] = useState(true);

  /** @type {[GameState, React.Dispatch<React.SetStateAction<GameState>>]} */
  const [gameState, setGameState] = useState(DEFAULT_GAME_STATE);

  return (
    <popupContext.Provider
      value={[popupClass, setPopupClass, popupContent, setPopupContent]}
    >
      <alertContext.Provider
        value={[
          alertContent,
          setAlertContent,
          showAlertOnPopup,
          setShowAlertOnPopup,
          showCloseButton,
          setShowCloseButton,
        ]}
      >
        <gameStateContext.Provider value={[gameState, setGameState]}>
          {children}
        </gameStateContext.Provider>
      </alertContext.Provider>
    </popupContext.Provider>
  );
}
