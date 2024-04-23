using Microsoft.AspNetCore.Mvc;
using webapi.Service.Abstract;

namespace webapi.Controllers;

[ApiController]
[Route("[controller]")]
public class AccidentController : ControllerBase
{
    private readonly IAccidentService _service;

    public AccidentController(IAccidentService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAccidentData()
    {
        string path = await _service.GetAccidentDataPath();
        if (!string.IsNullOrEmpty(path)) {
            if (System.IO.File.Exists(path))
            {
                string jsonContent = await System.IO.File.ReadAllTextAsync(path);
                return Content(jsonContent, "application/json");
            }
        }
        return NotFound("JSON file not found");
    }
}