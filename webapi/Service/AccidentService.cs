using webapi.Service.Abstract;
using webapi.Utils;

namespace webapi.Service;

public class AccidentService : IAccidentService
{
    public async Task<string> GetAccidentDataPath()
    {
        var appRootPath = PathUtils.GetStateDirectory();
        var filePathName = Path.Combine(appRootPath, "files", "export.json");
        var path = Path.Combine(appRootPath, filePathName);
        if (!string.IsNullOrEmpty(path)) {
            return path;
        }

        return string.Empty;
    }
}