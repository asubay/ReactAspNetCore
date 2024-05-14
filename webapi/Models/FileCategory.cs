using webapi.Models.Base;

namespace webapi.Models;

public class FileCategory : DbEntity
{
    public const string UserPhoto = "user_photo";
    public string Name { get; set; }
}