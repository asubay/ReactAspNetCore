using Microsoft.AspNetCore.Mvc;
using webapi.Models;

namespace webapi.Controllers;

[ApiController]
[Route("auth")]
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



