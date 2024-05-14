namespace webapi.Initialization;

using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

public class FileSizeLimitMiddleware
{
    private readonly RequestDelegate _next;
    private const long MaxFileSize = 30 * 1024 * 1024;

    public FileSizeLimitMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        if (context.Request.ContentLength > MaxFileSize)
        {
            context.Response.StatusCode = StatusCodes.Status413PayloadTooLarge;
            await context.Response.WriteAsync("File size exceeds limit.");
            return;
        }
        await _next(context);
    }
}
