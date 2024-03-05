using webapi.models;

namespace webapi.Service.Abstract;

public interface IWeatherForecastService
{
    Task<WeatherForecastViewModel> GetWeatherForecast(string cityId);
}