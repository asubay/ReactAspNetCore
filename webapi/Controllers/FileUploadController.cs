using Microsoft.AspNetCore.Mvc;

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
}