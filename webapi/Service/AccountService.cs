using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using webapi.Data;
using webapi.Models;
using webapi.Service.Abstract;

namespace webapi.Service;

public class AccountService : IAccountService
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IMemoryCache _memoryCache;
    private readonly UserManager<IdentityUser> _userManager;
    private readonly ApplicationDbContext _db;
    private readonly ClaimsPrincipal _user;
    private readonly string _userSession;
    
    public AccountService(IHttpContextAccessor httpContextAccessor,
        IMemoryCache memoryCache, UserManager<IdentityUser> userManager, ApplicationDbContext db)
    {
        _httpContextAccessor = httpContextAccessor;
        _userManager = userManager;
        _memoryCache = memoryCache;
        _db = db;
        _user = httpContextAccessor.HttpContext?.User;
        _userSession = httpContextAccessor.HttpContext?.Session.Id;
    }

    public async Task KeepSessionAlive(string user)
    {
        _httpContextAccessor?.HttpContext?.Session.SetString("LastActivity", DateTime.Now.ToString("O"));
        await UpdateCurrentUserInfo(user);
    }
    
    public async Task UpdateCurrentUserInfo(string username) {
        var userInfo = await GetCurrentUserFromDbAsync(username);
        _memoryCache.Set(username, userInfo, new MemoryCacheEntryOptions {
            SlidingExpiration = TimeSpan.FromSeconds(3600),
        });
    }
    
    private async Task<UserInformation> GetCurrentUserFromDbAsync(string username)
    {
        var currentUser = await _userManager.FindByNameAsync(username);
        if (currentUser == null)
        {
            return null;
        }

        var roles = await _userManager.GetRolesAsync(currentUser);
        var roleName = roles.FirstOrDefault();
        var role = await _db.Roles.FirstOrDefaultAsync(x => x.Name == roleName);

        return new UserInformation
        {
            Id = currentUser.Id,
            Username = currentUser.UserName,
            Role = role?.Id,
            IsAdmin = role?.Name == "admin",
            Email = currentUser.Email,
            PhoneNumber = currentUser.PhoneNumber,
            SessionId = _userSession
        };
    }
    
    public async Task<UserInformation> GetCurrentUserAsync()
    {
        if (_user?.Identity?.Name != null)
        {
            return (UserInformation)_memoryCache.Get(_user.Identity.Name);
        }
        return null;
    }
}