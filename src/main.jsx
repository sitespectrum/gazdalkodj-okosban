import { StrictMode, createContext, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

export const moneyContext = createContext([[400000, 400000, 400000, 400000], (_) => {}]);

function Providers({ children }) {
  const [playerMoney, setPlayerMoney] = useState([400000, 400000, 400000, 400000]);

  return (
    <moneyContext.Provider value={[playerMoney, setPlayerMoney]}>
      {children}
    </moneyContext.Provider>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Providers>
      <App />
    </Providers>
  </StrictMode>,
)
