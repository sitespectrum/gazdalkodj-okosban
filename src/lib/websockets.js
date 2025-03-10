import { SERVER_URL } from "@/lib/constants";

export function startWebSocket() {
  const ws = new WebSocket(`${SERVER_URL}/ws`);
  ws.onopen = () => {
    console.log("WebSocket is open");
  };
  ws.onmessage = (event) => {
    handleMessage(event.data);
  };
  ws.onclose = () => {
    console.log("WebSocket is closed");
  };
}

function handleMessage(message) {
  const messageObject = JSON.parse(message);
  const type = messageObject.type;

  switch (type) {
    case "time":
      console.log("Time message received:", messageObject.data);
      break;
    default:
      console.log("Unknown WebSocket message type:", type, messageObject.data);
      break;
  }
}
