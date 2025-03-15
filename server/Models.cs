namespace server;

using System.Net.WebSockets;
using Newtonsoft.Json;

public record WebSocketMessage<T> {
    [JsonProperty("type")]
    public required string Type { get; set; }
    [JsonProperty("data")]
    public required T Data { get; set; }
};

public record PlayerConnection {
    [JsonProperty("id")]
    public required string ID { get; set; }
    [JsonProperty("key")]
    public required string Key { get; set; }
    [JsonProperty("name")]
    public required string Name { get; set; }
    [JsonProperty("image")]
    public required string Image { get; set; }
    [JsonProperty("isHost")]
    public required bool IsHost { get; set; }
    [JsonIgnore]
    public required WebSocket WSConnection { get; set; } = null!;
}

public record Game {
    [JsonProperty("id")]
    public string ID { get; set; } = "";
    [JsonProperty("name")]
    public string Name { get; set; } = "";
    [JsonProperty("state")]
    public GameState? State { get; set; }

    [JsonIgnore]
    public List<PlayerConnection> LobbyConnections { get; set; } = [];
    [JsonIgnore]
    public List<PlayerConnection> Connections { get; set; } = [];

    [JsonProperty("hasStarted")]
    public bool HasStarted { get; set; } = false;
    [JsonProperty("maxPlayers")]
    public int MaxPlayers { get; set; } = 4;
    [JsonProperty("isPublic")]
    public bool IsPublic { get; set; } = true;
    [JsonProperty("hostID")]
    public string? HostID { get; set; }
}

public record LobbyData {
    [JsonProperty("id")]
    public required string ID { get; set; }
    [JsonProperty("name")]
    public required string Name { get; set; }
    [JsonProperty("isPublic")]
    public required bool IsPublic { get; set; }
    [JsonProperty("maxPlayers")]
    public required int MaxPlayers { get; set; }
    [JsonProperty("players")]
    public required List<PublicPlayer> Players { get; set; } = [];
}

public record PublicPlayer {
    [JsonProperty("id")]
    public required string ID { get; set; }
    [JsonProperty("name")]
    public required string Name { get; set; }
    [JsonProperty("image")]
    public required string Image { get; set; }
    [JsonProperty("isHost")]
    public required bool IsHost { get; set; }
}

public record GameState {
    [JsonProperty("isGameOver")]
    public required bool IsGameOver { get; set; }
    [JsonProperty("winningPlayerIndex")]
    public required int WinningPlayerIndex { get; set; }
    [JsonProperty("currentPlayer")]
    public required int CurrentPlayer { get; set; }
    [JsonProperty("players")]
    public required List<Player> Players { get; set; } = [];
}

public record Player {
    [JsonProperty("id")]
    public string? ID { get; set; }
    [JsonProperty("index")]
    public required int Index { get; set; }
    [JsonProperty("name")]
    public required string Name { get; set; }
    [JsonProperty("image")]
    public required string Image { get; set; }
    [JsonProperty("money")]
    public required int Money { get; set; }
    [JsonProperty("position")]
    public required int Position { get; set; }
    [JsonProperty("inventory")]
    public required string[] Inventory { get; set; }
    [JsonProperty("insurances")]
    public required string[] Insurances { get; set; }
    [JsonProperty("inHospital")]
    public required bool InHospital { get; set; }
    [JsonProperty("inJail")]
    public required bool InJail { get; set; }
    [JsonProperty("canRollDice")]
    public required bool CanRollDice { get; set; }
    [JsonProperty("canEndTurn")]
    public required bool CanEndTurn { get; set; }
    [JsonProperty("state")]
    public required string State { get; set; }
    [JsonProperty("rolledDice")]
    public int? RolledDice { get; set; }
    [JsonProperty("rollingDice")]
    public bool? RollingDice { get; set; }
    [JsonProperty("luckyID")]
    public string? LuckyID { get; set; } = null;
    [JsonProperty("luckyFlipped")]
    public bool? LuckyFlipped { get; set; } = false;
}

public delegate void FieldAction(GameState gameState);

public record Field {
    [JsonProperty("id")]
    public required int ID { get; set; }
    [JsonProperty("name")]
    public required string Name { get; set; }
    [JsonProperty("isStop")]
    public bool IsStop { get; set; }
    [JsonProperty("isActionInstant")]
    public bool IsActionInstant { get; set; }
    [JsonProperty("action")]
    [JsonIgnore]
    public FieldAction? Action { get; set; }
}

public record ShopItem {
    [JsonProperty("id")]
    public required string ID { get; set; }
    [JsonProperty("name")]
    public required string Name { get; set; }
    [JsonProperty("price")]
    public required int Price { get; set; }
    [JsonProperty("optional")]
    public bool Optional { get; set; }
}

public record Insurance {
    [JsonProperty("id")]
    public required string ID { get; set; }
    [JsonProperty("name")]
    public required string Name { get; set; }
    [JsonProperty("price")]
    public required int Price { get; set; }
}
public record LuckyCard {
    [JsonProperty("id")]
    public required string ID { get; set; }
    [JsonProperty("text")]
    public required string Text { get; set; }
    [JsonProperty("weight")]
    public required int Weight { get; set; }
    [JsonIgnore]
    public Func<GameState, int, bool>? Condition { get; set; } = null;
    [JsonIgnore]
    public required Action<GameState, int> Action { get; set; }
}
