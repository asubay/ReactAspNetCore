namespace webapi.ViewModels.Auth;

public class LoginResponse
{
    public string Token { get; set; }
    public string UserName { get; set; }
}

public class LoginRequest
{
    public string Username { get; set; }
    public string Password { get; set; }
}