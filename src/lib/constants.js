/** @typedef {import('@/lib/types').ShopItem} ShopItem */

/** @type {boolean} */
export const IS_MENU_OPEN = true;

/** @type {number} */
export const FIXED_DICE_ROLL = 21;

/** @type {boolean} */
export const INSTANT_DICE_ROLL = false;

/** @type {string} */
export const SERVER_URL = "http://localhost:42069";

/** @type {Record<string, ShopItem>} */
export const PURCHASEABLE_ITEMS = {
  house: {
    id: "house",
    name: "Ház",
    price: 25_000_000,
  },
  phone: {
    id: "phone",
    name: "Sumasang P25 Ultra Pro Max Slim 1TB",
    price: 1_000_000,
  },
  car: {
    id: "car",
    name: "Autó",
    price: 2_500_000,
    optional: true,
  },
  tv: {
    id: "tv",
    name: "Sumasang 4K TV",
    price: 119_990,
  },
  washingMachine: {
    id: "washingMachine",
    name: "GL előltöltős mosógép",
    price: 99_990,
  },
  dryer: {
    id: "dryer",
    name: "Boss előltöltős szárítógép",
    price: 129_990,
  },
  fridge: {
    id: "fridge",
    name: "Görénye alulfagyasztós hűtő",
    price: 84_990,
  },
  dishwasher: {
    id: "dishwasher",
    name: "Kendi mosogatógép",
    price: 109_990,
  },
  vacuumCleaner: {
    id: "vacuumCleaner",
    name: "Dájszon porszívó",
    price: 124_990,
  },
  kitchenFurniture: {
    id: "kitchenFurniture",
    name: "Konyhabútor",
    price: 549_990,
  },
  livingRoomFurniture: {
    id: "livingRoomFurniture",
    name: "Szobabútor",
    price: 999_990,
  },
  bathroomFurniture: {
    id: "bathroomFurniture",
    name: "Fürdőszobabútor",
    price: 349_990,
  },
};

/** @type {import('@/lib/types').GameState} */
export const DEFAULT_GAME_STATE = {
  isGameOver: false,
  winningPlayerIndex: -1,
  currentPlayer: 0,
  players: [
    {
      index: 0,
      name: "Játékos 1",
      image: "/src/Pictures/Puppets/Piros bábú 1.png",
      money: 100_000_000,
      position: 0,
      inventory: [],
      hasCar: false,
      hasCASCO: false,
      hasPhone: false,
      hasAccIns: false,
      hasHomeIns: false,
      inHospital: false,
      inJail: false,
      canRollDice: true,
      canEndTurn: false,
      state: "justStarted",
    },
    {
      index: 1,
      name: "Játékos 2",
      image: "/src/Pictures/Puppets/Kék bábú 1.png",
      money: 100_000_000,
      position: 0,
      inventory: [],
      hasCar: false,
      hasCASCO: false,
      hasPhone: false,
      hasAccIns: false,
      hasHomeIns: false,
      inHospital: false,
      inJail: false,
      canRollDice: true,
      canEndTurn: false,
      state: "justStarted",
    },
    {
      index: 2,
      name: "Játékos 3",
      image: "/src/Pictures/Puppets/Zöld bábú 1.png",
      money: 100_000_000,
      position: 0,
      inventory: [],
      hasCar: false,
      hasCASCO: false,
      hasPhone: false,
      hasAccIns: false,
      hasHomeIns: false,
      inHospital: false,
      inJail: false,
      canRollDice: true,
      canEndTurn: false,
      state: "justStarted",
    },
    {
      index: 3,
      name: "Játékos 4",
      image: "/src/Pictures/Puppets/Sárga bábú 1.png",
      money: 100_000_000,
      position: 0,
      inventory: [],
      hasCar: false,
      hasCASCO: false,
      hasPhone: false,
      hasAccIns: false,
      hasHomeIns: false,
      inHospital: false,
      inJail: false,
      canRollDice: true,
      canEndTurn: false,
      state: "justStarted",
    },
  ],
};
