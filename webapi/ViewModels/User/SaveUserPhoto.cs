using System.ComponentModel.DataAnnotations;

namespace webapi.ViewModels.User;

public class SaveUserPhoto
{
    [Required]
    public int EmployeeId { get; set; }

    [Required]
    public IFormFile File { get; set; } = null!;
}