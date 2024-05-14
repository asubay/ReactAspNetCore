using System.Reflection;

namespace webapi.Utils;

public static class PathUtils
{
    public static string GetAppDir() {
        var location = Assembly.GetEntryAssembly()?.Location;

        if (string.IsNullOrEmpty(location)) {
            throw new InvalidOperationException("entry assembly not found or its location is empty");
        }

        return Path.GetDirectoryName(location)
               ?? throw new InvalidOperationException("app directory not found");
    }

    public static string GetStateDirectory(string subDir) {
        var root = Environment.GetEnvironmentVariable("STATE_DIRECTORY") ??
                   GetAppDir();

        var dir = Path.Join(root, subDir);
        if (!Directory.Exists(dir)) {
            Directory.CreateDirectory(dir);
        }
        return dir;
    }
}