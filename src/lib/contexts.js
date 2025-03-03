//@ts-check
import { createContext } from "react";
import { DEFAULT_GAME_STATE } from "./constants";

/** @typedef {import('./types').GameState} GameState */
/** @typedef {[string, React.Dispatch<React.SetStateAction<string>>, any, React.Dispatch<React.SetStateAction<any>>]} PopupContext */
/** @typedef {[any, React.Dispatch<React.SetStateAction<any>>, boolean, React.Dispatch<React.SetStateAction<boolean>>, boolean, React.Dispatch<React.SetStateAction<boolean>>]} AlertContext */
/** @typedef {import('./types').CallbackState<GameState>} GameStateContext */

/** @type {React.Context<PopupContext>} */
export const popupContext = createContext(["", (_) => {}, null, (_) => {}]);

/** @type {React.Context<AlertContext>} */
export const alertContext = createContext([
  null,
  (_) => {},
  /** @type {boolean} */ (false),
  (_) => {},
  /** @type {boolean} */ (false),
  (_) => {},
]);

/** @type {React.Context<GameStateContext>} */
export const gameStateContext = createContext([DEFAULT_GAME_STATE, (_) => {}]);
