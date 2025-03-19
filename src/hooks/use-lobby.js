import { DEFAULT_PLAYER_IMAGES, SERVER_URL } from "@/lib/constants";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useOnlinePlayer } from "./use-online-player";

/** @typedef {import("@/lib/types").GameState} GameState */
/** @typedef {{id: string, name: string, image: string, isHost: boolean}} PublicPlayer */
/**
 * @typedef {{id: string, name: string, isPublic: boolean, maxPlayers: number, players: PublicPlayer[]}} Lobby
 */
/**
 * @template [T=any]
 * @typedef {import("@/lib/types").WebSocketMessage<T>} WebSocketMessage
 */

/**
 * @param {string} gameID
 * @returns {{lobby: Lobby, startGame: () => Promise<void>, updatePlayer: (player: PublicPlayer) => Promise<void>, isNotFound: boolean, isFull: boolean, loading: boolean, fading: boolean}}
 */
export function useLobby(gameID) {
  const { player } = useOnlinePlayer();
  const navigate = useNavigate();

  const [lobby, setLobby] = useState(/** @type {Lobby} */ (null));
  const [isNotFound, setIsNotFound] = useState(false);
  const [isFull, setIsFull] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fading, setFading] = useState(false);

  const ws = useRef(/** @type {WebSocket} */ (null));

  useEffect(() => {
    if (!player) return;
    const playerJson = JSON.stringify(player);
    const encodedPlayer = encodeURIComponent(playerJson);
    ws.current = new WebSocket(
      `${SERVER_URL}/ws/lobby-${gameID}?playerData=${encodedPlayer}`
    );
    ws.current.onmessage = handleMessage;
    ws.current.onopen = () => {
      console.log("WebSocket is open");
    };
    ws.current.onclose = (e) => {
      console.log("WebSocket is closed", e);
      if (e.reason === "lobby-not-found") {
        setIsNotFound(true);
      }
      if (e.reason === "lobby-full") {
        setIsFull(true);
      }
    };

    return () => {
      ws.current.close();
    };
  }, [player?.id]);

  /**
   * @param {WebSocketMessage<Lobby>} message
   */
  async function syncLobbyStateReceiver(message) {
    setLobby((prev) => {
      return {
        ...prev,
        ...message.data,
      };
    });
    setLoading(false);
  }

  /**
   * @param {WebSocketMessage<{player: PublicPlayer, playerCount: number}>} message
   */
  async function playerJoinedReceiver(message) {
    setLobby((prev) => {
      return {
        ...prev,
        players: [
          ...(prev.players ?? []).filter(
            (p) => p.id !== message.data.player.id
          ),
          message.data.player,
        ],
      };
    });
  }

  /**
   * @param {WebSocketMessage<{player: PublicPlayer, playerCount: number}>} message
   */
  async function playerLeftReceiver(message) {
    setLobby((prev) => {
      return {
        ...prev,
        players: (prev.players ?? []).filter(
          (p) => p.id !== message.data.player.id
        ),
      };
    });
  }

  /**
   * @param {PublicPlayer} player
   */
  async function playerUpdatedCaller(player) {
    if (ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(
        JSON.stringify({
          type: "update-player",
          data: {
            ...player,
            id: player?.id,
          },
        })
      );
    }
  }

  /**
   * @param {WebSocketMessage<PublicPlayer>} message
   */
  async function playerUpdatedReceiver(message) {
    setLobby((prev) => {
      return {
        ...prev,
        players: (prev.players ?? []).map((p) =>
          p?.id === message.data?.id ? message.data : p
        ),
      };
    });
  }

  /**
   * @param {WebSocketMessage<{playerCount: number}>} message
   */
  async function gameStartedReceiver(message) {
    console.log("Game started", message);
    setFading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    navigate(`/online-game/${gameID}`);
  }

  /**
   * @param {MessageEvent} wsMessage
   */
  function handleMessage(wsMessage) {
    const message = JSON.parse(wsMessage.data);
    console.log("message", message);

    switch (message.type) {
      case "sync-lobby-state":
        syncLobbyStateReceiver(message);
        break;
      case "player-joined":
        playerJoinedReceiver(message);
        break;
      case "player-left":
        playerLeftReceiver(message);
        break;
      case "player-updated":
        playerUpdatedReceiver(message);
        break;
      case "game-started":
        gameStartedReceiver(message);
        break;
    }
  }

  async function startGame() {
    ws.current.send(JSON.stringify({ type: "start-game" }));
  }

  return {
    lobby,
    startGame,
    updatePlayer: playerUpdatedCaller,
    isNotFound,
    isFull,
    loading,
    fading,
  };
}
