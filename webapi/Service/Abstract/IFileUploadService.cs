using webapi.models;
using webapi.Models;
using webapi.Models.Enums;

namespace webapi.Service.Abstract;

public interface IFileUploadService
{
    Task<UploadFile> UploadSingleFile(RequestFileModel fileModel, int category);
    Task<FileCheckResult> CheckFile(IFormFile file, FileType fileType);
    Task<byte[]> Load(int imageId);
    Task<bool> DeleteFile(int fileId);
    Task<byte[]> ReadData(string filePath);
}