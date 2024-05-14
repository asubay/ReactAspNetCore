using Microsoft.EntityFrameworkCore;
using webapi.Data;
using webapi.models;
using webapi.Models;
using webapi.Models.Enums;
using webapi.Service.Abstract;
using webapi.Utils;

namespace webapi.Service;

public class FileUploadService : IFileUploadService
{
    private readonly string _uploadDirectory;
    private readonly IFileHasher _hasher;
    private readonly ILogger<FileUploadService> _logger;
    private readonly ApplicationDbContext _db;
    private readonly long _maxFileSizeBytes;
    
    public FileUploadService(IFileHasher hasher, ApplicationDbContext db, ILogger<FileUploadService> logger, 
        IConfiguration configuration)
    {
        _hasher = hasher;
        _uploadDirectory = PathUtils.GetStateDirectory("files");
        _db = db;
        _logger = logger;
        _maxFileSizeBytes = configuration.GetValue<long>("MaxFileSizeBytes", 20 * 1024 * 1024);
    }
    public async Task<UploadFile> UploadSingleFile(RequestFileModel fileModel, int category)
    {
        using var memory = new MemoryStream();
        await fileModel.FileStream.CopyToAsync(memory);
        return await SaveFile(category, memory.ToArray(), fileModel);
    }

    public async Task<FileCheckResult> CheckFile(IFormFile file, FileType fileType)
    {
        var result = new FileCheckResult { IsValid = true };

        string[] allowedExtensions = fileType switch
        {
            FileType.Image => new[] { ".jpg", ".jpeg", ".png", ".gif" },
            FileType.Document => new[] { ".pdf", ".doc", ".docx", ".txt", ".json" },
            _ => Array.Empty<string>()
        };

        var fileExtension = Path.GetExtension(file.FileName)?.ToLowerInvariant();
        if (string.IsNullOrEmpty(fileExtension) || !allowedExtensions.Contains(fileExtension))
        {
            result.IsValid = false;
            result.ErrorMessage = "Invalid file type.";
            return result;
        }

        if (file.Length > _maxFileSizeBytes)
        {
            result.IsValid = false;
            result.ErrorMessage = "Maximum file size exceeded.";
            return result;
        }

        return result;
    }

    public string GetRelativeFilePath(string filename) {
        return Path.Combine(filename[0..2], filename[2..4], filename[4..]);
    }
    
    public async Task<string> Save(byte[] data) {
        var filename = _hasher.HashToString(data);
        var path = GetRelativeFilePath(filename);
        var fullPath = Path.Combine(_uploadDirectory, path);

        if (File.Exists(fullPath)) {
            return path;
        }

        var fileDir = Path.GetDirectoryName(fullPath)
                      ?? throw new InvalidOperationException();
        Directory.CreateDirectory(fileDir);

        await File.WriteAllBytesAsync(fullPath, data);

        return path;
    }

    private async Task<UploadFile> SaveFile(int categoryId, byte[] data, RequestFileModel fileModel) {
        var filePath = await Save(data);
        var fileName = fileModel.FileName.Length > 30 ? fileModel.FileName.Substring(0, 30) : fileModel.FileName;

        var fileEntity = new UploadFile
        {
            CategoryId = categoryId,
            FilePath = filePath,
            FileExtension = fileModel.FileExtension,
            FileName = fileName,
        };
        _db.Add(fileEntity);

        await _db.SaveChangesAsync();
        _logger.LogInformation("File saved with path {FilePath}", filePath);
        return fileEntity;
    }
    
    public async Task<FileCategory> GetFileCategory(FileCategoryEnum categoryEnum) {
        var category = await _db.FileCategories
            .FirstOrDefaultAsync(e => e.Id == (int)categoryEnum);
        if (category == null)
        {
            _logger.LogError("Category not found: {CategoryEnum}", categoryEnum);
            throw new Exception("Category not found");
        }
        return category;
    }
    
    public async Task<byte[]> Load(int imageId) {
        var image = await _db.Files
            .FirstOrDefaultAsync(e => e.Id == imageId);
        if (image == null)
        {
            _logger.LogError("Image not found with ID {ImageId}", imageId);
            throw new Exception("Image not found");
        }
        return await ReadData(image.FilePath);
    }
    
    private async Task<byte[]> ReadData(string filePath) {
        await using var stream = OpenForRead(filePath);
        using var memory = new MemoryStream();
        await stream.CopyToAsync(memory);
        return memory.ToArray();
    }
    
    private Stream OpenForRead(string filePath) {
        var fullPath = Path.Combine(_uploadDirectory, filePath);
        return File.OpenRead(fullPath);
    }
    
    public async Task<bool> DeleteFile(int fileId)
    {
        var fileEntity = await _db.Files.FindAsync(fileId);
        if (fileEntity == null)
        {
            _logger.LogWarning("File with ID {FileId} not found for deletion.", fileId);
            return false;
        }
        
        var fullPath = Path.Combine(_uploadDirectory, fileEntity.FilePath);
        
        if (File.Exists(fullPath))
        {
            File.Delete(fullPath);
            _logger.LogInformation("File {FilePath} deleted from file system.", fullPath);
        }
        else
        {
            _logger.LogWarning("File {FilePath} not found on file system.", fullPath);
        }
        
        _db.Files.Remove(fileEntity);
        await _db.SaveChangesAsync();
        _logger.LogInformation("File with ID {FileId} deleted from database.", fileId);

        return true;
    }

}