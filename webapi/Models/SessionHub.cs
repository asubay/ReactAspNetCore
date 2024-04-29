using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using webapi.Service.Abstract;

namespace webapi.Models;

public class SessionHub : Hub
{
    private readonly SignInManager<IdentityUser> _signInManager;
    private readonly IAccountService _accountService;

    public SessionHub(SignInManager<IdentityUser> signInManager, IAccountService accountService)
    {
        _signInManager = signInManager;
        _accountService = accountService;
    }
    
    public async Task KeepSessionAlive() {
        var user = Context.User;
        if (_signInManager.IsSignedIn(user)) {
            await _accountService.KeepSessionAlive(user?.Identity?.Name);
        }
    }
}