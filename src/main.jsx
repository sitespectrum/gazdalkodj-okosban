import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Providers } from "./lib/providers.jsx";

const container = document.getElementById("root");
let root = container._reactRootContainer;

if (!root) {
  root = createRoot(container);
  container._reactRootContainer = root;
}

root.render(
  <Providers>
    <App />
  </Providers>
);
