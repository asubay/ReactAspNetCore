using Serilog;
using webapi;

public static class Program
{
    public static void Main(string[] args)
    {
        CreateHostBuilder(args).Build().Run(); // создание и запуск веб-хоста
    }

    private static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
            .UseSerilog((context, services, conf) => {
                conf
                    .ReadFrom.Configuration(context.Configuration)
                    .ReadFrom.Services(services)
                    .Enrich.FromLogContext();
            })
            .ConfigureWebHostDefaults(webBuilder =>
            {
                webBuilder.UseStartup<Startup>(); // Загрузка класса Startup
            });
}