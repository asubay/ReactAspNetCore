using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace webapi.Models;

public class CreateUserViewModel
{
    public Guid Id { get; set; } = Guid.Empty;
    public string Username { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
    
    [DataType(DataType.Password)]
    public string Password { get; set; }

    public string[] Role { get; set; }
    public bool IsActive { get; set; }
}