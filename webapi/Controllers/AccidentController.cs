using Microsoft.AspNetCore.Mvc;
using webapi.models;
using webapi.Service.Abstract;

namespace webapi.Controllers;

[ApiController]
[Route("api/accident")]
public class AccidentController : ControllerBase
{
    private readonly IAccidentService _service;

    public AccidentController(IAccidentService service)
    {
        _service = service;
    }

    [HttpGet("GetAccidentData")]
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
    
    [HttpGet("GenerateYears")]
    [ProducesResponseType(typeof(List<CustomSelectResponse>), 200)]
    public Task<List<CustomSelectResponse>> GetYearsList()
    {
        var years = new List<CustomSelectResponse>();
        for (int i = 2015; i < 2025; i++)
        {
            var year = new CustomSelectResponse
            {
                Key = i,
                Value = i.ToString()
            };
            years.Add(year);
        }

        return Task.FromResult(years);
    }
}