const Players = ({fields, playerPositions }) => 
  {
    const playerImages = 
    [
      "./src/Pictures/Puppets/Piros bábú 1.png",
      "./src/Pictures/Puppets/Kék bábú 1.png",
      "./src/Pictures/Puppets/Zöld bábú 1.png",
      "./src/Pictures/Puppets/Sárga bábú 1.png",
    ];
  
    return (
      <div className="players">
        {playerPositions.map((position, index) => {
        const field = fields[position];
        return (
          <img
            key={index}
            src={playerImages[index]}
            alt={`Bábu ${index + 1}`}
            className="player"
            style={{
              position: "absolute",
              left: `${field.x}%`,
              top: `${field.y}%`,
              width: "2%",
            }}
          />
        );
      })}
      </div>
    );
  };
  
  export default Players;
  