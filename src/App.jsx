import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import './Fields.css'
import Fields from './Fields.jsx'
import Players from './Players.jsx'

function App() 
{
  const rollDice = () => Math.floor(Math.random() * 6) + 1;

  const [playerPositions, setPlayerPositions] = useState([0, 0, 0, 0]);

  const [playerMoney, setPlayerMoney] = useState([170000, 170000, 170000, 170000]);

  const reducePlayerMoney = (playerIndex, amount) => {
    setPlayerMoney((prevMoney) => {
      const updatedMoney = [...prevMoney];
      updatedMoney[playerIndex] -= amount;
  
      return updatedMoney;
    });
  };
  

  const fields = 
  [
    {id: 0, name: "Start", x: 88.9, y: 80},

    {id: 1, name: "Mezo 1", x: 71.5, y: 80},
    {id: 2, name: "Mezo 2", x: 64, y: 80, action: () => reducePlayerMoney(currentPlayer, 1500)},
    {id: 3, name: "Mezo 3", x: 56.5, y: 80},
    {id: 4, name: "Mezo 4", x: 48.9, y: 80},
    {id: 5, name: "Mezo 5", x: 41.3, y: 80},
    {id: 6, name: "Mezo 6", x: 33.9, y: 80},
    {id: 7, name: "Mezo 7", x: 26.4, y: 80},
    {id: 8, name: "Mezo 8", x: 18.9, y: 80},

    {id: 9, name: "Mezo 9", x: 4, y: 88},

    {id: 10, name: "Mezo 10", x: 8, y: 63, action: () => reducePlayerMoney(currentPlayer, 5000)},
    {id: 11, name: "Mezo 11", x: 8, y: 45},
    {id: 12, name: "Mezo 12", x: 8, y: 28},

    {id: 13, name: "Mezo 13", x: 8, y: 12},

    {id: 14, name: "Mezo 14", x: 18.9, y: 12},
    {id: 15, name: "Mezo 15", x: 26.4, y: 12},
    {id: 16, name: "Mezo 16", x: 33.9, y: 12},
    {id: 17, name: "Mezo 17", x: 41.3, y: 12},
    {id: 18, name: "Mezo 18", x: 48.9, y: 12},
    {id: 19, name: "Mezo 19", x: 56.5, y: 12, action: () => reducePlayerMoney(currentPlayer, 15000)},
    {id: 20, name: "Mezo 20", x: 64, y: 12},
    {id: 21, name: "Mezo 21", x: 71.5, y: 12},
    {id: 22, name: "Mezo 22", x: 79.2, y: 12, action: () => reducePlayerMoney(currentPlayer, 10000)},
    {id: 23, name: "Mezo 23", x: 88.9, y: 12},
    {id: 24, name: "Mezo 24", x: 88.9, y: 28},
    {id: 25, name: "Mezo 25", x: 88.9, y: 45},
    {id: 26, name: "Mezo 26", x: 88.9, y: 64},

    //{id: 27, name: "Börtön", x: 8, y: 80},
  ]

  const [isThrowButtonDisabled, setIsThrowButtonDisabled] = useState(false);
  //const [isNextButtonDisabled, setIsNextButtonDisabled] = useState(false);
  const [activePicture, setActivePicture] = useState(null);

  const movePlayer = (playerIndex, steps) => {
    alert("Kör eleje: Bábu " + (playerIndex + 1));
    alert("Dobott szám: " + steps);
    setIsThrowButtonDisabled(true);
  
    setPlayerPositions((prevPositions) => {
      const newPositions = [...prevPositions];
      const newPosition = (newPositions[playerIndex] + steps) % fields.length;
      newPositions[playerIndex] = newPosition;
  
      const newField = fields[newPosition];
  
      // Ellenőrizzük, hogy az akció még nem lett végrehajtva
      if (newField.action && !newField.hasActionBeenExecuted) {
        newField.action();
        // Jelöljük, hogy az akció már végrehajtásra került
        newField.hasActionBeenExecuted = true;
      }
  
      setActivePicture(newPositions[playerIndex] + 1);
      return newPositions;
    });
  };
  

  const [currentPlayer, setCurrentPlayer] = useState(0);

  const whosTurn = () =>
  {
    const nextPlayer = (currentPlayer + 1) % 4;
    //alert("Kör vége: Bábu " + (nextPlayer + 1));
    setCurrentPlayer(nextPlayer);
    setIsThrowButtonDisabled(false);
  }

  const ActivatePictures = () => {
    return activePicture !== null ? (
      <div className="div">
        <img 
          src={`./src/HQ Pictures/${activePicture}. Mező.png`} 
          alt={`${activePicture}. Mező`} 
          className={`field-pic field-${activePicture}`}
        />
      </div>
    ) : null;
  };

  return (
    <div>
      <div className="game-board">
        <button className='throwButton' disabled={isThrowButtonDisabled} onClick={() => movePlayer(currentPlayer, rollDice())}>Dobás</button>
        <button className='nextPlayer' onClick={() => whosTurn()}>Kör vége</button>
        <p className='playermoney'>Bábu {currentPlayer + 1}: {playerMoney[currentPlayer]} Ft</p>
        <Fields/>
        <Players fields={fields} playerPositions={playerPositions} />
        {ActivatePictures()}
      </div>
    </div>
  );
};

export default App