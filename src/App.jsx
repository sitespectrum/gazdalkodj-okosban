import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import './Fields.css'
import Fields from './Fields.jsx'
import Players from './Players.jsx'
import Elza from './Components/Elza.jsx'
import Lucky from './Components/Lucky.jsx'
import Steelroad from './Components/Steelroad.jsx'
import Idea from './Components/Idea.jsx'
import ElzaAndIdea from './Components/ElzaAndIdea.jsx'
import Casino from './Components/Casino.jsx'
import Cheats from './Components/Cheats.jsx'
import Carshop from './Components/Carshop.jsx'


function App() 
{
  const rollDice = () => Math.floor(Math.random() * 6) + 1;

  const [playerPositions, setPlayerPositions] = useState([0, 0, 0, 0]);

  const [playerMoney, setPlayerMoney] = useState([1200000, 1200000, 1200000, 1200000]);

  const [popupContent, setPopupContent] = useState(null);

  const [playerInventory, setPlayerInventory] = useState([[], [], [], []]);

  const [playerHasCar, setPlayerHasCar] = useState([0, 0, 0, 0]);

  const updatePlayerHasCar = (playerIndex) => {
    setPlayerHasCar((prev) => {
      const updated = [...prev];
      updated[playerIndex] = 1;
      return updated;
    });
  };

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

  const tpPlayerCar = (playerIndex, steps, playerHasCar) => {
    if (playerHasCar[playerIndex] === 1) {
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
          }
        }, 1000);
        return newPositions;
      });
    }

    else {
      return;
    }
  };

  const tpPlayerPlane = (playerIndex, steps) => {
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

          setPopupClass("lucky");
          setPopupContent(
            <>
              <h1 className='title'>Szerencsemező</h1>
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

    {id: 13, name: "Mezo 13", x: 8, y: 12, action: () => {tpPlayerPlane(currentPlayer, 4)}},

    {id: 14, name: "Mezo 14", x: 18.9, y: 12},
    {id: 15, name: "Mezo 15", x: 26.4, y: 12},
    {id: 16, name: "Mezo 16", x: 33.9, y: 12, action: () => {tpPlayerCar(currentPlayer, 10, playerHasCar)}},
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

    //{id: 32, name: "Börtön", x: 8, y: 80},
  ]

  const [isThrowButtonDisabled, setIsThrowButtonDisabled] = useState(false);
  //const [isNextButtonDisabled, setIsNextButtonDisabled] = useState(false);
  const [activePicture, setActivePicture] = useState(null);
  const [executedActions, setExecutedActions] = useState(new Array(fields.length).fill(false));
  const [popupClass, setPopupClass] = useState(null);

  const movePlayer = (playerIndex, steps) => 
    {  
    alert("Dobott szám: " + steps);
    setIsThrowButtonDisabled(true);
  
    setPlayerPositions((prevPositions) =>
      {
        const newPositions = [...prevPositions];
        let newPosition = newPositions[playerIndex] + steps;
        
        const crossedStart = newPosition > 27;
        
        newPosition = newPosition % 27;
        
        if (crossedStart) {
          console.log(`Pénz hozzáadva a ${currentPlayer}. játékosnak`);
          addPlayerMoney(currentPlayer, 150000);
        }
        
        newPositions[playerIndex] = newPosition; 
        setPlayerPositions(newPositions);
        
  
        const currentField = fields[newPosition];

        if (currentField?.action) {
          setExecutedActions((prev) => {
            const updated = [...prev];
        
            if (!updated[newPosition]) {
              updated[newPosition] = true; 
              currentField.action();
            }
        
            return updated;
          });
        }
        
      if (newPositions[playerIndex] === 3) 
      {
        setPopupClass("elza");
        setPopupContent(
          <>
          <div className='balance'>Egyenleg: {playerMoney[currentPlayer]} Ft</div>
          <img src="./src/Logos/Elza logo.png" className='elza'/>
          <Elza
            onClose={() => setPopupContent(null)}
            currentPlayer={currentPlayer} 
            addItemToInventory={addItemToInventory} 
            reducePlayerMoney={reducePlayerMoney}
            playerMoney={playerMoney}
            setPlayerMoney={setPlayerMoney}
          />
          </>
        );
      }
      
      if (newPositions[playerIndex] === 1 || newPositions[playerIndex] === 7 || newPositions[playerIndex] === 17)
      {
        setPopupClass("lucky");
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

      if ((newPositions[playerIndex]) === 4 || (newPositions[playerIndex]) === 11 || (newPositions[playerIndex]) === 18 || (newPositions[playerIndex]) === 25)
      {
        setPopupClass("steelroad");
        setPopupContent(
        <>
        <img src="./src/Logos/MKV logo.png" className='steelroad-logo'/>
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

      if (newPositions[playerIndex] === 20)
      {
        setPopupClass("idea");
        setPopupContent(
          <>
          <img src="./src/Logos/Idea logo.png" className='idea-logo'/>
          <Idea 
            onClose={() => setPopupContent(null)}
            currentPlayer={currentPlayer}
            addItemToInventory={addItemToInventory} 
            reducePlayerMoney={reducePlayerMoney} 
          />
          </>
        )
      }

      if (newPositions[playerIndex] === 6)
      {
        setPopupClass("elzaandidea");
        setPopupContent(
          <>
          <h1 className='eai-title'>Bevásárlóközpont</h1>
          <ElzaAndIdea
            onClose={() => setPopupContent(null)}
            currentPlayer={currentPlayer} 
            addItemToInventory={addItemToInventory} 
            reducePlayerMoney={reducePlayerMoney}
          />
          </>
        )
      }

      if (newPositions[playerIndex] === 15)
      {
        setPopupClass("carshop");
        setPopupContent(
          <>
          <h1 className='car-title'>Autóvásárlás</h1>
            <Carshop
              onClose={() => setPopupContent(null)}
              currentPlayer={currentPlayer}
              reducePlayerMoney={reducePlayerMoney}
              playerMoney={playerMoney}
              updatePlayerHasCar={updatePlayerHasCar}
            />
          </>
        )
      }

      if (newPositions[playerIndex] === 12) 
        {
          setPopupContent(
            <>
            <Casino
              onClose={() => setPopupContent(null)}
              currentPlayer={currentPlayer}
              reducePlayerMoney={reducePlayerMoney}
              addPlayerMoney={addPlayerMoney}
              playerMoney={playerMoney}
            >
              <div key={currentPlayer} className='balance'>Egyenleg: {playerMoney[currentPlayer]} Ft</div>
            </Casino>
            </>
          );
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
          <div className={`popup-wrapper-${popupClass}`} onClick={() => setPopupContent(null)}>
            <div className={`popup-content-${popupClass}`} onClick={(e) => e.stopPropagation()}>
              {popupContent}
            </div>
          </div>
        </> : <></>}
        <div className="inventory">
          <p>Játékos {currentPlayer + 1}: {playerMoney[currentPlayer]} Ft</p>
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