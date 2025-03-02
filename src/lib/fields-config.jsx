//@ts-check
import React from "react";
import Elza from "../Components/Elza";
import BankRobbery from "../Components/BankRobbery";
import Lucky from "../Components/Lucky";

/** @type {import('./types').Field[]} */
export const FIELDS = [
  {
    id: 0,
    name: "Start",
    x: 88.9,
    y: 80,
    action: ({ updateGameState, playerIndex }) =>
      updateGameState((prevGameState) => {
        prevGameState.players[playerIndex].money += 170_000;
        return prevGameState;
      }),
  },

  {
    id: 1,
    name: "Mezo 1",
    x: 71.5,
    y: 80,
    action: ({ openPopup }) => openPopup("lucky", <Lucky />),
  },
  {
    id: 2,
    name: "Mezo 2",
    x: 64,
    y: 80,
    action: ({ updateGameState, playerIndex }) =>
      updateGameState((prevGameState) => {
        prevGameState.players[playerIndex].money -= 1500;
        return prevGameState;
      }),
  },
  {
    id: 3,
    name: "Mezo 3",
    x: 56.5,
    y: 80,
    action: ({ openPopup }) => openPopup("elza", <Elza />),
  },
  { id: 4, name: "Mezo 4", x: 48.9, y: 80, isStop: true },
  {
    id: 5,
    name: "Mezo 5",
    x: 41.3,
    y: 80,
    action: ({ openPopup }) => openPopup("bankrobbery", <BankRobbery />),
  },
  { id: 6, name: "Mezo 6", x: 33.9, y: 80 },
  {
    id: 7,
    name: "Mezo 7",
    x: 26.4,
    y: 80,
    action: ({ openPopup }) => openPopup("lucky", <Lucky />),
  },
  {
    id: 8,
    name: "Mezo 8",
    x: 18.9,
    y: 80,
    action: ({ updateGameState, playerIndex }) =>
      updateGameState((prevGameState) => {
        prevGameState.players[playerIndex].money -= 1500;
        return prevGameState;
      }),
  },

  { id: 9, name: "Mezo 9", x: 4, y: 88 },

  {
    id: 10,
    name: "Mezo 10",
    x: 8,
    y: 63,
    action: ({ updateGameState, playerIndex }) =>
      updateGameState((prevGameState) => {
        prevGameState.players[playerIndex].money -= 5000;
        return prevGameState;
      }),
  },
  { id: 11, name: "Mezo 11", x: 8, y: 45, isStop: true },
  { id: 12, name: "Mezo 12", x: 8, y: 28 },

  {
    id: 13,
    name: "Mezo 13",
    x: 8,
    y: 12,
    action: async (props) => {
      let newState = props.gameState;
      props.updateGameState((prevGameState) => {
        prevGameState.players[props.playerIndex].position += 4;
        newState = prevGameState;
        return prevGameState;
      });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      FIELDS[newState.players[props.playerIndex].position].action?.(props);
    },
  },

  { id: 14, name: "Mezo 14", x: 18.9, y: 12 },
  { id: 15, name: "Mezo 15", x: 26.4, y: 12 },
  {
    id: 16,
    name: "Mezo 16",
    x: 33.9,
    y: 12,
    action: async (props) => {
      if (props.currentPlayer.hasCar) {
        let newState = props.gameState;
        props.updateGameState((prevGameState) => {
          prevGameState.players[props.playerIndex].position += 10;
          newState = prevGameState;
          return prevGameState;
        });
        await new Promise((resolve) => setTimeout(resolve, 1000));
        FIELDS[newState.players[props.playerIndex].position].action?.(props);
      }
    },
  },
  {
    id: 17,
    name: "Mezo 17",
    x: 41.3,
    y: 12,
    action: ({ openPopup }) => openPopup("lucky", <Lucky />),
  },
  { id: 18, name: "Mezo 18", x: 48.9, y: 12, isStop: true },
  {
    id: 19,
    name: "Mezo 19",
    x: 56.5,
    y: 12,
    action: ({ updateGameState, playerIndex }) =>
      updateGameState((prevGameState) => {
        prevGameState.players[playerIndex].money -= 15_000;
        return prevGameState;
      }),
  },
  { id: 20, name: "Mezo 20", x: 64, y: 12 },
  { id: 21, name: "Mezo 21", x: 71.5, y: 12 },
  {
    id: 22,
    name: "Mezo 22",
    x: 79.2,
    y: 12,
    action: ({ updateGameState, playerIndex }) =>
      updateGameState((prevGameState) => {
        prevGameState.players[playerIndex].money -= 10_000;
        return prevGameState;
      }),
  },
  {
    id: 23,
    name: "Mezo 23",
    x: 88.9,
    y: 12,
    action: ({ updateGameState, playerIndex }) => {
      updateGameState((prevGameState) => {
        prevGameState.players[playerIndex].inHospital = "arrived";
        prevGameState.players[playerIndex].canRollDice = false;
        return prevGameState;
      });
    },
  },
  { id: 24, name: "Mezo 24", x: 88.9, y: 28 },
  { id: 25, name: "Mezo 25", x: 88.9, y: 45, isStop: true },
  {
    id: 26,
    name: "Mezo 26",
    x: 88.9,
    y: 64,
    action: ({ updateGameState, playerIndex }) =>
      updateGameState((prevGameState) => {
        prevGameState.players[playerIndex].canRollDice = true;
        return prevGameState;
      }),
  },

  { id: 27, name: "Börtön", x: 10, y: 80 },
];
