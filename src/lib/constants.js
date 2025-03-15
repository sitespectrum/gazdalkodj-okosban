/** @typedef {import('@/lib/types').ShopItem} ShopItem */
/** @typedef {import('@/lib/types').LuckyCard} LuckyCard */
/** @typedef {import('@/lib/types').Insurance} Insurance */

/** @type {boolean} */
export const IS_MENU_OPEN = true;

/** @type {number} */
export const FIXED_DICE_ROLL = 24;

/** @type {boolean} */
export const INSTANT_DICE_ROLL = false;

/** @type {string} */
export const SERVER_URL =
  //@ts-ignore
  import.meta.env.VITE_SERVER_URL || "http://localhost:42069";

/** @type {Record<string, ShopItem>} */
export const PURCHASEABLE_ITEMS = {
  house: {
    id: "house",
    name: "Ház",
    price: 25_000_000,
  },
  car: {
    id: "car",
    name: "Autó",
    price: 1_000_000,
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

/** @type {LuckyCard[]} */
export const LUCKY_CARDS = [
  {
    id: "tipszmix",
    text: "Tipszmixen 100 000 forintot nyertél.",
    weight: 150,
    action: ({ currentPlayer, updateCurrentPlayer }) =>
      updateCurrentPlayer({
        ...currentPlayer,
        money: currentPlayer.money + 100_000,
      }),
  },
  {
    id: "etterem",
    text: "Étteremben ebédeltél, fizess 20 000 Ft-ot.",
    weight: 150,
    action: ({ currentPlayer, updateCurrentPlayer }) =>
      updateCurrentPlayer({
        ...currentPlayer,
        money: currentPlayer.money - 20_000,
      }),
  },
  {
    id: "foci",
    text: "Szeretsz focizni, ezért meglepted magad egy 20 000 Ft értékű Pumba cipővel.",
    weight: 150,
    action: ({ currentPlayer, updateCurrentPlayer }) =>
      updateCurrentPlayer({
        ...currentPlayer,
        money: currentPlayer.money - 20_000,
      }),
  },
  {
    id: "tulora",
    text: "Munkahelyeden túlóráztál, ezért kapsz 60 000 forintot.",
    weight: 150,
    action: ({ currentPlayer, updateCurrentPlayer }) =>
      updateCurrentPlayer({
        ...currentPlayer,
        money: currentPlayer.money + 60_000,
      }),
  },
  {
    id: "scam",
    text: "Egy kétes megbízhatóságú weboldalon ingyen Sumasang P25 Ultrákat osztottak, neked csak meg kellett adnod a kártyaadataidat. Ellopták az összes pénzed.",
    weight: 10,
    action: ({ currentPlayer, updateCurrentPlayer }) =>
      updateCurrentPlayer({ ...currentPlayer, money: 0 }),
  },
  {
    id: "car-accident",
    text: "Összetörted az autód. Ha nincs rá biztosításod, fizess 200 000 Ft-ot.",
    weight: 150,
    condition: (props) => props.currentPlayer.inventory.includes("car"),
    action: ({ currentPlayer, updateCurrentPlayer }) => {
      if (!currentPlayer.insurances.includes("casco")) {
        updateCurrentPlayer({
          ...currentPlayer,
          money: currentPlayer.money - 200_000,
        });
      }
    },
  },
  {
    id: "accident",
    text: "Balesetet szenvedtél. Ha nincs rá biztosításod, fizess a 50 000 Ft-ot.",
    weight: 150,
    action: ({ currentPlayer, updateCurrentPlayer }) => {
      if (!currentPlayer.insurances.includes("accident")) {
        updateCurrentPlayer({
          ...currentPlayer,
          money: currentPlayer.money - 50_000,
        });
      }
    },
  },
  {
    id: "house-fire",
    text: "Kigyulladt a házad. Ha nincs rá biztosításod, fizess a 500 000 Ft-ot.",
    weight: 40,
    condition: (props) => props.currentPlayer.inventory.includes("house"),
    action: ({ currentPlayer, updateCurrentPlayer }) => {
      if (!currentPlayer.insurances.includes("home")) {
        updateCurrentPlayer({
          ...currentPlayer,
          money: currentPlayer.money - 500_000,
        });
      }
    },
  },
  {
    id: "lottery",
    text: "Vettél munkába menet egy kaparós sorsjegyet 5000 Forintért. ÉS MILYEN JÓL TETTED! LEKAPARTAD A FŐDÍJAT, AMI 25 000 000 FT!",
    weight: 10,
    action: ({ currentPlayer, updateCurrentPlayer }) =>
      updateCurrentPlayer({
        ...currentPlayer,
        money: currentPlayer.money + 25_000_000,
      }),
  },
  {
    id: "tax",
    text: "Adóztál.",
    weight: 40,
    action: ({ currentPlayer, updateCurrentPlayer }) =>
      updateCurrentPlayer({
        ...currentPlayer,
        money: currentPlayer.money * 0.45,
      }),
  },
];

/** @type {Insurance[]} */
export const INSURANCES = [
  {
    id: "casco",
    name: "CASCO",
    price: 120_000,
    condition: (props) => props.currentPlayer.inventory.includes("car"),
  },
  {
    id: "accident",
    name: "Balesetbiztosítás",
    price: 100_000,
  },
  {
    id: "home",
    name: "Lakásbiztosítás",
    price: 1_000_000,
  },
];

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
      money: 400_000,
      position: 0,
      inventory: [],
      insurances: [],
      inHospital: false,
      inJail: false,
      canRollDice: true,
      canEndTurn: false,
      state: "justStarted",
      luckyID: null,
      luckyFlipped: false,
    },
    {
      index: 1,
      name: "Játékos 2",
      image: "/src/Pictures/Puppets/Kék bábú 1.png",
      money: 400_000,
      position: 0,
      inventory: [],
      insurances: [],
      inHospital: false,
      inJail: false,
      canRollDice: true,
      canEndTurn: false,
      state: "justStarted",
      luckyID: null,
      luckyFlipped: false,
    },
    {
      index: 2,
      name: "Játékos 3",
      image: "/src/Pictures/Puppets/Zöld bábú 1.png",
      money: 400_000,
      position: 0,
      inventory: [],
      insurances: [],
      inHospital: false,
      inJail: false,
      canRollDice: true,
      canEndTurn: false,
      state: "justStarted",
      luckyID: null,
      luckyFlipped: false,
    },
    {
      index: 3,
      name: "Játékos 4",
      image: "/src/Pictures/Puppets/Sárga bábú 1.png",
      money: 400_000,
      position: 0,
      inventory: [],
      insurances: [],
      inHospital: false,
      inJail: false,
      canRollDice: true,
      canEndTurn: false,
      state: "justStarted",
      luckyID: null,
      luckyFlipped: false,
    },
  ],
};

/** @type {{ id: string; image: string; name: string; }[]} */
export const DEFAULT_PLAYER_IMAGES = [
  {
    id: "red",
    image: "/src/Pictures/Puppets/Piros bábú 1.png",
    name: "Piros bábú",
  },
  {
    id: "blue",
    image: "/src/Pictures/Puppets/Kék bábú 1.png",
    name: "Kék bábú",
  },
  {
    id: "green",
    image: "/src/Pictures/Puppets/Zöld bábú 1.png",
    name: "Zöld bábú",
  },
  {
    id: "yellow",
    image: "/src/Pictures/Puppets/Sárga bábú 1.png",
    name: "Sárga bábú",
  },
];
