//@ts-check
import React from "react";
import { useCurrentPlayer } from "../hooks/use-current-player.js";
import { PURCHASEABLE_ITEMS } from "../lib/constants.js";
import { formatMoney } from "../lib/utils.js";

export function CurrentPlayerPanel() {
  const { player } = useCurrentPlayer();

  return (
    <div className="flex flex-col bg-black/50 rounded-xl text-white text-lg h-full text-center">
      <div className="flex gap-4 px-4 py-2 items-center bg-black/30 rounded-t-xl">
        <div className="h-12">
          <img
            className="h-full object-contain"
            src={player.image}
            alt={`${player.name} ikonja`}
          />
        </div>
        <p>
          {player.name}: <strong>{formatMoney(player.money)}</strong>
        </p>
      </div>
      <div className="overflow-y-auto h-full">
        <p className="mt-4">Leltár</p>
        <ul className="flex flex-col gap-2 !p-3">
          {PURCHASEABLE_ITEMS.map((item) => (
            <li
              className={
                "rounded-xl bg-black/30 flex items-stretch gap-2 text-xl" +
                (player.inventory.includes(item) ? "" : " opacity-50")
              }
              key={item}
            >
              {!player.inventory.includes(item) && (
                <div className="w-10 h-10 min-w-10 text-white bg-[#852828] flex items-center justify-center rounded-l-xl">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1.5rem"
                    height="1.5rem"
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
              {player.inventory.includes(item) && (
                <div className="w-10 h-10 min-w-10 text-white bg-[#288547] flex items-center justify-center rounded-l-xl">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1.5rem"
                    height="1.5rem"
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

              <div className="flex items-center">{item}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
