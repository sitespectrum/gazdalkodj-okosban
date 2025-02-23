import React, { useState, useEffect, useContext } from "react";
import { alertContext } from "../main.jsx";
import { moneyContext } from "../main.jsx";

const Steelroad = ({
  onClose,
  currentPlayer,
  playerPositions,
  setPlayerPositions,
  fields,
  reducePlayerMoney,
  addPlayerMoney,
}) => {
  const [visitedStops, setVisitedStops] = useState(new Set());
  const [_, setAlertContent, __, setShowAlertOnPopup] =
    useContext(alertContext);
  const [playerMoney] = useContext(moneyContext);

  const travelToNextStop = () => {
    setPlayerPositions((prevPositions) => {
      const newPositions = [...prevPositions];
      const previousPosition = newPositions[currentPlayer];
      let nextStop = (previousPosition + 1) % fields.length;
      let attempts = 0;

      while (!fields[nextStop]?.isStop && attempts < fields.length) {
        nextStop = (nextStop + 1) % fields.length;
        attempts++;
      }

      if (attempts >= fields.length || !fields[nextStop]?.isStop) {
        console.error("No valid stops found. Check fields configuration.");
        return prevPositions;
      }

      newPositions[currentPlayer] = nextStop;

      if (previousPosition > nextStop) {
        addPlayerMoney(currentPlayer, 80000);
      }

      setVisitedStops((prevVisited) => new Set([...prevVisited, nextStop]));
      return newPositions;
    });

    if (playerMoney[currentPlayer] >= 3000) {
      reducePlayerMoney(currentPlayer, 3000);
    } else {
      setAlertContent("Nincs elég pénzed a jegyvásárláshoz!");
      setShowAlertOnPopup(true);
      canTravel = false;
    }
    onClose();
  };

  const handleNoTicket = () => {
    setPlayerPositions((prevPositions) => {
      const newPositions = [...prevPositions];
      const previousPosition = newPositions[currentPlayer];
      let nextStop = (newPositions[currentPlayer] + 1) % fields.length;
      let attempts = 0;

      if (previousPosition > nextStop && previousPosition >= startFieldIndex) {
        addPlayerMoney(currentPlayer, 80000);
      }

      while (!fields[nextStop]?.isStop && attempts < fields.length) {
        nextStop = (nextStop + 1) % fields.length;
        attempts++;
      }

      if (attempts >= fields.length || !fields[nextStop]?.isStop) {
        console.error("No valid stops found. Check fields configuration.");
        return prevPositions;
      }

      newPositions[currentPlayer] = nextStop;

      if (previousPosition > nextStop) {
        addPlayerMoney(currentPlayer, 80000);
      }

      return newPositions;
    });

    const shouldFine = Math.random();
    if (shouldFine < 0.5) {
      reducePlayerMoney(currentPlayer, 40000);
      setAlertContent(
        `Bábu ${currentPlayer + 1} büntetést kapott! 40000 Ft levonva.`
      );
      setShowAlertOnPopup(true);
    }
    onClose();
  };

  const currentPosition = playerPositions[currentPlayer];
  let canTravel = fields[currentPosition]?.isStop || false;

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const earlierTime = new Date(time.getTime() - 20 * 60000);

  return (
    <div className="steelroad">
      <h2>Utazás a következő megállóra</h2>
      <div className="steelroad-text">
        <p className="simple">
          {earlierTime.toLocaleTimeString("hu-HU", {
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
          -{" "}
          {earlierTime.toLocaleTimeString("hu-HU", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        <p className="red">
          {time.toLocaleTimeString("hu-HU", {
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
          -{" "}
          {time.toLocaleTimeString("hu-HU", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        <p className="delay">
          Biztosítóberendezési hiba miatti késés <br /> Pálya állapota miatti
          késés
        </p>
        <p className="question">
          Játékos {currentPlayer + 1}, szeretnél jegyet vásárolni?
        </p>
        <button className="steelroad-yes" onClick={travelToNextStop}>
          Igen
        </button>
        <button className="steelroad-no" onClick={handleNoTicket}>
          Bliccelek
        </button>
      </div>
      <button className="steelroad-close" onClick={onClose}>
        Bezárás
      </button>
    </div>
  );
};

export default Steelroad;
