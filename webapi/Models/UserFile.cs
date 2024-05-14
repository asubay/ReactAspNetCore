using Microsoft.AspNetCore.Identity;

namespace webapi.Models;

public class UserFile
{
    public string UserId { get; set; }
    public virtual IdentityUser? User { get; set; }
    public int FileId { get; set; }
    public virtual UploadFile File { get; set; }
}