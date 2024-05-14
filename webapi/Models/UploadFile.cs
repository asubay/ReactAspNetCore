using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using webapi.Models.Base;

namespace webapi.Models;

[DisplayName("Upload files")]
public class UploadFile : DbEntity
{
    public int CategoryId { get; set; }
    public virtual FileCategory Category { get; set; } = null!;
    
    [MaxLength(42)]
    [DisplayName("Path to file relative to storage directory")]
    public string FilePath { get; set; } = "";

    [MaxLength(10)] 
    public string? FileExtension { get; set; } = "";

    [MaxLength(30)]
    public string FileName { get; set; } = "";
}