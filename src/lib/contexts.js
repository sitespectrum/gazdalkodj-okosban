import { createContext } from "react";

/** @typedef {import("@/lib/types").GameState} GameState */
/** @typedef {[string, React.Dispatch<React.SetStateAction<string>>, any, React.Dispatch<React.SetStateAction<any>>, boolean, React.Dispatch<React.SetStateAction<boolean>>]} PopupContext */
/** @typedef {[any, React.Dispatch<React.SetStateAction<any>>, boolean, React.Dispatch<React.SetStateAction<boolean>>, boolean, React.Dispatch<React.SetStateAction<boolean>>, boolean, React.Dispatch<React.SetStateAction<boolean>>]} AlertContext */
/** @typedef {import("@/lib/types").GameManager} GameManager */
/** @typedef {import("@/lib/types").GameDataContext} GameDataContext */

/** @type {React.Context<PopupContext>} */
export const popupContext = createContext([
  "",
  (_) => {},
  null,
  (_) => {},
  /** @type {boolean} */ (false),
  (_) => {},
]);

/** @type {React.Context<AlertContext>} */
export const alertContext = createContext([
  null,
  (_) => {},
  /** @type {boolean} */ (false),
  (_) => {},
  /** @type {boolean} */ (false),
  (_) => {},
  /** @type {boolean} */ (false),
  (_) => {},
]);

/** @type {React.Context<GameDataContext>} */
export const gameDataContext = createContext({});

/** @type {React.Context<GameManager | null>} */
export const gameContext = createContext(null);
