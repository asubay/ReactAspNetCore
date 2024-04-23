using Newtonsoft.Json;
using webapi.models;
using webapi.Service.Abstract;

namespace webapi.Service;

public class WeatherForecastService : IWeatherForecastService
{
    private readonly IConfiguration _config;
    public WeatherForecastService(IConfiguration config)
    {
        _config = config;
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
                if (response.IsSuccessStatusCode)
                {
                    string result = await response.Content.ReadAsStringAsync();
                    Root root = JsonConvert.DeserializeObject<Root>(result);
                    
                    TimeSpan offset = TimeSpan.FromSeconds(root.City.Timezone);
                    double offsetInHours = offset.TotalHours;
                    TimeZoneInfo timeZone = TimeZoneInfo.CreateCustomTimeZone("Custom Time Zone", offset, "Custom Time Zone", "Custom Time Zone");
                    if (root!=null)
                    {
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
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception: {ex.Message}");
            }
        }

        return new WeatherForecastViewModel();
    }
}