export interface GameState {
  isGameOver: boolean;
  currentPlayer: number;
  players: Player[];
}

export interface Player {
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
  state: "justStarted" | "rolledDice" | "actionClosed";
}

export interface Field {
  id: number;
  name: string;
  x: number;
  y: number;
  isStop?: boolean;
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

export type CallbackState<T> = [T, CallbackStateAction<T>];

export type CallbackStateAction<T> = (
  newValueOrUpdater: T | ((prevState: T) => T),
  callback?: (newState: T) => void
) => void;
