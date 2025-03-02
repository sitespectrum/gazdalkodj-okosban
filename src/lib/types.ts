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
  inHospital: "no" | "arrived" | "healed";
  inJail: boolean;
  canRollDice: boolean;
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
  updateGameState: React.Dispatch<React.SetStateAction<GameState>>;
  playerIndex: number;
  openPopup: (popupName: string, content: React.ReactNode) => void;
}
