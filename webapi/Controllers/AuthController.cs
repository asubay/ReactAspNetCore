using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using webapi.Models;
using webapi.Service.Abstract;
using webapi.Utils;

namespace webapi.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly UserManager<IdentityUser> _userManager;
    private readonly SignInManager<IdentityUser> _signInManager;
    private readonly IAccountService _accountService;
    public AuthController(UserManager<IdentityUser> userManager,
        SignInManager<IdentityUser> signInManager, IAccountService accountService)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _accountService = accountService;
    }
    
    [HttpPost("Login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        if (ModelState.IsValid)
        {
            var user = await _userManager.FindByNameAsync(request.Username);
            if (user == null)
            {
                return BadRequest("Authentication error: user not found");
            }
            var checkPassword = await _signInManager.CheckPasswordSignInAsync(user, request.Password, true);
            if (checkPassword.IsLockedOut)
            {
                return BadRequest("Authentication error: user has blocked");
            }
            
            var result = await _signInManager
                .PasswordSignInAsync(user, request.Password, true, false);
            if (!result.Succeeded)
            {
                return BadRequest("Authentication error: password error");
            }
            
            HttpContext.Session.Clear();
            HttpContext.Session.SetString(Constants.SessionUserKey, request.Username);
            
            var userInfo = await _accountService.UpdateCurrentUserInfo(request.Username);
            return Ok(userInfo);
        }
        
        return BadRequest("Authentication error: invalid credentials");
    }
    
    [HttpGet("GetCurrentUser")]
    public async Task<ActionResult<UserInformation>> GetCurrentUser()
    {
        var result = await _accountService.GetCurrentUserAsync();
        if (result != null)
        {
            return Ok(result);
        }
        return BadRequest("Authentication error: invalid credentials");
    }
    
    [HttpPost("Logout")]
    public async Task<IActionResult> Logout() {
        await _signInManager.SignOutAsync();
        return Ok();
    }
}



