using System.Net.WebSockets;
using System.Text;
using System.Text.Json;
using server;

var builder = WebApplication.CreateBuilder(args);
builder.WebHost.UseUrls("http://localhost:42069");

var app = builder.Build();
app.UseWebSockets();

var connections = new List<WebSocket>();

app.MapGet("/", () => "Hello World!");

app.MapGet("/ws", async (context) => {
    if (!context.WebSockets.IsWebSocketRequest) {
        context.Response.StatusCode = StatusCodes.Status400BadRequest;
        return;
    }

    var ws = await context.WebSockets.AcceptWebSocketAsync();
    connections.Add(ws);

    var buffer = new byte[1024 * 4];
    var receiveResult = await ws.ReceiveAsync(
        new ArraySegment<byte>(buffer),
        CancellationToken.None
    );

    Console.WriteLine(receiveResult);

    while (!receiveResult.CloseStatus.HasValue) {
        Console.WriteLine("Received message");
        _ = Messages.HandleMessage(ws, buffer);

        receiveResult = await ws.ReceiveAsync(
            new ArraySegment<byte>(buffer),
            CancellationToken.None
        );
    }

    await ws.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closing", CancellationToken.None);
    connections.Remove(ws);
});

await app.RunAsync();
