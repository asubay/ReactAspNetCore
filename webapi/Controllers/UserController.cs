using Microsoft.AspNetCore.Mvc;
using webapi.Data;
using webapi.models;
using webapi.Models.Enums;
using webapi.Service.Abstract;
using webapi.ViewModels.User;

namespace webapi.Controllers;

[ApiController]
[Route("api/user")]
public class UserController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    private readonly IUserService _service;
    private readonly IFileUploadService _file;

    public UserController(ApplicationDbContext db, IUserService service, IFileUploadService file)
    {
        _db = db;
        _service = service;
        _file = file;
    }
    
    [HttpGet("GetUsersList")]
    public async Task<List<UserViewModel>> GetUserList()
    {
        return await _service.GetUserList();
    }

    [HttpPost("EditUser")]
    public async Task<IActionResult> Edit(UserEditModel model)
    {
        if (ModelState.IsValid)
        {
            await _service.Edit(model);
        }
        return BadRequest("Error while saving data!");
    }
    
    [HttpGet("GetUser")]
    public async Task<UserEditModel> Get(string id)
    {
        return await _service.Get(id);
    }
    
    [HttpDelete("DeleteUser/{id}")]
    public async Task<IActionResult> Delete(string id) {
        var row = await _db.Users.FindAsync(id);
        if (row == null) {
            return BadRequest("User not found!");
        }
        _db.Users.Remove(row);
        await _db.SaveChangesAsync();
        return Content("Succeeded");
    }
    
    [HttpPost("SavePhoto")]
    [Consumes("multipart/form-data")]
    public async Task SaveUserPhoto([FromForm] IFormFile file, string userId)
    {
        var checkFile = await _file.CheckFile(file, FileType.Image);
        if (checkFile.IsValid)
        {
            await using var stream = file.OpenReadStream();
            var model = new RequestFileModel
            {
                FileStream = stream,
                FileExtension = file.ContentType,
                FileName = file.FileName
            };
            
            await _service.SavePhoto(userId, model);
        }
    }
    
    [HttpGet("GetUserPhoto")]
    public async Task<IActionResult?> GetUserPhoto(string userId)
    {
        var photo = await _service.GetPhoto(userId);
        if (photo == null)
        {
            return null;
        }
        return File(photo.Byte, photo.FileType);
    }
    
    [HttpDelete("DeletePhoto/{userId}")]
    public async Task<IActionResult> DeleteFile(string userId)
    {
        int fileId = await _service.PhotoId(userId);
        var result = await _file.DeleteFile(fileId);
        if (!result)
        {
            return NotFound();
        }
        return NoContent();
    }
}