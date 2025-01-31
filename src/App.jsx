import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import './Fields.css'
import Fields from './Fields.jsx'
import Players from './Players.jsx'
import Sumasang from './Components/Sumasang.jsx'
import Lucky from './Components/Lucky.jsx'
import Steelroad from './Components/Steelroad.jsx'


function App() 
{
  const rollDice = () => Math.floor(Math.random() * 1) + 1;

  const [playerPositions, setPlayerPositions] = useState([0, 0, 0, 0]);

  const [playerMoney, setPlayerMoney] = useState([400000, 400000, 400000, 400000]);

  const [popupContent, setPopupContent] = useState(null);

  const [playerInventory, setPlayerInventory] = useState([[], [], [], []]);
  /*
  const openCheats = () =>
  {
    const cheatsMenu = document.querySelector(".cheats");
    cheatsMenu.style.display = "block";
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") 
    {
      openCheats();
    }
  });

  const closeCheats = () =>
  {
    const cheatsMenu = document.querySelector(".cheats");
    cheatsMenu.style.display = "none";
  }
  */
  
  const reducePlayerMoney = (playerIndex, amount) => 
    {
    setPlayerMoney((prevMoney) => {
      const updatedMoney = [...prevMoney];
      updatedMoney[playerIndex] -= amount;
  
      return updatedMoney;
    });
  };

  const addPlayerMoney = (playerIndex, amount) => 
    {
    setPlayerMoney((prevMoney) => {
      const updatedMoney = [...prevMoney];
      updatedMoney[playerIndex] += amount;
  
      return updatedMoney;
    });
  };

  const addItemToInventory = (playerIndex, item) => {
    setPlayerInventory((prevInventory) => {
      const updatedInventory = [...prevInventory];
      updatedInventory[playerIndex] = [...updatedInventory[playerIndex], item];
      return updatedInventory;
    });
  };
  
  const rollDiceAgain = () =>
  {
    setIsThrowButtonDisabled(false);
    rollDice();
  }

  const tpPlayer = (playerIndex, steps) => {
    setPlayerPositions((prevPositions) => {
      const newPositions = [...prevPositions];
      let currentPosition = newPositions[playerIndex];

      setPlayerPositions((prevPositions) => {
        const newPositions = [...prevPositions];
        newPositions[playerIndex] = currentPosition;
        return newPositions;
      });

      setTimeout(() => {

        let nextPosition = currentPosition;
  
        for (let i = 1; i <= steps; i++) {
          nextPosition = (nextPosition + 1) % fields.length;

          setPlayerPositions((prevPositions) => {
            const newPositions = [...prevPositions];
            newPositions[playerIndex] = nextPosition;
            return newPositions;
          });

          setActivePicture(newPositions[playerIndex] + 1);
          const currentField = fields[nextPosition];
          if (currentField.action) {
            currentField.action();
          }

          setActivePicture(nextPosition + 1);

          setPopupContent(
            <>
              <Lucky
                onClose={() => setPopupContent(null)}
                currentPlayer={currentPlayer}
                addPlayerMoney={addPlayerMoney}
                reducePlayerMoney={reducePlayerMoney}
                missRound={missRound}
              />
            </>
          );
        }
      }, 1000);
      return newPositions;
    });
  };

  const [currentPlayer, setCurrentPlayer] = useState(0); 
  const [missedRounds, setMissedRounds] = useState([0, 0, 0, 0] || []);
  const [round, setRound] = useState(1 || 0);  

  const missRound = (playerIndex) => {
    setMissedRounds((prevMissed) => {
      const updatedMissed = [...prevMissed];
      updatedMissed[playerIndex] = round + 1;
      return updatedMissed;
    });
  };
  
  useEffect(() => {
    console.log("Current Player:", currentPlayer + 1);
    console.log("Missed Rounds:", missedRounds);
    console.log("Current Round:", round);
  
    if (currentPlayer !== undefined && missedRounds.length > 0 && missedRounds[currentPlayer] >= round) {
      whosTurn();
      alert(`Bábu ${currentPlayer + 1} most nem dobhat.`);  
    }

    if (popupContent) 
    {
      setPopupContent(
        <>
          <div className='balance'>Egyenleg: {playerMoney[currentPlayer]} Ft</div>
          <img src="./src/Logos/Elza logo.png" className='elza'/>
          <Sumasang
            onClose={() => setPopupContent(null)}
            currentPlayer={currentPlayer} 
            addItemToInventory={addItemToInventory} 
            reducePlayerMoney={reducePlayerMoney} 
          />
        </>
      );
    }
  }, [round, currentPlayer, missedRounds, playerMoney]);

  const fields = 
  [
    {id: 0, name: "Start", x: 88.9, y: 80, action: () => addPlayerMoney(currentPlayer, 170000)},

    {id: 1, name: "Mezo 1", x: 71.5, y: 80},
    {id: 2, name: "Mezo 2", x: 64, y: 80, action: () => reducePlayerMoney(currentPlayer, 1500)},
    {id: 3, name: "Mezo 3", x: 56.5, y: 80},
    {id: 4, name: "Mezo 4", x: 48.9, y: 80, isStop: true},
    {id: 5, name: "Mezo 5", x: 41.3, y: 80},
    {id: 6, name: "Mezo 6", x: 33.9, y: 80},
    {id: 7, name: "Mezo 7", x: 26.4, y: 80},
    {id: 8, name: "Mezo 8", x: 18.9, y: 80, action: () => reducePlayerMoney(currentPlayer, 1500)},

    {id: 9, name: "Mezo 9", x: 4, y: 88},

    {id: 10, name: "Mezo 10", x: 8, y: 63, action: () => reducePlayerMoney(currentPlayer, 5000)},
    {id: 11, name: "Mezo 11", x: 8, y: 45, isStop: true},
    {id: 12, name: "Mezo 12", x: 8, y: 28},

    {id: 13, name: "Mezo 13", x: 8, y: 12, action: () => {tpPlayer(currentPlayer, 4)}},

    {id: 14, name: "Mezo 14", x: 18.9, y: 12},
    {id: 15, name: "Mezo 15", x: 26.4, y: 12},
    {id: 16, name: "Mezo 16", x: 33.9, y: 12},
    {id: 17, name: "Mezo 17", x: 41.3, y: 12},
    {id: 18, name: "Mezo 18", x: 48.9, y: 12, isStop: true},
    {id: 19, name: "Mezo 19", x: 56.5, y: 12, action: () => reducePlayerMoney(currentPlayer, 15000)},
    {id: 20, name: "Mezo 20", x: 64, y: 12},
    {id: 21, name: "Mezo 21", x: 71.5, y: 12},
    {id: 22, name: "Mezo 22", x: 79.2, y: 12, action: () => reducePlayerMoney(currentPlayer, 10000)},
    {id: 23, name: "Mezo 23", x: 88.9, y: 12, action: () => missRound(currentPlayer)},
    {id: 24, name: "Mezo 24", x: 88.9, y: 28},
    {id: 25, name: "Mezo 25", x: 88.9, y: 45, isStop: true},
    {id: 26, name: "Mezo 26", x: 88.9, y: 64, action: () => rollDiceAgain()},

    //{id: 27, name: "Börtön", x: 8, y: 80},
  ]

  const [isThrowButtonDisabled, setIsThrowButtonDisabled] = useState(false);
  //const [isNextButtonDisabled, setIsNextButtonDisabled] = useState(false);
  const [activePicture, setActivePicture] = useState(null);
  const [executedActions, setExecutedActions] = useState(new Array(fields.length).fill(false));

  const movePlayer = (playerIndex, steps) => 
    {  
    alert("Dobott szám: " + steps);
    setIsThrowButtonDisabled(true);
  
    setPlayerPositions((prevPositions) =>
      {
      const newPositions = [...prevPositions];
      const newPosition = (newPositions[playerIndex] + steps) % fields.length;
      newPositions[playerIndex] = newPosition;
  
      const currentField = fields[newPosition];
  
      if (currentField.action) {
        setExecutedActions((prev) => {
          if (!prev[newPosition]) {
            currentField.action();
            const updated = [...prev];
            updated[newPosition] = true;
            return updated;
          }
          return prev;
        });
      }

      if (newPositions[playerIndex] === 3) 
      {
        setPopupContent(
          <>
          <div className='balance'>Egyenleg: {playerMoney[currentPlayer]} Ft</div>
          <img src="./src/Logos/Elza logo.png" className='elza'/>
          <Sumasang
            onClose={() => setPopupContent(null)}
            currentPlayer={currentPlayer} 
            addItemToInventory={addItemToInventory} 
            reducePlayerMoney={reducePlayerMoney} 
          />
          </>
        );
      }
      
      if ([1,7,17].includes(newPositions[playerIndex])) 
      {
        setPopupContent(
          <>
            <h1 className='title'>Szerencsemező</h1>
            <Lucky
              onClose={() => setPopupContent(null)}
              currentPlayer={currentPlayer}
              addPlayerMoney={addPlayerMoney}
              reducePlayerMoney={reducePlayerMoney}
            />
          </>
        )
      }

      if ([4,11,18,25].includes(newPositions[playerIndex]))
      {
        setPopupContent(
        <>
        <Steelroad onClose={() => setPopupContent(null)}
          currentPlayer={currentPlayer} 
          reducePlayerMoney={reducePlayerMoney} 
          playerPositions={playerPositions} 
          setPlayerPositions={setPlayerPositions} 
          fields={fields}
        />
        </>
        )

      }
      setActivePicture(newPositions[playerIndex] + 1);
      return newPositions;
    });
  };

  const resetExecutedActions = () =>
  {
    setExecutedActions(new Array(fields.length).fill(false));
  };

  const whosTurn = () =>
  {
    resetExecutedActions();
    const nextPlayer = (currentPlayer + 1) % 4;
    
    if (nextPlayer === 0) {
      setRound((prevRound) => prevRound + 1);
    }

    setCurrentPlayer(nextPlayer);
    setIsThrowButtonDisabled(false);
  }

  const ActivatePictures = () => 
  {
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

  /*
  const handleSubmit = (event, prevPositions, playerIndex) => {
    event.preventDefault(); 
  
    const cheatCode = parseInt(document.querySelector(".cheatInput").value, 10);
    
    if (!isNaN(cheatCode)) {
      const newPositions = [...prevPositions];
      newPositions[playerIndex] += cheatCode;
      console.log("New Positions:", newPositions);
    }
  };
  */

  return (
    <div>
      <div className="game-board">
        <button className='throwButton' disabled={isThrowButtonDisabled} onClick={() => movePlayer(currentPlayer, rollDice())}>Dobás</button>
        {popupContent ? <>
          <div className="popup-wrapper" onClick={() => setPopupContent(null)}>
            <div className="popup-content" onClick={(e) => e.stopPropagation()}>
              {popupContent}
            </div>
          </div>
        </> : <></>}
        <div className="inventory">
          <p>Bábu {currentPlayer + 1}: {playerMoney[currentPlayer]} Ft</p>
          <ul>
            {playerInventory[currentPlayer].length > 0 ? (
              playerInventory[currentPlayer].map((item, index) => <li key={index}>{item}</li>)
            ) : (
              <li>Nincs vásárolt termék</li>
            )}
          </ul>
        </div>
        <button className='nextPlayer' onClick={() => whosTurn()}>Kör vége</button>
        <Fields/>
        <Players fields={fields} playerPositions={playerPositions} />
        {ActivatePictures()}
      </div>
    </div>
  );
};

export default App