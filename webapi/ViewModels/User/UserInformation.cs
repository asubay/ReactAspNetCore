namespace webapi.ViewModels.User;

public class UserInformation
{
    public string Id { get; set; } 
    public string? UserName { get; set; }
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Role { get; set; }
    public bool IsAdmin { get; set; }
    public string SessionId { get; set; }
    public byte[] AvatarByte { get; set; }
}