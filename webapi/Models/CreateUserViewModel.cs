namespace webapi.Models;

public class CreateUserViewModel
{
    public Guid Id { get; set; } = Guid.Empty;
    public string Login { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; }
    public string PhoneNumber { get; set; }
}