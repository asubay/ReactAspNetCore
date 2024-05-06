using Microsoft.AspNetCore.Mvc;
using webapi.models;
using webapi.Utils;

namespace webapi.Controllers;

[ApiController]
[Route("api/files")]
public class FileUploadController : ControllerBase
{
    private readonly ILogger<AuthController> _logger;
    public FileUploadController(ILogger<AuthController> logger)
    {
        _logger = logger;
    }
    
    [HttpPost("UploadFile")]
    public async Task<List<UploadFileModel>?> UploadFile()
    {
        try
        {
            var files = Request.Form.Files;
            if (files.Count==0)
            {
                return null;
            }
            var res = new List<UploadFileModel>();
            var filePath = Path.Combine("uploads", "files"); 
            foreach (var file in files)
            {
                if (file.Length > 0)
                {
                    string uploadFolder = Path.Combine(PathUtils.GetStateDirectory(), filePath);
                    string fileName = Guid.NewGuid() + "__" + file.FileName.Replace(",", "_");
                    
                    if (!Directory.Exists(uploadFolder)) {
                        Directory.CreateDirectory(uploadFolder);
                    }

                    await using var fileStream = new FileStream(Path.Combine(uploadFolder, 
                        Guid.NewGuid() + "__" + fileName), FileMode.OpenOrCreate);
                    
                    await file.CopyToAsync(fileStream);
                    
                    UploadFileModel model = new UploadFileModel
                    {
                        FileName = file.FileName.Replace(",", "_"),
                        FilePath = filePath,
                        UniqueName = fileName
                    };
                    res.Add(model);
                }
            }
            return res;
        }
        catch (Exception ex)
        {
            _logger.LogWarning("Internal server error: {Ex}", ex);
            return null;
        }
    }
}