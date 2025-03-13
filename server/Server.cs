using System.Net.WebSockets;
using System.Web;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using server;

var builder = WebApplication.CreateBuilder(args);
builder.WebHost.UseUrls(
    Environment.GetEnvironmentVariable("ASPNETCORE_URLS")
    ?? "http://localhost:42069"
);

builder.Services.AddCors(options =>
    options.AddPolicy("AllowAllOrigins",
        builder => {
            builder.AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
        }));
var app = builder.Build();
app.UseWebSockets();
app.UseCors("AllowAllOrigins");

app.MapGet("/", () => "Hello World!");

app.MapGet("/games", () => {
    return Results.Json(GlobalData.Games.Select(g => new {
        g.ID,
        g.Name,
        g.MaxPlayers,
        playerCount = g.LobbyConnections.DistinctBy(c => c.ID).Count()
    }));
});

app.MapPost("/create-game", (Game game, [FromQuery] string hostID, HttpContext context) => {
    game.ID = Utils.MakeID(8);
    game.LobbyConnections = [];
    game.Connections = [];
    game.HasStarted = false;
    game.HostID = hostID;
    if (game.Name == "") {
        game.Name = "Névtelen játék";
    }

    if (game.MaxPlayers < 1) {
        game.MaxPlayers = 1;
    }

    GlobalData.Games.Add(game);

    return Results.Ok(game);
});

app.MapGet("/ws/lobby-{gameID}", async (string gameID, string playerData, HttpContext context) => {
    if (!context.WebSockets.IsWebSocketRequest) {
        context.Response.StatusCode = StatusCodes.Status400BadRequest;
        return;
    }

    var ws = await context.WebSockets.AcceptWebSocketAsync();

    var player = JsonConvert.DeserializeObject<PlayerConnection>(HttpUtility.UrlDecode(playerData));

    var game = GlobalData.Games.FirstOrDefault(g => g.ID == gameID);

    if (game == null) {
        context.Response.StatusCode = StatusCodes.Status404NotFound;
        return;
    }

    if (player == null) {
        context.Response.StatusCode = StatusCodes.Status400BadRequest;
        return;
    }

    var connection = new PlayerConnection {
        ID = player.ID,
        Key = player.Key,
        Name = player.Name,
        Image = player.Image,
        IsHost = player.ID == game.HostID,
        WSConnection = ws
    };

    game.LobbyConnections.Add(connection);

    var handler = new MessagesHandler(game, connection);

    await handler.SyncLobbyState();
    handler.AnnouncePlayerJoined();

    var buffer = new byte[1024 * 4];
    var receiveResult = await ws.ReceiveAsync(
        new ArraySegment<byte>(buffer),
        CancellationToken.None
    );

    Console.WriteLine(receiveResult);

    while (!receiveResult.CloseStatus.HasValue) {
        var messageBytes = new byte[receiveResult.Count];
        Array.Copy(buffer, messageBytes, receiveResult.Count);

        Console.WriteLine("Received message");
        _ = handler.HandleMessage(messageBytes);

        receiveResult = await ws.ReceiveAsync(
            new ArraySegment<byte>(buffer),
            CancellationToken.None
        );
    }

    await ws.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closing", CancellationToken.None);
    if (!game.HasStarted) {
        game.LobbyConnections.Remove(connection);
        handler.AnnouncePlayerLeft();
    }
});


app.MapGet("/ws/game-{gameID}", async (string gameID, string playerID, HttpContext context) => {
    if (!context.WebSockets.IsWebSocketRequest) {
        context.Response.StatusCode = StatusCodes.Status400BadRequest;
        return;
    }

    var ws = await context.WebSockets.AcceptWebSocketAsync();

    var game = GlobalData.Games.FirstOrDefault(g => g.ID == gameID);

    if (game == null) {
        context.Response.StatusCode = StatusCodes.Status404NotFound;
        return;
    }

    var player = game.LobbyConnections.First(c => c.ID == playerID);

    if (player == null) {
        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
        return;
    }

    var connection = new PlayerConnection {
        ID = player.ID,
        Key = player.Key,
        Name = player.Name,
        Image = player.Image,
        IsHost = player.IsHost,
        WSConnection = ws
    };

    game.Connections.Add(connection);
    var handler = new MessagesHandler(game, connection);

    await handler.SyncGameState();

    var buffer = new byte[1024 * 4];
    var receiveResult = await ws.ReceiveAsync(
        new ArraySegment<byte>(buffer),
        CancellationToken.None
    );

    Console.WriteLine(receiveResult);

    while (!receiveResult.CloseStatus.HasValue) {
        var messageBytes = new byte[receiveResult.Count];
        Array.Copy(buffer, messageBytes, receiveResult.Count);

        Console.WriteLine("Received message");
        _ = handler.HandleMessage(messageBytes);

        receiveResult = await ws.ReceiveAsync(
            new ArraySegment<byte>(buffer),
            CancellationToken.None
        );
    }

    await ws.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closing", CancellationToken.None);
    game.Connections.Remove(connection);
});

await app.RunAsync();
