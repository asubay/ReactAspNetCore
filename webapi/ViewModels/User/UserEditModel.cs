namespace webapi.ViewModels.User;

public class UserEditModel
{
    public string Id { get; set; } 
    public string Username { get; set; }
    public string Email { get; set; }
    public string? PhoneNumber { get; set; }
    public string Password { get; set; }
    public string Role { get; set; }
    public bool IsActive { get; set; }
}