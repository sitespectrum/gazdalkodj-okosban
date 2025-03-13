namespace server;

public static class Utils {
    public static string MakeID(int length = 8) {
        var result = "";
        var characters = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789";
        var counter = 0;
        while (counter < length) {
            result += characters[Random.Shared.Next(characters.Length)];
            counter++;
        }
        return result;
    }
}