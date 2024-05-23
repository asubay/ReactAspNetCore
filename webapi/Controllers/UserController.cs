using Microsoft.AspNetCore.Mvc;
using webapi.Data;
using webapi.models;
using webapi.Models.Enums;
using webapi.Service.Abstract;
using webapi.ViewModels.User;

namespace webapi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    private readonly IUserService _service;
    private readonly IFileUploadService _file;
    private readonly ILogger<UserController> _logger;

    public UserController(ApplicationDbContext db, IUserService service, IFileUploadService file,
        ILogger<UserController> logger)
    {
        _db = db;
        _service = service;
        _file = file;
        _logger = logger;
    }
    
    [HttpGet("GetUsersList")]
    public async Task<ActionResult<List<UserViewModel>>> GetUserList()
    {
        try
        {
            var users = await _service.GetUserList();
            return Ok(users);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while getting user list");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost("EditUser")]
    public async Task<ActionResult<string>> Edit(UserEditModel model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var result = await _service.Edit(model);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while edit user");
            return StatusCode(500, "Internal server error");
        }
    }
    
    [HttpGet("GetUser")]
    public async Task<ActionResult<UserEditModel>> Get(string id)
    {
        try
        {
            var user = await _service.Get(id);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error while getting user with id {id}");
            return StatusCode(500, "Internal server error");
        }
    }
    
    [HttpDelete("DeleteUser/{id}")]
    public async Task<IActionResult> Delete(string id) {
        try
        {
            var user = await _db.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound("User not found!");
            }

            _db.Users.Remove(user);
            await _db.SaveChangesAsync();
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error while deleting user with id {id}");
            return StatusCode(500, "Internal server error");
        }
    }
    
    [HttpPost("SavePhoto")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> SaveUserPhoto([FromForm] IFormFile file, string userId)
    {
        try
        {
            var checkFile = await _file.CheckFile(file, FileType.Image);
            if (!checkFile.IsValid)
            {
                return BadRequest("Invalid file format");
            }

            await using var stream = file.OpenReadStream();
            var model = new RequestFileModel
            {
                FileStream = stream,
                FileExtension = file.ContentType,
                FileName = file.FileName.Length > 30 ? file.FileName.Substring(0, 30) : file.FileName
            };

            await _service.SavePhoto(userId, model);
            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error while saving photo for user with id {userId}");
            return StatusCode(500, "Internal server error");
        }
    }
    
    [HttpGet("GetUserPhoto")]
    public async Task<IActionResult> GetUserPhoto(string userId)
    {
        try
        {
            var photo = await _service.GetPhoto(userId);
            if (photo == null)
            {
                return NotFound();
            }
            var fileData = await _file.ReadData(photo.FilePath);
            if (fileData == null)
            {
                return NotFound("File not found");
            }
            return File(photo.Byte, photo.FileType);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error while getting photo for user with id {userId}");
            return StatusCode(500, "Internal server error");
        }
    }
    
    [HttpDelete("DeletePhoto/{userId}")]
    public async Task<IActionResult> DeleteFile(string userId)
    {
        try
        {
            int fileId = await _service.PhotoId(userId);
            var result = await _file.DeleteFile(fileId);
            if (!result)
            {
                return NotFound();
            }
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while delete user photo");
            return StatusCode(500, "Internal server error");
        }
    }
}