using System.Security.Claims;
using webapi.Service.Abstract;

namespace webapi.Service;

public class AspNetUserIdProvider : IUserIdProvider
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public AspNetUserIdProvider(IHttpContextAccessor httpContextAccessor) {
        _httpContextAccessor = httpContextAccessor;
    }

    public string TryGetCurrentUserId() {
        var claim = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier);
        return claim?.Value;
    }
}