import { StrictMode, createContext, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

export const moneyContext = createContext([
  [400000, 400000, 400000, 400000],
  (_) => {},
]);
export const alertContext = createContext(null);

function Providers({ children }) {
  const [playerMoney, setPlayerMoney] = useState([
    400000, 400000, 400000, 400000,
  ]);
  const [alertContent, setAlertContent] = useState(null);
  const [showAlertOnPopup, setShowAlertOnPopup] = useState(false);
  const [showCloseButton, setShowCloseButton] = useState(true);

  return (
    <moneyContext.Provider value={[playerMoney, setPlayerMoney]}>
      <alertContext.Provider
        value={[
          alertContent,
          setAlertContent,
          showAlertOnPopup,
          setShowAlertOnPopup,
          showCloseButton,
          setShowCloseButton,
        ]}
      >
        {children}
      </alertContext.Provider>
    </moneyContext.Provider>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Providers>
      <App />
    </Providers>
  </StrictMode>
);
