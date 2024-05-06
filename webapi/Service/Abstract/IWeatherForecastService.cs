using webapi.models;
using webapi.ViewModels.Weather;

namespace webapi.Service.Abstract;

public interface IWeatherForecastService
{
    Task<WeatherForecastViewModel> GetWeatherForecast(string cityId);
}