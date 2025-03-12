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
  buyTrainTicket: (playerIndex: number, stop: number) => Promise<void>;
  freeRideTrain: (playerIndex: number, stop: number) => Promise<void>;
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
  hasCar: boolean;
  hasCASCO: boolean;
  hasAccIns: boolean;
  hasHomeIns: boolean;
  inHospital: boolean;
  inJail: boolean;
  canRollDice: boolean;
  canEndTurn: boolean;
  state: "justStarted" | "rolledDice" | "actionStarted" | "actionEnded";
  rolledDice?: number;
  rollingDice?: boolean;
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
  id: number;
  text: string;
  action: () => void;
}

export interface ShopItem {
  id: string;
  name: string;
  price: number;
  optional?: boolean;
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
  name: string;
  image: string;
}
