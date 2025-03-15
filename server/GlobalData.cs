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
        Insurances = [],
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
                if (gameState.Players[gameState.CurrentPlayer].Inventory.Contains("car")) {
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

    public static readonly List<Insurance> INSURANCES = [
        new() {
            ID = "casco",
            Name = "CASCO",
            Price = 120_000
        },
        new() {
            ID = "accident",
            Name = "Balesetbiztosítás",
            Price = 100_000
        },
        new() {
            ID = "home",
            Name = "Lakásbiztosítás",
            Price = 1_000_000
        }
    ];

    public static readonly List<LuckyCard> LUCKY_CARDS = [
        new() {
            ID = "tipszmix",
            Text = "Tipszmixen 100 000 forintot nyertél.",
            Weight = 150,
            Action = (gameState, playerIndex) => {
                gameState.Players[playerIndex].Money += 100_000;
            }
        },
        new() {
            ID = "etterem",
            Text = "Étteremben ebédeltél, fizess 20 000 Ft-ot.",
            Weight = 150,
            Action = (gameState, playerIndex) => {
                gameState.Players[playerIndex].Money -= 20_000;
            }
        },
        new() {
            ID = "foci",
            Text = "Szeretsz focizni, ezért meglepted magad egy 20 000 Ft értékű Pumba cipővel.",
            Weight = 150,
            Action = (gameState, playerIndex) => {
                gameState.Players[playerIndex].Money -= 20_000;
            }
        },
        new() {
            ID = "tulora",
            Text = "Munkahelyeden túlóráztál, ezért kapsz 60 000 forintot.",
            Weight = 150,
            Action = (gameState, playerIndex) => {
                gameState.Players[playerIndex].Money += 60_000;
            }
        },
        new() {
            ID = "scam",
            Text = "Egy kétes megbízhatóságú weboldalon ingyen Sumasang P25 Ultrákat osztottak, neked csak meg kellett adnod a kártyaadataidat. Ellopták az összes pénzed.",
            Weight = 10,
            Action = (gameState, playerIndex) => {
                gameState.Players[playerIndex].Money = 0;
            }
        },
        new() {
            ID = "car-accident",
            Text = "Összetörted az autód. Ha nincs rá biztosításod, fizess 200 000 Ft-ot.",
            Weight = 150,
            Condition = (gameState, playerIndex) => gameState.Players[playerIndex].Inventory.Contains("car"),
            Action = (gameState, playerIndex) => {
                if (!gameState.Players[playerIndex].Insurances.Contains("casco")) {
                    gameState.Players[playerIndex].Money -= 200_000;
                }
            }
        },
        new() {
            ID = "accident",
            Text = "Balesetet szenvedtél. Ha nincs rá biztosításod, fizess a 50 000 Ft-ot.",
            Weight = 150,
            Action = (gameState, playerIndex) => {
                if (!gameState.Players[playerIndex].Insurances.Contains("accident")) {
                    gameState.Players[playerIndex].Money -= 50_000;
                }
            }
        },
        new() {
            ID = "house-fire",
            Text = "Kigyulladt a házad. Ha nincs rá biztosításod, fizess a 500 000 Ft-ot.",
            Weight = 40,
            Condition = (gameState, playerIndex) => gameState.Players[playerIndex].Inventory.Contains("house"),
            Action = (gameState, playerIndex) => {
                if (!gameState.Players[playerIndex].Insurances.Contains("home")) {
                    gameState.Players[playerIndex].Money -= 500_000;
                }
            }
        },
        new() {
            ID = "lottery",
            Text = "Vettél munkába menet egy kaparós sorsjegyet 5000 Forintért. ÉS MILYEN JÓL TETTED! LEKAPARTAD A FŐDÍJAT, AMI 25 000 000 FT!",
            Weight = 10,
            Action = (gameState, playerIndex) => {
                gameState.Players[playerIndex].Money += 25_000_000;
            }
        },
        new() {
            ID = "tax",
            Text = "Adóztál.",
            Weight = 40,
            Action = (gameState, playerIndex) => {
                gameState.Players[playerIndex].Money = (int)(gameState.Players[playerIndex].Money * 0.45);
            }
        }
    ];
}

