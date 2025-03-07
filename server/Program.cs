using System.Net.WebSockets;
using System.Text;
using System.Text.Json;
using server;

var builder = WebApplication.CreateBuilder(args);
builder.WebHost.UseUrls("http://localhost:42069");

var app = builder.Build();
app.UseWebSockets();

app.MapGet("/", () => "Hello World!");

app.MapGet("/ws", async (context) => {
    if (!context.WebSockets.IsWebSocketRequest) {
        context.Response.StatusCode = StatusCodes.Status400BadRequest;
        return;
    }

    var ws = await context.WebSockets.AcceptWebSocketAsync();
    while (ws.State == WebSocketState.Open) {
        var message = new WebSocketMessage {
            Type = "time",
            Data = DateTime.Now
        };
        var messageBytes = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(message));
        await ws.SendAsync(new ArraySegment<byte>(messageBytes), WebSocketMessageType.Text, true, CancellationToken.None);
        await Task.Delay(1000);
    }
});

await app.RunAsync();
