using Newtonsoft.Json;
using webapi.models;
using webapi.Service.Abstract;
using webapi.ViewModels.Weather;

namespace webapi.Service;

public class WeatherForecastService : IWeatherForecastService
{
    private readonly IConfiguration _config;
    private readonly ILogger<WeatherForecastService> _logger;
    public WeatherForecastService(ILogger<WeatherForecastService> logger, IConfiguration config)
    {
        _config = config;
        _logger = logger;
    }
    
    public async Task<WeatherForecastViewModel> GetWeatherForecast(string cityId)
    {
        var section = _config.GetSection("OpenWeatherMap");
        var apiToken = section.GetValue<string>("ApiKey");
        var apiAddress = section.GetValue<string>("ApiUrl");
        string urlString = $"{apiAddress}/forecast?id={cityId}&units=metric&lang=ru&appid={apiToken}";

        using (HttpClient client = new HttpClient())
        {
            try
            {
                HttpResponseMessage response = await client.GetAsync(urlString);
                response.EnsureSuccessStatusCode();
                string result = await response.Content.ReadAsStringAsync();
                Root? root = JsonConvert.DeserializeObject<Root>(result);
                
                if (root == null)
                {
                    return new WeatherForecastViewModel();
                }
                
                TimeSpan offset = TimeSpan.FromSeconds(root.City.Timezone);
                double offsetInHours = offset.TotalHours;
                
                var model = new WeatherForecastViewModel
                {
                    Id = root.City.Id,
                    Name = root.City.Name,
                    Country = root.City.Country,
                    Population = root.City.Population,
                    Timezone = $"UTS + {offsetInHours}",
                    Sunrise = DateTimeOffset.FromUnixTimeSeconds(root.City.Sunrise).DateTime.ToString("dd-MM-yyyy HH:mm:ss") ,
                    Sunset = DateTimeOffset.FromUnixTimeSeconds(root.City.Sunset).DateTime.ToString("dd-MM-yyyy HH:mm:ss"),
                    Lat = root.City.Coord.Lat,
                    Lon = root.City.Coord.Lon,
                };
                
                var weatherRes = new List<WeatherForecast>();
                foreach (var item in root.List)
                {
                    var param = new WeatherForecast
                    {
                        DateTime = DateTimeOffset.FromUnixTimeSeconds(item.Dt).UtcDateTime.ToString("yyyy-MM-dd HH:mm:ss"),
                        Time = DateTimeOffset.FromUnixTimeSeconds(item.Dt).UtcDateTime.ToShortTimeString(),
                        Date = DateTimeOffset.FromUnixTimeSeconds(item.Dt).UtcDateTime.ToShortDateString(),
                        Temperature = item.Main.Temp,
                        FeelsLike = item.Main.FeelsLike,
                        Pressure = item.Main.Pressure,
                        Humidity = item.Main.Humidity,
                        WindSpeed = item.Wind.Speed,
                        WindDeg = item.Wind.Deg,
                        WindGust = item.Wind.Gust,
                    };
                    weatherRes.Add(param);
                }

                model.Params = weatherRes;

                return model;
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "Error while requesting weather data.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while processing weather data.");
            }
        }

        return new WeatherForecastViewModel();
    }
}