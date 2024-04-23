namespace webapi.models;

public class WeatherForecast
{
    public string DateTime { get; set; }
    public string Time { get; set; }
    public string Date { get; set; }

    public double Temperature { get; set; }
    public double FeelsLike { get; set; }
    public int Pressure { get; set; }

    public int Humidity { get; set; }
    public double WindSpeed { get; set; }
    public int WindDeg { get; set; }
    public double WindGust { get; set; }
}

public class Main
{
    public double Temp { get; set; }
    public double FeelsLike { get; set; }
    public double TempMin { get; set; }
    public double TempMax { get; set; }
    public int Pressure { get; set; }
    public int SeaLevel { get; set; }
    public int GrndLevel { get; set; }
    public int Humidity { get; set; }
    public double TempKf { get; set; }
}

public class Weather
{
    public int Id { get; set; }
    public string Main { get; set; }
    public string Description { get; set; }
    public string Icon { get; set; }
}

public class Clouds
{
    public int All { get; set; }
}

public class Wind
{
    public double Speed { get; set; }
    public int Deg { get; set; }
    public double Gust { get; set; }
}

public class Sys
{
    public string Pod { get; set; }
}

public class ListItem
{
    public int Dt { get; set; }
    public Main Main { get; set; }
    public List<Weather> Weather { get; set; }
    public Clouds Clouds { get; set; }
    public Wind Wind { get; set; }
    public int Visibility { get; set; }
    public double Pop { get; set; }
    public Sys Sys { get; set; }
    public DateTime DtTxt { get; set; }
}

public class City
{
    public int Id { get; set; }
    public string Name { get; set; }
    public Coord Coord { get; set; }
    public string Country { get; set; }
    public int Population { get; set; }
    public int Timezone { get; set; }
    public int Sunrise { get; set; }
    public int Sunset { get; set; }
}

public class Coord
{
    public double Lat { get; set; }
    public double Lon { get; set; }
}

public class Root
{
    public string Cod { get; set; }
    public int Message { get; set; }
    public int Cnt { get; set; }
    public List<ListItem> List { get; set; }
    public City City { get; set; }
}