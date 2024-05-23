using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using webapi.Service.Abstract;
using webapi.Utils;
using webapi.ViewModels.Auth;
using webapi.ViewModels.User;

namespace webapi.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly UserManager<IdentityUser> _userManager;
    private readonly SignInManager<IdentityUser> _signInManager;
    private readonly IAccountService _accountService;
    private readonly ILogger<AuthController> _logger;
    public AuthController(UserManager<IdentityUser> userManager,
        SignInManager<IdentityUser> signInManager, IAccountService accountService, ILogger<AuthController> logger)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _accountService = accountService;
        _logger = logger;
    }
    
    /// <summary>Вход в проект</summary>
    [HttpPost("Login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        if (ModelState.IsValid)
        {
            var user = await _userManager.FindByNameAsync(request.Username);
            if (user == null)
            {
                string message = "Authentication error: user not found";
                _logger.LogWarning(message);
                return BadRequest(message);
            }
            var checkPassword = await _signInManager.CheckPasswordSignInAsync(user, request.Password, true);
            if (checkPassword.IsLockedOut)
            {
                string message = "Authentication error: password error";
                _logger.LogWarning(message);
                return BadRequest(message);
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
    
    /// <summary>Получить профиль текущего пользователя</summary>
    [HttpGet("GetCurrentUser")]
    public async Task<ActionResult<UserInformation>> GetCurrentUser()
    {
        try
        {
            var result = await _accountService.GetCurrentUserAsync();
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while getting user information");
            return StatusCode(500, "Internal server error");
        }
    }
    
    /// <summary>Выход из проекта</summary>
    [HttpPost("Logout")]
    public async Task<IActionResult> Logout() {
        await _signInManager.SignOutAsync();
        return NoContent();
    }
}