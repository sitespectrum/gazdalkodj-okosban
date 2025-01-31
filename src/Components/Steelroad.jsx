import React, { useState } from 'react';

const Steelroad = ({ onClose, currentPlayer, playerPositions, setPlayerPositions, fields, reducePlayerMoney }) => {
  const [visitedStops, setVisitedStops] = useState(new Set());

  const travelToNextStop = () => {
    setPlayerPositions((prevPositions) => {
      const newPositions = [...prevPositions];
      let nextStop = (newPositions[currentPlayer] + 1) % fields.length;
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
      setVisitedStops((prevVisited) => new Set([...prevVisited, nextStop]));
      return newPositions;
    });

    reducePlayerMoney(currentPlayer, 3000);
    onClose();
  };

  const handleNoTicket = () => {
    setPlayerPositions((prevPositions) => {
      const newPositions = [...prevPositions];
      let nextStop = (newPositions[currentPlayer] + 1) % fields.length;
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
      return newPositions;
    });

    const shouldFine = Math.random();
    if (shouldFine < 0.9) {
      reducePlayerMoney(currentPlayer, 20000);
      alert(`Bábu ${currentPlayer + 1} büntetést kapott! 20000 Ft levonva.`);
    }


    onClose();
  };

  const currentPosition = playerPositions[currentPlayer];
  const canTravel = fields[currentPosition]?.isStop || false;

  return (
    <div className="steelroad">
      <h2>Utazás a következő megállóra</h2>
      <p>Bábu {currentPlayer + 1}, szeretnél jegyet vásárolni és utazni?</p>
      <div className="steelroad-buttons">
        <button className="steelroad-yes" onClick={travelToNextStop}>Igen</button>
        <button className="steelroad-no" onClick={handleNoTicket}>Nem</button>
      </div>
      <button className="steelroad-close" onClick={onClose}>Bezárás</button>
    </div>
  );
};

export default Steelroad;
