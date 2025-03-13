namespace server;

public static class GlobalData {
    public static readonly List<Game> Games = [];

    public static readonly Player DefaultPlayer = new() {
        ID = "player-0",
        Index = 0,
        Name = "Player 1",
        Image = "/src/Pictures/Puppets/Piros bábú 1.png",
        Money = 400_000,
        Position = 0,
        Inventory = [],
        HasCar = false,
        HasCASCO = false,
        HasAccIns = false,
        HasHomeIns = false,
        InHospital = false,
        InJail = false,
        CanRollDice = true,
        CanEndTurn = false,
        State = "justStarted",
        RolledDice = null,
        RollingDice = false,
    };

    public static readonly Field[] FIELDS = [
        new() {
            ID = 0,
            Name = "Start",
            IsActionInstant = true,
            Action = (gameState) => {
                gameState.Players[gameState.CurrentPlayer].Money += 170_000;
            }
        },

        new() { ID = 1, Name = "Lucky 1" },
        new() {
            ID = 2,
            Name = "Trash",
            IsActionInstant = true,
            Action = (gameState) => {
                gameState.Players[gameState.CurrentPlayer].Money -= 1500;
            }
        },
        new() { ID = 3, Name = "Elza" },
        new() { ID = 4, Name = "South Station", IsStop = true },
        new() { ID = 5, Name = "Bank Robbery" },
        new() { ID = 6, Name = "Elza and Idea" },
        new() { ID = 7, Name = "Lucky 2" },
        new() {
            ID = 8,
            Name = "Smoking",
            IsActionInstant = true,
            Action = (gameState) => {
                gameState.Players[gameState.CurrentPlayer].Money -= 1500;
            }
        },

        new() { ID = 9, Name = "Jail (visiting)" },

        new() {
            ID = 10,
            Name = "Movie Theater",
            IsActionInstant = true,
            Action = (gameState) => {
                gameState.Players[gameState.CurrentPlayer].Money -= 5000;
            }
        },
        new() { ID = 11, Name = "West Station", IsStop = true },
        new() { ID = 12, Name = "Casino" },

        new() {
            ID = 13,
            Name = "Airport",
            IsActionInstant = false,
            Action = (gameState) => {
                gameState.Players[gameState.CurrentPlayer].Position += 4;
                var newField = FIELDS?[gameState.Players[gameState.CurrentPlayer].Position];
                gameState.Players[gameState.CurrentPlayer].State = newField?.IsActionInstant ?? false
                    ? "actionEnded"
                    : "actionStarted";

                newField?.Action?.Invoke(gameState);
            }
        },

        new() { ID = 14, Name = "Bob the Builder" },
        new() { ID = 15, Name = "Car Shop" },
        new() {
            ID = 16,
            Name = "Car travel",
            IsActionInstant = false,
            Action = (gameState) => {
                if (gameState.Players[gameState.CurrentPlayer].HasCar) {
                    gameState.Players[gameState.CurrentPlayer].Position += 10;
                    var newField = FIELDS?[gameState.Players[gameState.CurrentPlayer].Position];
                    gameState.Players[gameState.CurrentPlayer].State = newField?.IsActionInstant ?? false
                        ? "actionEnded"
                        : "actionStarted";

                    newField?.Action?.Invoke(gameState);
                }
            }
        },
        new() { ID = 17, Name = "Lucky 3" },
        new() { ID = 18, Name = "North Station", IsStop = true },
        new() {
            ID = 19,
            Name = "Abidas",
            IsActionInstant = true,
            Action = (gameState) => {
                gameState.Players[gameState.CurrentPlayer].Money -= 15_000;
            }
        },
        new() { ID = 20, Name = "Idea" },
        new() { ID = 21, Name = "Bank 4" },
        new() {
            ID = 22,
            Name = "ABC",
            IsActionInstant = true,
            Action = (gameState) => {
                gameState.Players[gameState.CurrentPlayer].Money -= 10_000;
            }
        },

        new() { ID = 23, Name = "Hospital", IsActionInstant = true,
            Action = (gameState) => {
                gameState.Players[gameState.CurrentPlayer].InHospital = true;
                gameState.Players[gameState.CurrentPlayer].CanRollDice = false;
            }
        },

        new() { ID = 24, Name = "Insurance" },
        new() { ID = 25, Name = "East Station", IsStop = true },
        new() { ID = 26, Name = "Roll again", IsActionInstant = true,
            Action = (gameState) => {
                gameState.Players[gameState.CurrentPlayer].CanRollDice = true;
                gameState.Players[gameState.CurrentPlayer].RollingDice = false;
                gameState.Players[gameState.CurrentPlayer].RolledDice = null;
            }
        },

        new() { ID = 27, Name = "Jail (locked up)" }
    ];

    public static readonly Dictionary<string, ShopItem> PURCHASEABLE_ITEMS = new() {
        ["house"] = new() {
            ID = "house",
            Name = "Ház",
            Price = 25_000_000
        },
        ["car"] = new() {
            ID = "car",
            Name = "Autó",
            Price = 1_000_000,
            Optional = true
        },
        ["tv"] = new() {
            ID = "tv",
            Name = "Sumasang 4K TV",
            Price = 119_990
        },
        ["washingMachine"] = new() {
            ID = "washingMachine",
            Name = "GL előltöltős mosógép",
            Price = 99_990
        },
        ["dryer"] = new() {
            ID = "dryer",
            Name = "Boss előltöltős szárítógép",
            Price = 129_990
        },
        ["fridge"] = new() {
            ID = "fridge",
            Name = "Görénye alulfagyasztós hűtő",
            Price = 84_990
        },
        ["dishwasher"] = new() {
            ID = "dishwasher",
            Name = "Kendi mosogatógép",
            Price = 109_990
        },
        ["vacuumCleaner"] = new() {
            ID = "vacuumCleaner",
            Name = "Dájszon porszívó",
            Price = 124_990
        },
        ["kitchenFurniture"] = new() {
            ID = "kitchenFurniture",
            Name = "Konyhabútor",
            Price = 549_990
        },
        ["livingRoomFurniture"] = new() {
            ID = "livingRoomFurniture",
            Name = "Szobabútor",
            Price = 999_990
        },
        ["bathroomFurniture"] = new() {
            ID = "bathroomFurniture",
            Name = "Fürdőszobabútor",
            Price = 349_990
        }
    };
}

