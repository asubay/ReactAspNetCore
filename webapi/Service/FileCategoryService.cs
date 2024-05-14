using webapi.Data;
using webapi.Models;
using webapi.Service.Abstract;

namespace webapi.Service;

public class FileCategoryService : IFileCategoryService
{
    private readonly ApplicationDbContext _db;
    public FileCategoryService(ApplicationDbContext db)
    {
        _db = db;
    }
    public FileCategory? this[string code] => _db.FileCategories.FirstOrDefault(x => x.Name == code);
}