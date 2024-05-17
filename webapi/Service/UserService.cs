using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using webapi.Data;
using webapi.models;
using webapi.Models;
using webapi.Service.Abstract;
using webapi.ViewModels.User;

namespace webapi.Service;

public class UserService : IUserService
{
    private readonly ApplicationDbContext _db;
    private readonly UserManager<IdentityUser> _userManager;
    private readonly IFileUploadService _file;
    private readonly IFileCategoryService _fileCategory;
    
    public UserService(ApplicationDbContext db, UserManager<IdentityUser> userManager, IFileUploadService file,
        IFileCategoryService fileCategory)
    {
        _db = db;
        _userManager = userManager;
        _file = file;
        _fileCategory = fileCategory;
    }
    public async Task<List<UserViewModel>> GetUserList()
    {
        var users = _db.Users.Select(s => new UserViewModel
        {
            Id = s.Id,
            Login = s.UserName,
            Email = s.Email,
            PhoneNumber = s.PhoneNumber
        }).ToList();
        
        return users;
    }

    public async Task<string> Edit(UserEditModel model)
    {
        var user = await _userManager.FindByNameAsync(model.Username);
        bool isNewUser = user == null;
            
        if (isNewUser) {
            user = new IdentityUser(model.Username);
        }

        user.Email = model.Email;
        user.UserName = model.Username;
        user.Email = model.Email;
        user.PhoneNumber = model.PhoneNumber;
        if (!model.IsActive) {
            user.LockoutEnd = DateTimeOffset.MaxValue;
        } else {
            user.LockoutEnd = null;
        }
        var result = isNewUser
            ? await _userManager.CreateAsync(user)
            : await _userManager.UpdateAsync(user);
        if (result.Succeeded) {
            var currentRoles = await _userManager.GetRolesAsync(user);
            await _userManager.RemoveFromRolesAsync(user, currentRoles);
            var roles = new List<string>();
            var role = _db.Roles.FirstOrDefault(f => f.Id == model.Role)?.NormalizedName;
            roles.Add(role);

            result = await _userManager.AddToRolesAsync(user, roles.ToArray());
            if (result.Succeeded) {
                if (isNewUser) {
                    await _userManager.AddPasswordAsync(user, model.Password);
                } else if ((model.Password ?? "") != "") {
                    await _userManager.ResetPasswordAsync(user,
                        _userManager.GeneratePasswordResetTokenAsync(user).Result, model.Password);
                }
            }
        }

        return user.Id;
    }

    public async Task<UserEditModel> Get(string id)
    {
        var user = string.IsNullOrEmpty(id)
            ? new IdentityUser()
            : await _userManager.FindByIdAsync(id);

        var userRoles = _db.UserRoles.FirstOrDefault(f => f.UserId == id)?.RoleId;

        var model = new UserEditModel
        {
            Id = user.Id,
            Email = user.Email,
            Username = user.UserName,
            Role = userRoles,
            IsActive = user.LockoutEnd == null,
            PhoneNumber = user.PhoneNumber
        };

        return model;
    }
    
    public async Task SavePhoto(string userId, RequestFileModel fileModel)
    {
        int category = _fileCategory[FileCategory.UserPhoto]!.Id;
        var file = await _db.UserFiles
            .Include(x=>x.User)
            .Include(x=>x.File)
            .FirstOrDefaultAsync(e => e.UserId == userId && e.File.CategoryId == category) ?? new UserFile();
        
        file.User = await _userManager.FindByIdAsync(userId);
        file.File = await _file.UploadSingleFile(fileModel, category);
        
        if (file.FileId == default)
        {
            _db.UserFiles.Add(file);
        }
        
        await _db.SaveChangesAsync();
    }
    
    public async Task<ResponseFileModel> GetPhoto(string userId) {
        var photo = _db.UserFiles.FirstOrDefault(f =>
            f.UserId == userId && f.File.CategoryId == _fileCategory[FileCategory.UserPhoto]!.Id);

        if (photo?.FileId == null) {
            return null;
        }

        var response = new ResponseFileModel
        {
            Byte = await _file.Load(photo.FileId),
            FileType = photo.File.FileExtension,
            FileName = photo.File.FileName,
            FilePath = photo.File.FilePath,
        };

        return response;
    }

    public async Task<int> PhotoId(string userId)
    {
        return _db.UserFiles.FirstOrDefault(f =>
            f.UserId == userId && f.File.Category == _fileCategory[FileCategory.UserPhoto])!.FileId;
    }
}