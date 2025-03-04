//@ts-check
import React from "react";
import Elza from "../Components/Elza";
import BankRobbery from "../Components/BankRobbery";
import Lucky from "../Components/Lucky";
import ElzaAndIdea from "../Components/ElzaAndIdea";
import Bobthebuilder from "../Components/Bobthebuilder";

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
        return {
          ...prevGameState,
        };
      }),
  },

  {
    id: 1,
    name: "Lucky 1",
    x: 71.5,
    y: 80,
    action: ({ openPopup }) => openPopup("lucky", <Lucky />),
  },
  {
    id: 2,
    name: "Trash",
    x: 64,
    y: 80,
    action: ({ updateGameState, playerIndex }) =>
      updateGameState((prevGameState) => {
        prevGameState.players[playerIndex].money -= 1500;
        return {
          ...prevGameState,
        };
      }),
  },
  {
    id: 3,
    name: "Elza",
    x: 56.5,
    y: 80,
    action: ({ openPopup }) => openPopup("elza", <Elza />),
  },
  { id: 4, name: "South Station", x: 48.9, y: 80, isStop: true },
  {
    id: 5,
    name: "Bank Robbery",
    x: 41.3,
    y: 80,
    action: ({ openPopup }) => openPopup("bankrobbery", <BankRobbery />),
  },
  {
    id: 6,
    name: "Elza and Idea",
    x: 33.9,
    y: 80,
    action: ({ openPopup }) => openPopup("elzaandidea", <ElzaAndIdea />),
  },
  {
    id: 7,
    name: "Lucky 2",
    x: 26.4,
    y: 80,
    action: ({ openPopup }) => openPopup("lucky", <Lucky />),
  },
  {
    id: 8,
    name: "Smoking",
    x: 18.9,
    y: 80,
    action: ({ updateGameState, playerIndex }) =>
      updateGameState((prevGameState) => {
        prevGameState.players[playerIndex].money -= 1500;
        return {
          ...prevGameState,
        };
      }),
  },

  { id: 9, name: "Jail (visiting)", x: 1.25, y: 91.5 },

  {
    id: 10,
    name: "Movie Theater",
    x: 8,
    y: 63,
    action: ({ updateGameState, playerIndex }) =>
      updateGameState((prevGameState) => {
        prevGameState.players[playerIndex].money -= 5000;
        return {
          ...prevGameState,
        };
      }),
  },
  { id: 11, name: "West Station", x: 8, y: 45, isStop: true },
  { id: 12, name: "Casino", x: 8, y: 28 },

  {
    id: 13,
    name: "Airport",
    x: 8,
    y: 12,
    action: async (props) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      props.updateGameState(
        (prevGameState) => {
          console.log("prevGameState", prevGameState);
          prevGameState.players[props.playerIndex].position += 4;
          console.log("prevGameState", prevGameState);
          return {
            ...prevGameState,
          };
        },
        (newGameState) => {
          FIELDS[newGameState.players[props.playerIndex].position].action?.(
            props
          );
        }
      );
    },
  },

  {
    id: 14,
    name: "Bob the Builder",
    x: 18.9,
    y: 12,
    action: ({ openPopup }) => openPopup("bobthebuilder", <Bobthebuilder />),
  },
  { id: 15, name: "Car Shop", x: 26.4, y: 12 },
  {
    id: 16,
    name: "Car travel",
    x: 33.9,
    y: 12,
    action: async (props) => {
      if (props.currentPlayer.hasCar) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        props.updateGameState(
          (prevGameState) => {
            prevGameState.players[props.playerIndex].position += 10;
            return {
              ...prevGameState,
            };
          },
          (newGameState) => {
            FIELDS[newGameState.players[props.playerIndex].position].action?.(
              props
            );
          }
        );
      }
    },
  },
  {
    id: 17,
    name: "Lucky 3",
    x: 41.3,
    y: 12,
    action: ({ openPopup }) => openPopup("lucky", <Lucky />),
  },
  { id: 18, name: "North Station", x: 48.9, y: 12, isStop: true },
  {
    id: 19,
    name: "Abidas",
    x: 56.5,
    y: 12,
    action: ({ updateGameState, playerIndex }) =>
      updateGameState((prevGameState) => {
        prevGameState.players[playerIndex].money -= 15_000;
        return {
          ...prevGameState,
        };
      }),
  },
  { id: 20, name: "Idea", x: 64, y: 12 },
  { id: 21, name: "Bank 4", x: 71.5, y: 12 },
  {
    id: 22,
    name: "ABC",
    x: 79.2,
    y: 12,
    action: ({ updateGameState, playerIndex }) =>
      updateGameState((prevGameState) => {
        prevGameState.players[playerIndex].money -= 10_000;
        return {
          ...prevGameState,
        };
      }),
  },
  {
    id: 23,
    name: "Hospital",
    x: 88.9,
    y: 12,
    action: ({ updateGameState, playerIndex }) => {
      updateGameState((prevGameState) => {
        prevGameState.players[playerIndex].inHospital = "arrived";
        prevGameState.players[playerIndex].canRollDice = false;
        return {
          ...prevGameState,
        };
      });
    },
  },
  { id: 24, name: "Insurance", x: 88.9, y: 28 },
  { id: 25, name: "East Station", x: 88.9, y: 45, isStop: true },
  {
    id: 26,
    name: "Roll again",
    x: 88.9,
    y: 64,
    action: ({ updateGameState, playerIndex }) =>
      updateGameState((prevGameState) => {
        prevGameState.players[playerIndex].canRollDice = true;
        return {
          ...prevGameState,
        };
      }),
  },

  { id: 27, name: "Jail (locked up)", x: 10, y: 80 },
];
