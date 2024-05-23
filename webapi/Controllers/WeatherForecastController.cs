using Microsoft.AspNetCore.Mvc;
using webapi.models;
using webapi.Service.Abstract;
using webapi.ViewModels.Weather;

namespace webapi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WeatherForecastController : ControllerBase
{
    private readonly IWeatherForecastService _service;

    public WeatherForecastController(IWeatherForecastService service)
    {
        _service = service;
    }

    /// <summary>Получить данные о рогнозе погоды на пять дней</summary>
    [HttpGet]
    public async Task<WeatherForecastViewModel> Get(string cityId="1520316")
    {
        return await _service.GetWeatherForecast(cityId);
    }
}
