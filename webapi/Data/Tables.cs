using Microsoft.EntityFrameworkCore;
using webapi.Models;

namespace webapi.Data;

public partial class ApplicationDbContext
{
    public DbSet<City> City { get; set; }
}