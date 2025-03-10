namespace server;

using System.Net.WebSockets;

public static class GlobalData {
    public static readonly List<WebSocket> Connections = [];
}

