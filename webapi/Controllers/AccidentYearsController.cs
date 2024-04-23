using Microsoft.AspNetCore.Mvc;
using webapi.models;

namespace webapi.Controllers;

[ApiController]
[Route("[controller]")]
public class AccidentYearsController : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(List<CustomSelectResponse>), 200)]
    public async Task<List<CustomSelectResponse>> GetYearsList()
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

        return years;
    }
}