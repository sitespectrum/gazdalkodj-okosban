namespace server;

using System.Net.WebSockets;
using System.Text;
using Newtonsoft.Json;

public static class Messages {
    public static async Task SendMessage(WebSocket ws, WebSocketMessage<dynamic> message) {
        await ws.SendAsync(
            new ArraySegment<byte>(
                Encoding.UTF8.GetBytes(
                    JsonConvert.SerializeObject(message))),
            WebSocketMessageType.Text,
            true,
            CancellationToken.None
        );
    }

    public static void BroadcastMessage(WebSocketMessage<dynamic> message) {
        foreach (var connection in GlobalData.Connections) {
            _ = SendMessage(connection, message);
        }
    }

    public static async Task HandleMessage(WebSocket ws, byte[] messageBytes) {
        var messageString = Encoding.UTF8.GetString(messageBytes);

        Console.WriteLine(Encoding.UTF8.GetString(messageBytes));
        WebSocketMessage<dynamic>? message;
        try {
            message = JsonConvert.DeserializeObject<WebSocketMessage<dynamic>>(messageString);
        } catch (Exception e) {
            var errorMessage = new WebSocketMessage<object> {
                Type = "error",
                Data = new {
                    message = $"Invalid JSON: {e.Message}"
                }
            };
            await SendMessage(ws, errorMessage);
            return;
        }

        if (message == null) {
            var errorMessage = new WebSocketMessage<object> {
                Type = "error",
                Data = new {
                    message = "Invalid message format"
                }
            };
            await SendMessage(ws, errorMessage);
            return;
        }

        switch (message.Type) {
            case "roll-dice":
                await RollDice(ws, message);
                break;
            case "move-player":
                await MovePlayer(ws, message);
                break;
            default:
                await UnknownMessage(ws, message);
                break;
        }
    }

    public static async Task UnknownMessage(WebSocket ws, WebSocketMessage<dynamic> message) {
        Console.WriteLine($"Unknown message type: {message.Type}");
        var errorMessage = new WebSocketMessage<object> {
            Type = "error",
            Data = new {
                message = $"Unknown message type '{message.Type}'"
            }
        };
        await SendMessage(ws, errorMessage);
    }

    public static async Task RollDice(WebSocket ws, WebSocketMessage<dynamic> message) {
        Console.WriteLine("roll-dice message received");

        int? playerIndex;
        try {
            playerIndex = (int?)message.Data.playerIndex;
        } catch {
            playerIndex = null;
        }

        if (playerIndex == null) {
            var errorMessage = new WebSocketMessage<object> {
                Type = "error",
                Data = new {
                    message = "Invalid or missing playerIndex"
                }
            };
            await SendMessage(ws, errorMessage);
            return;
        }

        Console.WriteLine($"playerIndex: {playerIndex}");

        BroadcastMessage(new WebSocketMessage<object> {
            Type = "roll-dice-started",
            Data = new {
                playerIndex
            }
        });

        var result = new Random().Next(1, 7);
        var responseMessage = new WebSocketMessage<object> {
            Type = "roll-dice-result",
            Data = new {
                playerIndex,
                result
            }
        };
        BroadcastMessage(responseMessage);
    }

    public static async Task MovePlayer(WebSocket ws, WebSocketMessage<dynamic> message) {
        Console.WriteLine("move-player message received");

        int? playerIndex;
        try {
            playerIndex = (int?)message.Data.playerIndex;
        } catch {
            playerIndex = null;
        }

        if (playerIndex == null) {
            var errorMessage = new WebSocketMessage<object> {
                Type = "error",
                Data = new {
                    message = "Invalid or missing playerIndex"
                }
            };
            await SendMessage(ws, errorMessage);
            return;
        }

        int? steps;
        try {
            steps = (int?)message.Data.steps;
        } catch {
            steps = null;
        }

        if (steps == null) {
            var errorMessage = new WebSocketMessage<object> {
                Type = "error",
                Data = new {
                    message = "Invalid or missing steps"
                }
            };
            await SendMessage(ws, errorMessage);
            return;
        }

        Console.WriteLine($"playerIndex: {playerIndex}, steps: {steps}");

        var responseMessage = new WebSocketMessage<object> {
            Type = "move-player-result",
            Data = new {
                playerIndex,
                steps
            }
        };
        BroadcastMessage(responseMessage);
    }
}
