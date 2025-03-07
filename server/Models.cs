namespace server;

using System.Text.Json.Serialization;

public record WebSocketMessage {
    [JsonPropertyName("type")]
    public required string Type { get; set; }
    [JsonPropertyName("data")]
    public required object Data { get; set; }
};
