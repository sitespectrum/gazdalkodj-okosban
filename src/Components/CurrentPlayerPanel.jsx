import { useContext } from "react";
import { moneyContext } from "../main.jsx";
import { purchaseableItems } from "../App";

export function formatMoney(value, locale = "hu-HU", currency = "HUF") {
  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
  });
  return formatter.format(value);
}

export function CurrentPlayerPanel({ currentPlayer, playerInventory }) {
  const [playerMoney] = useContext(moneyContext);

  return (
    <div className="flex flex-col bg-black/50 rounded-xl text-white text-lg h-full text-center">
      <div className="flex gap-4 px-4 py-2 items-center bg-black/30 rounded-t-xl">
        <div className="h-12">
          {currentPlayer === 0 && (
            <img
              className="h-full object-contain"
              src="./src/Pictures/Puppets/Piros bábú 1.png"
              alt="Piros bábú 1"
            />
          )}
          {currentPlayer === 1 && (
            <img
              className="h-full object-contain"
              src="./src/Pictures/Puppets/Kék bábú 1.png"
              alt="Kék bábú 1"
            />
          )}
          {currentPlayer === 2 && (
            <img
              className="h-full object-contain"
              src="./src/Pictures/Puppets/Zöld bábú 1.png"
              alt="Zöld bábú 1"
            />
          )}
          {currentPlayer === 3 && (
            <img
              className="h-full object-contain"
              src="./src/Pictures/Puppets/Sárga bábú 1.png"
              alt="Sárga bábú 1"
            />
          )}
        </div>
        <p>
          Játékos {currentPlayer + 1}:{" "}
          <strong>{formatMoney(playerMoney[currentPlayer])}</strong>
        </p>
      </div>
      <div className="overflow-y-auto h-full">
        <p className="mt-4">Leltár</p>
        <ul className="flex flex-col gap-2 !p-3">
          {purchaseableItems.map((item) => (
            <li
              className={
                "rounded-xl bg-black/30 flex items-stretch gap-2 text-xl" +
                (playerInventory.includes(item) ? "" : " opacity-50")
              }
              key={item}
            >
              {!playerInventory.includes(item) && (
                <div className="player-panel-inventory-item-disabled-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </div>
              )}
              {playerInventory.includes(item) && (
                <div className="player-panel-inventory-item-enabled-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
              )}

              <div className="player-panel-inventory-item-name">{item}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
