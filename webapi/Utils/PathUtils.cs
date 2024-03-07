using System.Reflection;

namespace webapi.Utils;

public static class PathUtils
{
    public static string GetAppDir() {
        return Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
    }

    public static string GetStateDirectory() {
        var stateDir = Environment.GetEnvironmentVariable("STATE_DIRECTORY");
        if (string.IsNullOrEmpty(stateDir)) {
            stateDir = GetAppDir();
        }
        return Path.Join(stateDir, "data");
    }
}