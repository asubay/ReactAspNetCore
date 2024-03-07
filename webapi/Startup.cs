using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using webapi.Service;
using webapi.Service.Abstract;
using Serilog;
using webapi.Data;

namespace webapi;

public class Startup
{
    private IConfiguration Configuration { get; }
    
    public Startup(IConfiguration configuration)
    {
        Configuration = configuration;
    }
    
    public void ConfigureServices(IServiceCollection services) //контейнер, в котором вы регистрируются службы
    {
        AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
        
        var connString = Configuration.GetConnectionString(Configuration["ConnectionStrings"]);
        
        services.AddDbContext<ApplicationDbContext>(options => options
                .UseNpgsql(connString)
                
        );
        
        services.AddIdentity<IdentityUser, IdentityRole>()
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();
        
        services.AddControllers();
        services.AddEndpointsApiExplorer(); //используется для регистрации сервиса, который предоставляет информацию об обнаруженных конечных точках (endpoints)
        services.AddSwaggerGen();
        services.AddScoped<IWeatherForecastService, WeatherForecastService>(); // Регистрация службы с жизненным циклом Scoped
        services.AddScoped<IAccidentService, AccidentService>();
    }
    
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        if (env.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }
        else
        {
            app.UseExceptionHandler("/Error");
            app.UseHsts();
        }

        app.UseStaticFiles(); // Позволяет обслуживать статические файлы из wwwroot

        app.Use(async (context, next) =>
        {
            await next(); // Передача запроса далее по конвейеру
        });

        app.UseHttpsRedirection();
        app.UseAuthorization();
        app.UseRouting();
        app.UseSerilogRequestLogging(); 

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers(); // Позволяет обслуживать API-маршруты
        });
    }
}