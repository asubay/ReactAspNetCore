using Microsoft.AspNetCore.Mvc;
using webapi.models;
using webapi.Service.Abstract;

namespace webapi.Controllers;

[ApiController]
[Route("[controller]")]
public class WeatherForecastController : ControllerBase
{
    private readonly ILogger<WeatherForecastController> _logger;
    private readonly IWeatherForecastService _service;

    public WeatherForecastController(ILogger<WeatherForecastController> logger, IWeatherForecastService service)
    {
        _logger = logger;
        _service = service;
    }

    [HttpGet(Name = "GetWeatherForecast")]
    public async Task<WeatherForecastViewModel> Get(string cityId="1520316")
    {
        return await _service.GetWeatherForecast(cityId);
         
        // return new WeatherForecastViewModel
        // {
        //     Country = "KZ",
        //     Name = "Y-Ka",
        //     Timezone = "UTS + 6",
        //     Lat = 49.966701,
        //     Lon = 82.616699
        // };
    }
}
