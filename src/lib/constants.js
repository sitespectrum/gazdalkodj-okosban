//@ts-check

/** @type {boolean} */
export const IS_MENU_OPEN = true;

/** @type {number} */
export const FIXED_DICE_ROLL = 0;

/** @type {boolean} */
export const INSTANT_DICE_ROLL = false;

/** @type {string[]} */
export const PURCHASEABLE_ITEMS = [
  "Ház",
  "Sumasang 4K TV",
  "GL előltöltős mosógép",
  "Boss előltöltős szárítógép",
  "Görénye alulfagyasztós hűtő",
  "Kendi mosogatógép",
  "Dájszon porszívó",
  "Konyhabútor",
  "Szobabútor",
  "Fürdőszobabútor",
];

/** @type {import('./types').GameState} */
export const DEFAULT_GAME_STATE = {
  isGameOver: false,
  currentPlayer: 0,
  players: [
    {
      name: "Játékos 1",
      image: "./src/Pictures/Puppets/Piros bábú 1.png",
      money: 400_000,
      position: 0,
      inventory: [],
      hasCar: false,
      hasCASCO: false,
      hasAccIns: false,
      hasHomeIns: false,
      inHospital: false,
      inJail: false,
      canRollDice: true,
      state: "justStarted",
    },
    {
      name: "Játékos 2",
      image: "./src/Pictures/Puppets/Kék bábú 1.png",
      money: 400_000,
      position: 0,
      inventory: [],
      hasCar: false,
      hasCASCO: false,
      hasAccIns: false,
      hasHomeIns: false,
      inHospital: false,
      inJail: false,
      canRollDice: true,
      state: "justStarted",
    },
    {
      name: "Játékos 3",
      image: "./src/Pictures/Puppets/Zöld bábú 1.png",
      money: 400_000,
      position: 0,
      inventory: [],
      hasCar: false,
      hasCASCO: false,
      hasAccIns: false,
      hasHomeIns: false,
      inHospital: false,
      inJail: false,
      canRollDice: true,
      state: "justStarted",
    },
    {
      name: "Játékos 4",
      image: "./src/Pictures/Puppets/Sárga bábú 1.png",
      money: 400_000,
      position: 0,
      inventory: [],
      hasCar: false,
      hasCASCO: false,
      hasAccIns: false,
      hasHomeIns: false,
      inHospital: false,
      inJail: false,
      canRollDice: true,
      state: "justStarted",
    },
  ],
};
