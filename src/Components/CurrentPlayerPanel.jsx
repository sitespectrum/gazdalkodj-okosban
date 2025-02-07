import { purchaseableItems } from "../App";

export function formatMoney(
    value,
    locale = "hu-HU",
    currency = "HUF",
) {
    const formatter = new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
        minimumFractionDigits: 0,
    });
    return formatter.format(value);
}


export function CurrentPlayerPanel({ currentPlayer, playerMoney, playerInventory }) {
    return (
        <div className="player-panel">
            <div className="player-panel-header">
                <div>
                    {currentPlayer === 0 && <img className="player-panel-puppet" src="./src/Pictures/Puppets/Piros bábú 1.png" alt="Piros bábú 1" />}
                    {currentPlayer === 1 && <img className="player-panel-puppet" src="./src/Pictures/Puppets/Kék bábú 1.png" alt="Kék bábú 1" />}
                    {currentPlayer === 2 && <img className="player-panel-puppet" src="./src/Pictures/Puppets/Zöld bábú 1.png" alt="Zöld bábú 1" />}
                    {currentPlayer === 3 && <img className="player-panel-puppet" src="./src/Pictures/Puppets/Sárga bábú 1.png" alt="Sárga bábú 1" />}
                </div>
                <p>Játékos {currentPlayer + 1}: <strong>{formatMoney(playerMoney)}</strong></p>
            </div>
            <div className="player-panel-inventory-container">
                <p>Leltár</p>
                <ul className="player-panel-inventory">
                    {purchaseableItems.map((item) =>
                        <li className="player-panel-inventory-item" disabled={!playerInventory.includes(item)} key={item}>
                            {!playerInventory.includes(item) &&
                                <div className="player-panel-inventory-item-disabled-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                </div>
                            }
                            {playerInventory.includes(item) &&
                                <div className="player-panel-inventory-item-enabled-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><path d="M20 6 9 17l-5-5" /></svg>
                                </div>
                            }

                            <div className="player-panel-inventory-item-name">{item}</div>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
}