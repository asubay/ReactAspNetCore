using webapi.Models;

namespace webapi.Service.Abstract;

public interface IFileCategoryService
{
    FileCategory? this[string code] { get; }
}