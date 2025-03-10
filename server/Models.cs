namespace server;

using Newtonsoft.Json;

public record WebSocketMessage<T> {
    [JsonProperty("type")]
    public required string Type { get; set; }
    [JsonProperty("data")]
    public required T Data { get; set; }
};

public record ConnectionData {
    [JsonProperty("id")]
    public required string ID { get; set; }
}
