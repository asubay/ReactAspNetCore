using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using webapi.Service;
using webapi.Service.Abstract;
using Serilog;
using webapi.Data;
using webapi.Initialization;

namespace webapi;

public class Startup
{
    private IConfiguration Configuration { get; }
    
    public Startup(IConfiguration configuration)
    {
        Configuration = configuration;
    }
    
    public void ConfigureServices(IServiceCollection services)
    {
        ConfigureDependencyInjection(services);
        ConfigureDatabase(services);
        
        services.AddStackExchangeRedisCache(options =>
        {
            options.Configuration = Configuration.GetConnectionString("Redis");
        });
        
        services.AddSession(options =>
        {
            options.IdleTimeout = TimeSpan.FromMinutes(60);
            options.Cookie.HttpOnly = true;
            options.Cookie.IsEssential = true; 
        });

        services.AddDistributedMemoryCache();
        
        services.AddIdentity<IdentityUser, IdentityRole>()
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

        ConfigureWeb(services);
        services.AddSwaggerGen(x =>
            x.SwaggerDoc("v1", new OpenApiInfo()
            {
                Title = "Demo Project",
                Description = "Asp.Net Core with React",
                Version = "1.0"
            }));
    }

    private static void ConfigureDependencyInjection(IServiceCollection services)
    {
        services.AddSingleton<IUserIdProvider, AspNetUserIdProvider>();
        services.AddScoped<IAccountService, AccountService>();
        services.AddScoped<IWeatherForecastService, WeatherForecastService>(); 
        services.AddScoped<IAccidentService, AccidentService>();
        services.AddScoped<IFileHasher, FileHasher>();
        services.AddScoped<IFileUploadService, FileUploadService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IFileCategoryService, FileCategoryService>();
    }

    private void ConfigureDatabase(IServiceCollection services)
    {
        AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
        
        var connString = Configuration.GetConnectionString("Development");
        
        services.AddDbContext<ApplicationDbContext>(options => options
            .UseNpgsql(connString)
        ); 
    }

    private void ConfigureWeb(IServiceCollection services)
    {
        services.AddControllers();
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen();
        services.AddMemoryCache();
        services.AddSignalR(); 
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

        app.UseStaticFiles(); 
        app.UseMiddleware<FileSizeLimitMiddleware>();
        app.UseMiddleware<ImageCompressionMiddleware>();

        app.Use(async (context, next) =>
        {
            if (context.Request.ContentLength > 30 * 1024 * 1024)
            {
                context.Response.StatusCode = StatusCodes.Status413PayloadTooLarge;
                await context.Response.WriteAsync("File size exceeds limit.");
                return;
            }
            await next();
        });

        app.UseRouting();
        app.UseAuthentication();  
        app.UseAuthorization();
        app.UseSerilogRequestLogging(); 
        app.UseSession();
        app.UseEndpoints(endpoints =>
        {
            endpoints.MapHub<SessionHub>("/sessionHub");
            endpoints.MapControllers(); 
        });
    }
}
