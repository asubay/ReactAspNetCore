using Microsoft.AspNetCore.Mvc;
using webapi.models;
using webapi.Service.Abstract;

namespace webapi.Controllers;

[ApiController]
[Route("api/weatherforecast")]
public class WeatherForecastController : ControllerBase
{
    private readonly ILogger<WeatherForecastController> _logger;
    private readonly IWeatherForecastService _service;

    public WeatherForecastController(ILogger<WeatherForecastController> logger, IWeatherForecastService service)
    {
        _logger = logger;
        _service = service;
    }

    [HttpGet]
    public async Task<WeatherForecastViewModel> Get(string cityId="1520316")
    {
        return await _service.GetWeatherForecast(cityId);
    }
}
