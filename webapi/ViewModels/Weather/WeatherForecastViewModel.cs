namespace webapi.ViewModels.Weather;

public class WeatherForecastViewModel
{
    public int Id { get; set; }
    public string Name { get; set; }
    public double Lat { get; set; }
    public double Lon { get; set; }
    public string Country { get; set; }
    public int Population { get; set; }
    public string Timezone { get; set; }
    public string Sunrise { get; set; }
    public string Sunset { get; set; }
    public List<WeatherForecast> Params { get; set; } = new List<WeatherForecast>();
}