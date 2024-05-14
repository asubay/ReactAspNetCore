namespace webapi.Initialization;

using Microsoft.AspNetCore.Http;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Processing;
using System.IO;
using System.Threading.Tasks;

public class ImageCompressionMiddleware
{
    private readonly RequestDelegate _next;

    public ImageCompressionMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        if (context.Request.ContentType != null && context.Request.ContentType.StartsWith("image/"))
        {
            context.Request.EnableBuffering();

            using var memoryStream = new MemoryStream();
            await context.Request.Body.CopyToAsync(memoryStream);
            memoryStream.Seek(0, SeekOrigin.Begin);

            using (var image = await Image.LoadAsync(memoryStream))
            {
                image.Mutate(x => x.Resize(new ResizeOptions
                {
                    Size = new Size(1024, 1024),
                    Mode = ResizeMode.Max
                }));

                var jpegEncoder = new JpegEncoder
                {
                    Quality = 75
                };

                await using var compressedStream = new MemoryStream();
                await image.SaveAsync(compressedStream, jpegEncoder);
                compressedStream.Seek(0, SeekOrigin.Begin);

                context.Request.Body = compressedStream;
                context.Request.ContentLength = compressedStream.Length;
            }
        }
        await _next(context);
    }
}

// Extension method to add the middleware
public static class ImageCompressionMiddlewareExtensions
{
    public static IApplicationBuilder UseImageCompressionMiddleware(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<ImageCompressionMiddleware>();
    }
}

