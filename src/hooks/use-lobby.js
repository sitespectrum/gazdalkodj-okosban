import { SERVER_URL } from "@/lib/constants";
import { useEffect, useRef, useState } from "react";
import { useOnlinePlayer } from "./use-online-player";
import { useNavigate } from "react-router";

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
 * @returns {{lobby: Lobby, startGame: () => Promise<void>}}
 */
export function useLobby(gameID) {
  const { player } = useOnlinePlayer();
  const navigate = useNavigate();
  const [lobby, setLobby] = useState(/** @type {Lobby} */ (null));

  const ws = useRef(/** @type {WebSocket} */ (null));

  useEffect(() => {
    const playerJson = JSON.stringify(player);
    const encodedPlayer = encodeURIComponent(playerJson);
    ws.current = new WebSocket(
      `${SERVER_URL}/ws/lobby-${gameID}?playerData=${encodedPlayer}`
    );
    ws.current.onmessage = handleMessage;
    ws.current.onopen = () => {
      console.log("WebSocket is open");
    };
    ws.current.onclose = () => {
      console.log("WebSocket is closed");
    };

    return () => {
      ws.current.close();
    };
  }, []);

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
  }

  /**
   * @param {WebSocketMessage<{player: PublicPlayer, playerCount: number}>} message
   */
  async function playerJoinedReceiver(message) {
    setLobby((prev) => {
      return {
        ...prev,
        players: [
          ...prev.players.filter((p) => p.id !== message.data.player.id),
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
        players: prev.players.filter((p) => p.id !== message.data.player.id),
      };
    });
  }

  /**
   * @param {WebSocketMessage<{playerCount: number}>} message
   */
  async function gameStartedReceiver(message) {
    console.log("Game started", message);
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
      case "game-started":
        gameStartedReceiver(message);
        break;
    }
  }

  async function startGame() {
    ws.current.send(JSON.stringify({ type: "start-game" }));
  }

  return { lobby, startGame };
}
