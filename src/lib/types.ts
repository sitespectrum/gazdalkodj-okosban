export type Result<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: string;
    };

export interface GameManager extends GameManagerActions {
  meta: GameMeta;
  state: GameState;
  currentPlayer: Player;
  isMyTurn: boolean;
  isMyTurnRef: React.MutableRefObject<boolean>;
  connectionError?: string;
}

export interface GameManagerActions {
  updateMeta: CallbackStateAction<GameMeta>;
  updateState: CallbackStateAction<GameState>;
  updateCurrentPlayer: CallbackStateAction<Player>;

  closePopup: () => void;

  rollDice: (playerIndex: number) => Promise<void>;
  movePlayer: (playerIndex: number, steps: number) => Promise<void>;
  endTurn: (playerIndex: number) => Promise<void>;

  buyItem: (playerIndex: number, item: ShopItem) => Promise<void>;
  buyInsurance: (playerIndex: number, insurance: Insurance) => Promise<void>;
  buyTrainTicket: (playerIndex: number, stop: number) => Promise<void>;
  freeRideTrain: (playerIndex: number, stop: number) => Promise<void>;
  flipLuckyCard: (playerIndex: number) => Promise<void>;
  successfulBankRobbery: (playerIndex: number, money: number) => Promise<void>;
  failedBankRobbery: (playerIndex: number) => Promise<void>;
  placeBet: (playerIndex: number, bet: number) => Promise<void>;
  loseBet: (playerIndex: number) => Promise<void>;
  winBet: (playerIndex: number) => Promise<void>;
  refundBet: (playerIndex: number) => Promise<void>;
}

export interface GameContext {
  meta?: GameMeta;
  state?: GameState;
  actions?: GameManagerActions;
}

export interface GameData {
  meta?: GameMeta;
  state?: GameState;
}

export interface OnlineGameData {
  id: string;
  name: string;
  isPublic: boolean;
  maxPlayers: number;
  playerCount: number;
}

export interface GameDataContext {
  meta?: GameMeta;
  setMeta?: CallbackStateAction<GameMeta>;
  state?: GameState;
  setState?: CallbackStateAction<GameState>;
}

export interface GameMeta {
  id: string;
  name: string;
  lastPlayed: number;
}

export interface GameState {
  isGameOver: boolean;
  winningPlayerIndex: number;
  currentPlayer: number;
  players: Player[];
}

export interface Player {
  id?: string;
  index: number;
  name: string;
  image: string;
  money: number;
  position: number;
  inventory: string[];
  insurances: string[];
  inHospital: boolean;
  inJail: boolean;
  canRollDice: boolean;
  canEndTurn: boolean;
  state: "justStarted" | "rolledDice" | "actionStarted" | "actionEnded";
  rolledDice?: number;
  rollingDice?: boolean;
  luckyID?: string;
  luckyFlipped?: boolean;
  currentBet?: number;
}

export interface Field {
  id: number;
  name: string;
  x: number;
  y: number;
  isStop?: boolean;
  isActionInstant?: boolean;
  action?: (props: FieldActionProps) => any;
}

export interface FieldActionProps {
  currentPlayer: Player;
  updateCurrentPlayer: React.Dispatch<React.SetStateAction<Player>>;
  gameState: GameState;
  updateGameState: CallbackStateAction<GameState>;
  playerIndex: number;
  openPopup: (popupName: string, content: React.ReactNode) => void;
}

export interface LuckyCard {
  id: string;
  text: string;
  weight: number;
  condition?: (props: LuckyCardConditionProps) => boolean;
  action: (props: LuckyCardActionProps) => void;
}

export interface LuckyCardConditionProps {
  currentPlayer: Player;
  gameState: GameState;
  playerIndex: number;
}

export interface LuckyCardActionProps {
  currentPlayer: Player;
  updateCurrentPlayer: React.Dispatch<React.SetStateAction<Player>>;
  gameState: GameState;
  updateGameState: CallbackStateAction<GameState>;
  playerIndex: number;
  openPopup: (popupName: string, content: React.ReactNode) => void;
}

export interface ShopItem {
  id: string;
  name: string;
  price: number;
  optional?: boolean;
}

export interface Insurance {
  id: string;
  name: string;
  price: number;
  condition?: (props: InsuranceConditionProps) => boolean;
}

export interface InsuranceConditionProps {
  currentPlayer: Player;
  gameState: GameState;
  playerIndex: number;
}

export type CallbackState<T> = [T, CallbackStateAction<T>];

export type CallbackStateAction<T> = (
  newValueOrUpdater: T | ((prevState: T) => T),
  callback?: (newState: T) => void
) => void;

export interface WebSocketMessage<T = any> {
  type: string;
  data: T;
}

export interface OnlinePlayerData {
  id: string;
  key: string;
  name: string;
  image: string;
}
