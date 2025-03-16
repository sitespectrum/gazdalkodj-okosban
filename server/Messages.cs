namespace server;

using System.Net.WebSockets;
using System.Text;
using Newtonsoft.Json;

public class MessagesHandler(Game game, PlayerConnection connection) {
    private readonly Game game = game;
    private readonly PlayerConnection connection = connection;

    public async Task SendMessage(WebSocketMessage<dynamic> message, PlayerConnection? conn = null) {
        await (conn ?? connection).WSConnection.SendAsync(
            new ArraySegment<byte>(
                Encoding.UTF8.GetBytes(
                    JsonConvert.SerializeObject(message))),
            WebSocketMessageType.Text,
            true,
            CancellationToken.None
        );
    }

    public void BroadcastMessage(WebSocketMessage<dynamic> message) {
        foreach (var connection in game.Connections) {
            _ = SendMessage(message, connection);
        }
    }

    public void BroadcastLobbyMessage(WebSocketMessage<dynamic> message) {
        foreach (var connection in game.LobbyConnections) {
            _ = SendMessage(message, connection);
        }
    }

    public int GetPlayerIndex(WebSocketMessage<dynamic> message) {
        if (connection.IsAdmin) {
            return (int?)message.Data.playerIndex ?? -1;
        }
        return game.State?.Players.FirstOrDefault(c => c.ID == connection.ID)?.Index ?? -1;
    }

    public async Task HandleMessage(byte[] messageBytes) {
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
            await SendMessage(errorMessage);
            return;
        }

        if (message == null) {
            var errorMessage = new WebSocketMessage<object> {
                Type = "error",
                Data = new {
                    message = "Invalid message format"
                }
            };
            await SendMessage(errorMessage);
            return;
        }

        switch (message.Type) {
            case "start-game":
                await StartGame();
                break;
            case "update-player":
                AnnouncePlayerUpdated(message);
                break;
            case "roll-dice":
                await RollDice(message);
                break;
            case "move-player":
                await MovePlayer(message);
                break;
            case "end-action":
                await EndAction(message);
                break;
            case "end-turn":
                await EndTurn(message);
                break;
            case "buy-item":
                await BuyItem(message);
                break;
            case "buy-insurance":
                await BuyInsurance(message);
                break;
            case "buy-train-ticket":
                await BuyTrainTicket(message);
                break;
            case "free-ride-train":
                await FreeRideTrain(message);
                break;
            case "flip-lucky-card":
                await FlipLuckyCard(message);
                break;
            case "successful-bank-robbery":
                await SuccessfulBankRobbery(message);
                break;
            case "failed-bank-robbery":
                await FailedBankRobbery(message);
                break;
            default:
                await UnknownMessage(message);
                break;
        }
    }

    public async Task UnknownMessage(WebSocketMessage<dynamic> message) {
        Console.WriteLine($"Unknown message type: {message.Type}");
        var errorMessage = new WebSocketMessage<object> {
            Type = "error",
            Data = new {
                message = $"Unknown message type '{message.Type}'"
            }
        };
        await SendMessage(errorMessage);
    }

    public async Task SyncLobbyState() {
        var responseMessage = new WebSocketMessage<object> {
            Type = "sync-lobby-state",
            Data = new LobbyData {
                ID = game.ID,
                Name = game.Name,
                IsPublic = game.IsPublic,
                MaxPlayers = game.MaxPlayers,
                Players = [.. game.LobbyConnections.DistinctBy(c => c.ID).Select(c => new PublicPlayer {
                    ID = c.ID,
                    Name = c.Name,
                    Image = c.Image,
                    IsHost = c.IsHost
                })]
            }
        };
        await SendMessage(responseMessage);
    }

    public void AnnouncePlayerJoined() {
        var responseMessage = new WebSocketMessage<object> {
            Type = "player-joined",
            Data = new {
                playerCount = game.LobbyConnections.DistinctBy(c => c.ID).Count(),
                player = new PublicPlayer {
                    ID = connection.ID,
                    Name = connection.Name,
                    Image = connection.Image,
                    IsHost = connection.IsHost
                }
            }
        };
        BroadcastLobbyMessage(responseMessage);
    }

    public void AnnouncePlayerLeft() {
        var responseMessage = new WebSocketMessage<object> {
            Type = "player-left",
            Data = new {
                playerCount = game.LobbyConnections.DistinctBy(c => c.ID).Count(),
                player = new PublicPlayer {
                    ID = connection.ID,
                    Name = connection.Name,
                    Image = connection.Image,
                    IsHost = connection.IsHost
                }
            }
        };
        BroadcastLobbyMessage(responseMessage);
    }

    public void AnnouncePlayerUpdated(WebSocketMessage<dynamic> message) {
        try {
            var player = JsonConvert.DeserializeObject<PublicPlayer>(
                JsonConvert.SerializeObject(message.Data)
            );

            var lobbyConnection = game.LobbyConnections.FirstOrDefault(c => c.ID == player.ID);
            if (lobbyConnection == null) {
                return;
            }

            lobbyConnection.Name = player.Name ?? lobbyConnection.Name;
            lobbyConnection.Image = player.Image ?? lobbyConnection.Image;

            var responseMessage = new WebSocketMessage<object> {
                Type = "player-updated",
                Data = new PublicPlayer {
                    ID = lobbyConnection.ID,
                    Name = lobbyConnection.Name,
                    Image = lobbyConnection.Image,
                    IsHost = lobbyConnection.IsHost
                }
            };
            BroadcastLobbyMessage(responseMessage);
        } catch (Exception e) {
            Console.WriteLine($"Error: {e.Message}");
        }
    }

    public async Task StartGame() {
        if (!connection.IsHost) {
            var errorMessage = new WebSocketMessage<object> {
                Type = "error",
                Data = new {
                    message = "You are not the host"
                }
            };
            await SendMessage(errorMessage);
            return;
        }

        game.HasStarted = true;
        game.State = new GameState {
            IsGameOver = false,
            WinningPlayerIndex = -1,
            CurrentPlayer = 0,
            Players = [.. game.LobbyConnections.DistinctBy(c => c.ID).Select((c, i) => new Player {
                ID = c.ID,
                Index = i,
                Name = c.Name,
                Image = c.Image,
                Money = GlobalData.DefaultPlayer.Money,
                Position = GlobalData.DefaultPlayer.Position,
                Inventory = GlobalData.DefaultPlayer.Inventory,
                Insurances = GlobalData.DefaultPlayer.Insurances,
                InHospital = GlobalData.DefaultPlayer.InHospital,
                InJail = GlobalData.DefaultPlayer.InJail,
                CanRollDice = GlobalData.DefaultPlayer.CanRollDice,
                CanEndTurn = GlobalData.DefaultPlayer.CanEndTurn,
                State = GlobalData.DefaultPlayer.State,
                RolledDice = GlobalData.DefaultPlayer.RolledDice,
                RollingDice = GlobalData.DefaultPlayer.RollingDice,
            })]
        };

        Console.WriteLine(JsonConvert.SerializeObject(game.State));

        BroadcastLobbyMessage(new WebSocketMessage<object> {
            Type = "game-started",
            Data = new { }
        });
    }

    public async Task SyncGameState() {
        var responseMessage = new WebSocketMessage<object> {
            Type = "sync-game-state",
            Data = game.State!
        };
        await SendMessage(responseMessage);
    }

    public async Task RollDice(WebSocketMessage<dynamic> message) {
        Console.WriteLine("roll-dice message received");

        int playerIndex = GetPlayerIndex(message);
        if (playerIndex == -1) {
            var errorMessage = new WebSocketMessage<object> {
                Type = "error",
                Data = new {
                    message = "Invalid or missing playerIndex"
                }
            };
            await SendMessage(errorMessage);
            return;
        }

        if (game.State?.CurrentPlayer != playerIndex && !connection.IsAdmin) {
            var errorMessage = new WebSocketMessage<object> {
                Type = "error",
                Data = new {
                    message = "It's not your turn"
                }
            };
            await SendMessage(errorMessage);
            return;
        }

        if (!game.State!.Players[playerIndex].CanRollDice && !connection.IsAdmin) {
            var errorMessage = new WebSocketMessage<object> {
                Type = "error",
                Data = new {
                    message = "You can't roll the dice right now"
                }
            };
            await SendMessage(errorMessage);
            return;
        }

        BroadcastMessage(new WebSocketMessage<object> {
            Type = "roll-dice-started",
            Data = new {
                playerIndex
            }
        });

        var result = new Random().Next(1, 7);
        if (game.State.Players[playerIndex].RolledDice == null) {
            game.State.Players[playerIndex].RolledDice = result;
        } else {
            result = game.State.Players[playerIndex].RolledDice ?? 0;
        }

        game.State.Players[playerIndex].RollingDice = false;
        game.State.Players[playerIndex].CanRollDice = false;
        game.State.Players[playerIndex].CanEndTurn = true;
        game.State.Players[playerIndex].State = "rolledDice";

        var responseMessage = new WebSocketMessage<object> {
            Type = "roll-dice-result",
            Data = new {
                playerIndex,
                result
            }
        };
        BroadcastMessage(responseMessage);
    }

    public async Task MovePlayer(WebSocketMessage<dynamic> message) {
        Console.WriteLine("move-player message received");

        int playerIndex = GetPlayerIndex(message);
        if (playerIndex == -1) {
            var errorMessage = new WebSocketMessage<object> {
                Type = "error",
                Data = new {
                    message = "Invalid or missing playerIndex"
                }
            };
            await SendMessage(errorMessage);
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
            await SendMessage(errorMessage);
            return;
        }

        if (playerIndex != game.State?.CurrentPlayer && !connection.IsAdmin) {
            var errorMessage = new WebSocketMessage<object> {
                Type = "error",
                Data = new {
                    message = "It's not your turn"
                }
            };
            await SendMessage(errorMessage);
            return;
        }

        if (steps != game.State!.Players[playerIndex].RolledDice && !connection.IsAdmin) {
            var errorMessage = new WebSocketMessage<object> {
                Type = "error",
                Data = new {
                    message = "You rolled a different number!"
                }
            };
            await SendMessage(errorMessage);
            return;
        }

        if (game.State.Players[playerIndex].InHospital) {
            var errorMessage = new WebSocketMessage<object> {
                Type = "error",
                Data = new {
                    message = "You can't move right now"
                }
            };
            await SendMessage(errorMessage);
            return;
        }

        if (game.State.Players[playerIndex].InJail && steps != 6) {
            game.State.Players[playerIndex].CanRollDice = false;
            game.State.Players[playerIndex].State = "rolledDice";

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
            game.State.Players[playerIndex].Position == 0 &&
            game.State.Players[playerIndex].Money == 400_000 &&
            game.State.Players[playerIndex].Inventory.Length == 0;

        var oldPlayerPosition = game.State.Players[playerIndex].Position;
        var oldPlayerHasHouse = game.State.Players[playerIndex].Inventory.Contains("house");
        var oldPlayerInJail = game.State.Players[playerIndex].InJail;

        game.State.Players[playerIndex].CanRollDice = false;
        if (oldPlayerInJail) {
            game.State.Players[playerIndex].InJail = false;
            game.State.Players[playerIndex].Position = 9 + steps ?? 0;
            return;
        } else {
            game.State.Players[playerIndex].Position =
                (game.State.Players[playerIndex].Position + steps ?? 0) % 27;
            game.State.Players[playerIndex].CanEndTurn = false;
            game.State.Players[playerIndex].State = "rolledDice";
        }

        var newField = GlobalData.FIELDS[game.State.Players[playerIndex].Position];

        var crossedStart =
            oldPlayerPosition > game.State.Players[playerIndex].Position &&
            game.State.Players[playerIndex].Position != 0 &&
            !oldPlayerInJail;

        if (crossedStart && newField.ID != 0) {
            game.State.Players[playerIndex].Money += 150_000;
        }

        if (
            (crossedStart || oldPlayerPosition == 0) &&
            !oldPlayerHasHouse &&
            !isStartingGame
        ) {
            game.State.Players[playerIndex].Money -= 70_000;
        }

        game.State.Players[playerIndex].CanEndTurn = true;
        game.State.Players[playerIndex].State = newField.IsActionInstant
            ? "actionEnded"
            : "actionStarted";

        newField.Action?.Invoke(game.State);

        var responseMessage = new WebSocketMessage<object> {
            Type = "move-player-result",
            Data = new {
                playerIndex,
                steps
            }
        };
        BroadcastMessage(responseMessage);
    }

    public async Task EndAction(WebSocketMessage<dynamic> message) {
        Console.WriteLine("end-action message received");

        int playerIndex = GetPlayerIndex(message);
        if (playerIndex == -1) {
            var errorMessage = new WebSocketMessage<object> {
                Type = "error",
                Data = new {
                    message = "Invalid or missing playerIndex"
                }
            };
            await SendMessage(errorMessage);
            return;
        }

        if (game.State?.CurrentPlayer != playerIndex && !connection.IsAdmin) {
            var errorMessage = new WebSocketMessage<object> {
                Type = "error",
                Data = new {
                    message = "It's not your turn"
                }
            };
            await SendMessage(errorMessage);
            return;
        }

        game.State!.Players[playerIndex].State = "actionEnded";

        var responseMessage = new WebSocketMessage<object> {
            Type = "action-ended",
            Data = new {
                playerIndex
            }
        };
        BroadcastMessage(responseMessage);
    }

    public async Task EndTurn(WebSocketMessage<dynamic> message) {
        Console.WriteLine("end-turn message received");

        int playerIndex = GetPlayerIndex(message);
        if (playerIndex == -1) {
            var errorMessage = new WebSocketMessage<object> {
                Type = "error",
                Data = new {
                    message = "Invalid or missing playerIndex"
                }
            };
            await SendMessage(errorMessage);
            return;
        }

        if (game.State?.CurrentPlayer != playerIndex && !connection.IsAdmin) {
            var errorMessage = new WebSocketMessage<object> {
                Type = "error",
                Data = new {
                    message = "It's not your turn"
                }
            };
            await SendMessage(errorMessage);
            return;
        }

        if (!game.State!.Players[playerIndex].CanEndTurn) {
            var errorMessage = new WebSocketMessage<object> {
                Type = "error",
                Data = new {
                    message = "You can't end your turn right now"
                }
            };
            await SendMessage(errorMessage);
            return;
        }

        var newPlayerIndex = (playerIndex + 1) % game.State.Players.Count;

        game.State!.Players[newPlayerIndex].State = "justStarted";
        game.State!.Players[newPlayerIndex].CanRollDice = true;
        game.State!.Players[newPlayerIndex].CanEndTurn = false;
        game.State!.Players[newPlayerIndex].RollingDice = false;
        game.State!.Players[newPlayerIndex].RolledDice = null;
        game.State!.Players[newPlayerIndex].LuckyID = null;
        game.State!.Players[newPlayerIndex].LuckyFlipped = false;

        if (game.State!.Players[newPlayerIndex].InHospital) {
            game.State!.Players[newPlayerIndex].CanRollDice = false;
            game.State!.Players[newPlayerIndex].CanEndTurn = true;
            game.State!.Players[newPlayerIndex].State = "actionEnded";
            game.State!.Players[newPlayerIndex].InHospital = false;
        }

        game.State!.CurrentPlayer = newPlayerIndex;

        var responseMessage = new WebSocketMessage<object> {
            Type = "end-turn-result",
            Data = new {
                playerIndex
            }
        };
        BroadcastMessage(responseMessage);
    }

    public async Task BuyItem(WebSocketMessage<dynamic> message) {
        Console.WriteLine("buy-item message received");

        int playerIndex = GetPlayerIndex(message);
        if (playerIndex == -1) {
            var errorMessage = new WebSocketMessage<object> {
                Type = "error",
                Data = new {
                    message = "Invalid or missing playerIndex"
                }
            };
            await SendMessage(errorMessage);
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
            await SendMessage(errorMessage);
            return;
        }

        if (game.State!.Players[playerIndex].Money < item.Price && !connection.IsAdmin) {
            var errorMessage = new WebSocketMessage<object> {
                Type = "error",
                Data = new {
                    message = "You don't have enough money to buy this item"
                }
            };
            await SendMessage(errorMessage);
            return;
        }

        if (game.State!.Players[playerIndex].Inventory.Contains(item.ID)) {
            var errorMessage = new WebSocketMessage<object> {
                Type = "error",
                Data = new {
                    message = "You already have this item"
                }
            };
            await SendMessage(errorMessage);
            return;
        }

        game.State!.Players[playerIndex].Money -= item.Price;
        game.State!.Players[playerIndex].Inventory = [.. game.State!.Players[playerIndex].Inventory, item.ID];

        var responseMessage = new WebSocketMessage<object> {
            Type = "buy-item-result",
            Data = new {
                playerIndex,
                itemId
            }
        };
        BroadcastMessage(responseMessage);
    }

    public async Task BuyInsurance(WebSocketMessage<dynamic> message) {
        Console.WriteLine("buy-insurance message received");

        int playerIndex = GetPlayerIndex(message);
        if (playerIndex == -1) {
            var errorMessage = new WebSocketMessage<object> {
                Type = "error",
                Data = new {
                    message = "Invalid or missing playerIndex"
                }
            };
            await SendMessage(errorMessage);
            return;
        }

        string? insuranceId;
        try {
            insuranceId = (string?)message.Data.insuranceId;
        } catch {
            insuranceId = null;
        }

        if (insuranceId == null || !GlobalData.INSURANCES.Any(i => i.ID == insuranceId)) {
            var errorMessage = new WebSocketMessage<object> {
                Type = "error",
                Data = new {
                    message = "Invalid or missing insuranceId"
                }
            };
            await SendMessage(errorMessage);
            return;
        }

        var insurance = GlobalData.INSURANCES.First(i => i.ID == insuranceId);

        if (game.State!.Players[playerIndex].Money < insurance.Price && !connection.IsAdmin) {
            var errorMessage = new WebSocketMessage<object> {
                Type = "error",
                Data = new {
                    message = "You don't have enough money to buy this insurance"
                }
            };
            await SendMessage(errorMessage);
            return;
        }

        if (game.State!.Players[playerIndex].Insurances.Contains(insurance.ID)) {
            var errorMessage = new WebSocketMessage<object> {
                Type = "error",
                Data = new {
                    message = "You already have this insurance"
                }
            };
            await SendMessage(errorMessage);
            return;
        }

        game.State!.Players[playerIndex].Money -= insurance.Price;
        game.State!.Players[playerIndex].Insurances = [.. game.State!.Players[playerIndex].Insurances, insurance.ID];

        var responseMessage = new WebSocketMessage<object> {
            Type = "buy-insurance-result",
            Data = new {
                playerIndex,
                insuranceId
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

    public async Task BuyTrainTicket(WebSocketMessage<dynamic> message) {
        Console.WriteLine("buy-train-ticket message received");

        int playerIndex = GetPlayerIndex(message);
        if (playerIndex == -1) {
            var errorMessage = new WebSocketMessage<object> {
                Type = "error",
                Data = new {
                    message = "Invalid or missing playerIndex"
                }
            };
            await SendMessage(errorMessage);
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
            await SendMessage(errorMessage);
            return;
        }

        var (nextStop, crossedStart) = GetNextStop(stop ?? 0);

        var moneyAdjustment = -3000;
        if (crossedStart) {
            moneyAdjustment += 150_000;
            if (!game.State!.Players[playerIndex].Inventory.Contains("house")) {
                moneyAdjustment -= 70_000;
            }
        }


        game.State!.Players[playerIndex].Money += moneyAdjustment;
        game.State!.Players[playerIndex].Position = nextStop;

        var responseMessage = new WebSocketMessage<object> {
            Type = "buy-train-ticket-result",
            Data = new {
                playerIndex,
                stop = nextStop,
            }
        };
        BroadcastMessage(responseMessage);
    }

    public async Task FreeRideTrain(WebSocketMessage<dynamic> message) {
        Console.WriteLine("free-ride-train message received");

        int playerIndex = GetPlayerIndex(message);
        if (playerIndex == -1) {
            var errorMessage = new WebSocketMessage<object> {
                Type = "error",
                Data = new {
                    message = "Invalid or missing playerIndex"
                }
            };
            await SendMessage(errorMessage);
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
            await SendMessage(errorMessage);
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
            if (!game.State!.Players[playerIndex].Inventory.Contains("house")) {
                moneyAdjustment -= 70_000;
            }
        }


        game.State!.Players[playerIndex].Money += moneyAdjustment;
        game.State!.Players[playerIndex].Position = nextStop;

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

    public async Task FlipLuckyCard(WebSocketMessage<dynamic> message) {
        Console.WriteLine("flip-lucky-card message received");

        int playerIndex = GetPlayerIndex(message);
        if (playerIndex == -1) {
            var errorMessage = new WebSocketMessage<object> {
                Type = "error",
                Data = new {
                    message = "Invalid or missing playerIndex"
                }
            };
            await SendMessage(errorMessage);
            return;
        }

        if (game.State!.Players[playerIndex].LuckyID != null) {
            var errorMessage = new WebSocketMessage<object> {
                Type = "error",
                Data = new {
                    message = "You already flipped a lucky card"
                }
            };
            await SendMessage(errorMessage);
            return;
        }

        var cards = GlobalData.LUCKY_CARDS.Where(c => c.Condition == null || c.Condition(game.State!, playerIndex)).ToList();

        var totalWeight = cards.Sum(c => c.Weight);
        var random = Random.Shared.Next(0, totalWeight);

        var chosenCard = cards.FirstOrDefault(c => {
            var cumulativeWeight = cards.Take(cards.IndexOf(c)).Sum(c => c.Weight);
            return cumulativeWeight <= random && cumulativeWeight + c.Weight > random;
        });

        if (chosenCard == null) {
            var errorMessage = new WebSocketMessage<object> {
                Type = "error",
                Data = new {
                    message = "No lucky card found"
                }
            };
            await SendMessage(errorMessage);
            return;
        }

        chosenCard.Action(game.State!, playerIndex);

        var responseMessage = new WebSocketMessage<object> {
            Type = "flip-lucky-card-result",
            Data = new {
                playerIndex,
                cardId = chosenCard.ID
            }
        };
        BroadcastMessage(responseMessage);
    }

    public async Task SuccessfulBankRobbery(WebSocketMessage<dynamic> message) {
        Console.WriteLine("successful-bank-robbery message received");

        int playerIndex = GetPlayerIndex(message);
        if (playerIndex == -1) {
            var errorMessage = new WebSocketMessage<object> {
                Type = "error",
                Data = new {
                    message = "Invalid or missing playerIndex"
                }
            };
            await SendMessage(errorMessage);
            return;
        }

        int? money;
        try {
            money = (int?)message.Data.money;
        } catch {
            money = null;
        }

        if (money == null) {
            var errorMessage = new WebSocketMessage<object> {
                Type = "error",
                Data = new {
                    message = "Invalid or missing money"
                }
            };
            await SendMessage(errorMessage);
            return;
        }

        game.State!.Players[playerIndex].Money += money ?? 0;
        game.State!.Players[playerIndex].State = "actionEnded";

        var responseMessage = new WebSocketMessage<object> {
            Type = "successful-bank-robbery-result",
            Data = new {
                playerIndex,
                money = money ?? 0
            }
        };
        BroadcastMessage(responseMessage);
    }

    public async Task FailedBankRobbery(WebSocketMessage<dynamic> message) {
        Console.WriteLine("failed-bank-robbery message received");

        int playerIndex = GetPlayerIndex(message);
        if (playerIndex == -1) {
            var errorMessage = new WebSocketMessage<object> {
                Type = "error",
                Data = new {
                    message = "Invalid or missing playerIndex"
                }
            };
            await SendMessage(errorMessage);
            return;
        }

        game.State!.Players[playerIndex].InJail = true;
        game.State!.Players[playerIndex].Position = 27;
        game.State!.Players[playerIndex].State = "actionEnded";

        var responseMessage = new WebSocketMessage<object> {
            Type = "failed-bank-robbery-result",
            Data = new {
                playerIndex
            }
        };
        BroadcastMessage(responseMessage);
    }
}