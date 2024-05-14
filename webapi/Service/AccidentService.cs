using webapi.Service.Abstract;
using webapi.Utils;

namespace webapi.Service;

public class AccidentService : IAccidentService
{
    public async Task<string> GetAccidentDataPath()
    {
        var appRootPath = PathUtils.GetStateDirectory("files");
        var filePathName = Path.Combine(appRootPath, "export.json");
        var path = Path.Combine(appRootPath, filePathName);
        if (!string.IsNullOrEmpty(path)) {
            return path;
        }

        return string.Empty;
    }
}