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
            case "end-action":
                await EndAction(ws, message);
                break;
            case "end-turn":
                await EndTurn(ws, message);
                break;
            case "buy-item":
                await BuyItem(ws, message);
                break;
            case "buy-train-ticket":
                await BuyTrainTicket(ws, message);
                break;
            case "free-ride-train":
                await FreeRideTrain(ws, message);
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

    public static async Task SyncGameState(WebSocket ws) {
        var responseMessage = new WebSocketMessage<object> {
            Type = "sync-game-state",
            Data = GlobalData.GameState
        };
        await SendMessage(ws, responseMessage);
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

        if (GlobalData.GameState.CurrentPlayer != playerIndex) {
            var errorMessage = new WebSocketMessage<object> {
                Type = "error",
                Data = new {
                    message = "It's not your turn"
                }
            };
            await SendMessage(ws, errorMessage);
            return;
        }

        if (!GlobalData.GameState.Players[playerIndex ?? 0].CanRollDice) {
            var errorMessage = new WebSocketMessage<object> {
                Type = "error",
                Data = new {
                    message = "You can't roll the dice right now"
                }
            };
            await SendMessage(ws, errorMessage);
            return;
        }

        BroadcastMessage(new WebSocketMessage<object> {
            Type = "roll-dice-started",
            Data = new {
                playerIndex
            }
        });

        var result = new Random().Next(1, 7);
        if (GlobalData.GameState.Players[playerIndex ?? 0].RolledDice == null) {
            GlobalData.GameState.Players[playerIndex ?? 0].RolledDice = result;
        } else {
            result = GlobalData.GameState.Players[playerIndex ?? 0].RolledDice ?? 0;
        }

        GlobalData.GameState.Players[playerIndex ?? 0].RollingDice = false;
        GlobalData.GameState.Players[playerIndex ?? 0].CanRollDice = false;
        GlobalData.GameState.Players[playerIndex ?? 0].CanEndTurn = true;
        GlobalData.GameState.Players[playerIndex ?? 0].State = "rolledDice";


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

        if (playerIndex != GlobalData.GameState.CurrentPlayer) {
            var errorMessage = new WebSocketMessage<object> {
                Type = "error",
                Data = new {
                    message = "It's not your turn"
                }
            };
            await SendMessage(ws, errorMessage);
            return;
        }

        if (steps != GlobalData.GameState.Players[playerIndex ?? 0].RolledDice) {
            var errorMessage = new WebSocketMessage<object> {
                Type = "error",
                Data = new {
                    message = "You rolled a different number than the dice"
                }
            };
            await SendMessage(ws, errorMessage);
            return;
        }

        if (GlobalData.GameState.Players[playerIndex ?? 0].InHospital) {
            var errorMessage = new WebSocketMessage<object> {
                Type = "error",
                Data = new {
                    message = "You can't move right now"
                }
            };
            await SendMessage(ws, errorMessage);
            return;
        }

        if (GlobalData.GameState.Players[playerIndex ?? 0].InJail && steps != 6) {
            GlobalData.GameState.Players[playerIndex ?? 0].CanRollDice = false;
            GlobalData.GameState.Players[playerIndex ?? 0].State = "rolledDice";

            BroadcastMessage(new WebSocketMessage<object> {
                Type = "move-player-result",
                Data = new {
                    playerIndex,
                    steps
                }
            });
            return;
        }

        var isStartingGame =
            GlobalData.GameState.Players[playerIndex ?? 0].Position == 0 &&
            GlobalData.GameState.Players[playerIndex ?? 0].Money == 400_000 &&
            GlobalData.GameState.Players[playerIndex ?? 0].Inventory.Length == 0;

        var oldPlayerPosition = GlobalData.GameState.Players[playerIndex ?? 0].Position;
        var oldPlayerHasHouse = GlobalData.GameState.Players[playerIndex ?? 0].Inventory.Contains("house");
        var oldPlayerInJail = GlobalData.GameState.Players[playerIndex ?? 0].InJail;

        GlobalData.GameState.Players[playerIndex ?? 0].CanRollDice = false;
        if (oldPlayerInJail) {
            GlobalData.GameState.Players[playerIndex ?? 0].InJail = false;
            GlobalData.GameState.Players[playerIndex ?? 0].Position = 9 + steps ?? 0;
            return;
        } else {
            GlobalData.GameState.Players[playerIndex ?? 0].Position =
                (GlobalData.GameState.Players[playerIndex ?? 0].Position + steps ?? 0) % 27;
            GlobalData.GameState.Players[playerIndex ?? 0].CanEndTurn = false;
            GlobalData.GameState.Players[playerIndex ?? 0].State = "rolledDice";
        }

        var newField = GlobalData.FIELDS[GlobalData.GameState.Players[playerIndex ?? 0].Position];

        var crossedStart =
            oldPlayerPosition > GlobalData.GameState.Players[playerIndex ?? 0].Position &&
            GlobalData.GameState.Players[playerIndex ?? 0].Position != 0 &&
            !oldPlayerInJail;

        if (crossedStart && newField.ID != 0) {
            GlobalData.GameState.Players[playerIndex ?? 0].Money += 150_000;
        }

        if (
            (crossedStart || oldPlayerPosition == 0) &&
            !oldPlayerHasHouse &&
            !isStartingGame
        ) {
            GlobalData.GameState.Players[playerIndex ?? 0].Money -= 70_000;
        }

        GlobalData.GameState.Players[playerIndex ?? 0].CanEndTurn = true;
        GlobalData.GameState.Players[playerIndex ?? 0].State = newField.IsActionInstant
            ? "actionEnded"
            : "actionStarted";

        newField.Action?.Invoke(GlobalData.GameState);

        var responseMessage = new WebSocketMessage<object> {
            Type = "move-player-result",
            Data = new {
                playerIndex,
                steps
            }
        };
        BroadcastMessage(responseMessage);
    }

    public static async Task EndAction(WebSocket ws, WebSocketMessage<dynamic> message) {
        Console.WriteLine("end-action message received");

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

        if (GlobalData.GameState.CurrentPlayer != playerIndex) {
            var errorMessage = new WebSocketMessage<object> {
                Type = "error",
                Data = new {
                    message = "It's not your turn"
                }
            };
            await SendMessage(ws, errorMessage);
            return;
        }

        GlobalData.GameState.Players[playerIndex ?? 0].State = "actionEnded";

        var responseMessage = new WebSocketMessage<object> {
            Type = "action-ended",
            Data = new {
                playerIndex
            }
        };
        BroadcastMessage(responseMessage);
    }

    public static async Task EndTurn(WebSocket ws, WebSocketMessage<dynamic> message) {
        Console.WriteLine("end-turn message received");

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

        if (GlobalData.GameState.CurrentPlayer != playerIndex) {
            var errorMessage = new WebSocketMessage<object> {
                Type = "error",
                Data = new {
                    message = "It's not your turn"
                }
            };
            await SendMessage(ws, errorMessage);
            return;
        }

        if (!GlobalData.GameState.Players[playerIndex ?? 0].CanEndTurn) {
            var errorMessage = new WebSocketMessage<object> {
                Type = "error",
                Data = new {
                    message = "You can't end your turn right now"
                }
            };
            await SendMessage(ws, errorMessage);
            return;
        }

        var newPlayerIndex = (playerIndex + 1) % GlobalData.GameState.Players.Length;

        GlobalData.GameState.Players[newPlayerIndex ?? 0].State = "justStarted";
        GlobalData.GameState.Players[newPlayerIndex ?? 0].CanRollDice = true;
        GlobalData.GameState.Players[newPlayerIndex ?? 0].CanEndTurn = false;
        GlobalData.GameState.Players[newPlayerIndex ?? 0].RollingDice = false;
        GlobalData.GameState.Players[newPlayerIndex ?? 0].RolledDice = null;

        if (GlobalData.GameState.Players[newPlayerIndex ?? 0].InHospital) {
            GlobalData.GameState.Players[newPlayerIndex ?? 0].CanRollDice = false;
            GlobalData.GameState.Players[newPlayerIndex ?? 0].CanEndTurn = true;
            GlobalData.GameState.Players[newPlayerIndex ?? 0].State = "actionEnded";
            GlobalData.GameState.Players[newPlayerIndex ?? 0].InHospital = false;
        }

        GlobalData.GameState.CurrentPlayer = newPlayerIndex ?? 0;

        var responseMessage = new WebSocketMessage<object> {
            Type = "end-turn-result",
            Data = new {
                playerIndex
            }
        };
        BroadcastMessage(responseMessage);
    }

    public static async Task BuyItem(WebSocket ws, WebSocketMessage<dynamic> message) {
        Console.WriteLine("buy-item message received");

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

        string? itemId;
        try {
            itemId = (string?)message.Data.itemId;
        } catch {
            itemId = null;
        }

        if (itemId == null || !GlobalData.PURCHASEABLE_ITEMS.TryGetValue(itemId, out ShopItem? item)) {
            var errorMessage = new WebSocketMessage<object> {
                Type = "error",
                Data = new {
                    message = "Invalid or missing itemId"
                }
            };
            await SendMessage(ws, errorMessage);
            return;
        }

        if (GlobalData.GameState.Players[playerIndex ?? 0].Money < item.Price) {
            var errorMessage = new WebSocketMessage<object> {
                Type = "error",
                Data = new {
                    message = "You don't have enough money to buy this item"
                }
            };
            await SendMessage(ws, errorMessage);
            return;
        }

        if (GlobalData.GameState.Players[playerIndex ?? 0].Inventory.Contains(item.ID)) {
            var errorMessage = new WebSocketMessage<object> {
                Type = "error",
                Data = new {
                    message = "You already have this item"
                }
            };
            await SendMessage(ws, errorMessage);
            return;
        }

        GlobalData.GameState.Players[playerIndex ?? 0].Money -= item.Price;
        GlobalData.GameState.Players[playerIndex ?? 0].Inventory = [.. GlobalData.GameState.Players[playerIndex ?? 0].Inventory, item.ID];

        var responseMessage = new WebSocketMessage<object> {
            Type = "buy-item-result",
            Data = new {
                playerIndex,
                itemId
            }
        };
        BroadcastMessage(responseMessage);
    }

    private static (int, bool) GetNextStop(int position) {
        var nextStop = GlobalData.FIELDS.FirstOrDefault(f => f.ID > position && f.IsStop)?.ID;
        var crossedStart = nextStop == null;
        if (crossedStart) {
            nextStop = GlobalData.FIELDS.FirstOrDefault(f => f.IsStop)?.ID;
        }
        if (nextStop == null) {
            Console.WriteLine($"[steelroad] No next stop found, playerPosition: {position}, fields: {JsonConvert.SerializeObject(GlobalData.FIELDS)}");
            nextStop = position;
        }
        return (nextStop ?? position, crossedStart);
    }

    public static async Task BuyTrainTicket(WebSocket ws, WebSocketMessage<dynamic> message) {
        Console.WriteLine("buy-train-ticket message received");

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

        int? stop;
        try {
            stop = (int?)message.Data.stop;
        } catch {
            stop = null;
        }

        if (stop == null) {
            var errorMessage = new WebSocketMessage<object> {
                Type = "error",
                Data = new {
                    message = "Invalid or missing stop"
                }
            };
            await SendMessage(ws, errorMessage);
            return;
        }

        var (nextStop, crossedStart) = GetNextStop(stop ?? 0);

        var moneyAdjustment = -3000;
        if (crossedStart) {
            moneyAdjustment += 150_000;
        }

        if (!GlobalData.GameState.Players[playerIndex ?? 0].Inventory.Contains("house")) {
            moneyAdjustment -= 70_000;
        }

        GlobalData.GameState.Players[playerIndex ?? 0].Money += moneyAdjustment;
        GlobalData.GameState.Players[playerIndex ?? 0].Position = nextStop;

        var responseMessage = new WebSocketMessage<object> {
            Type = "buy-train-ticket-result",
            Data = new {
                playerIndex,
                stop = nextStop,
            }
        };
        BroadcastMessage(responseMessage);
    }

    public static async Task FreeRideTrain(WebSocket ws, WebSocketMessage<dynamic> message) {
        Console.WriteLine("free-ride-train message received");

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

        int? stop;
        try {
            stop = (int?)message.Data.stop;
        } catch {
            stop = null;
        }

        if (stop == null) {
            var errorMessage = new WebSocketMessage<object> {
                Type = "error",
                Data = new {
                    message = "Invalid or missing stop"
                }
            };
            await SendMessage(ws, errorMessage);
            return;
        }

        var (nextStop, crossedStart) = GetNextStop(stop ?? 0);
        var shouldFine = new Random().NextDouble() < 0.5;

        var moneyAdjustment = 0;
        if (shouldFine) {
            moneyAdjustment = -40_000;
        }

        if (crossedStart) {
            moneyAdjustment += 150_000;
        }

        if (!GlobalData.GameState.Players[playerIndex ?? 0].Inventory.Contains("house")) {
            moneyAdjustment -= 70_000;
        }

        GlobalData.GameState.Players[playerIndex ?? 0].Money += moneyAdjustment;
        GlobalData.GameState.Players[playerIndex ?? 0].Position = nextStop;

        var responseMessage = new WebSocketMessage<object> {
            Type = "free-ride-train-result",
            Data = new {
                playerIndex,
                stop = nextStop,
                fined = shouldFine,
            }
        };
        BroadcastMessage(responseMessage);
    }
}
