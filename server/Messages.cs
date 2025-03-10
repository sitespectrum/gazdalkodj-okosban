namespace server;

using System.Net.WebSockets;
using System.Text;
using Newtonsoft.Json;

public static class Messages {
    public static async Task HandleMessage(WebSocket ws, byte[] messageBytes) {
        var messageString = Encoding.UTF8.GetString(messageBytes);

        Console.WriteLine(Encoding.UTF8.GetString(messageBytes));
        WebSocketMessage<dynamic>? message;
        try {
            message = JsonConvert.DeserializeObject<WebSocketMessage<dynamic>>(messageString);
        } catch (Exception e) {
            var errorMessage = new WebSocketMessage<string> {
                Type = "error",
                Data = $"Invalid JSON: {e.Message}"
            };
            await ws.SendAsync(new ArraySegment<byte>(Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(errorMessage))), WebSocketMessageType.Text, true, CancellationToken.None);
            return;
        }

        if (message == null) {
            var errorMessage = new WebSocketMessage<string> {
                Type = "error",
                Data = "Invalid message format"
            };
            await ws.SendAsync(new ArraySegment<byte>(Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(errorMessage))), WebSocketMessageType.Text, true, CancellationToken.None);
            return;
        }

        switch (message.Type) {
            case "time":
                break;
            default:
                Console.WriteLine($"Unknown message type: {message.Type}");
                var errorMessage = new WebSocketMessage<string> {
                    Type = "error",
                    Data = $"Unknown message type '{message.Type}'"
                };
                await ws.SendAsync(new ArraySegment<byte>(Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(errorMessage))), WebSocketMessageType.Text, true, CancellationToken.None);
                break;
        }
    }
}

