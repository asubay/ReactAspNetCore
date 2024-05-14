using Microsoft.EntityFrameworkCore;
using webapi.Models;

namespace webapi.Data;

public partial class ApplicationDbContext
{
    public DbSet<City> City { get; set; }
    public DbSet<UploadFile> Files { get; set; }
    public DbSet<FileCategory?> FileCategories { get; set; }
    public DbSet<UserFile> UserFiles { get; set; }
}