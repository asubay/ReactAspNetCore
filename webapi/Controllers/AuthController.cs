using Microsoft.AspNetCore.Mvc;

namespace webapi.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        var token = "example-token";
        var responseData = new LoginResponse { Token = token, UserName = "Erkezhan" };
        return Ok(responseData);
        //return BadRequest("Ошибка аутентификации: неверные учетные данные");
    }
}

public class LoginRequest
{
    public string Username { get; set; }
    public string Password { get; set; }
}

public class LoginResponse
{
    public string Token { get; set; }
    public string UserName { get; set; }
}