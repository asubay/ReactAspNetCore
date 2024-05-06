using Microsoft.AspNetCore.Mvc;
using webapi.models;
using webapi.Service.Abstract;
using webapi.ViewModels.Weather;

namespace webapi.Controllers;

[ApiController]
[Route("api/weatherforecast")]
public class WeatherForecastController : ControllerBase
{
    private readonly IWeatherForecastService _service;

    public WeatherForecastController(IWeatherForecastService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<WeatherForecastViewModel> Get(string cityId="1520316")
    {
        return await _service.GetWeatherForecast(cityId);
    }
}
