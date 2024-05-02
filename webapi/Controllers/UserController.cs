using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using webapi.Data;
using webapi.Models;

namespace webapi.Controllers;

[ApiController]
[Route("api/user")]
public class UserController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    private readonly UserManager<IdentityUser> _userManager;

    public UserController(ApplicationDbContext db, UserManager<IdentityUser> userManager)
    {
        _db = db;
        _userManager = userManager;
    }
    
    [HttpGet("GetUsersList")]
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

    [HttpPost("EditUser")]
    public async Task<IActionResult> Edit(CreateUserViewModel model)
    {
        if (ModelState.IsValid)
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
                        result = await _userManager.AddPasswordAsync(user, model.Password);
                    } else if ((model.Password ?? "") != "") {
                        result = await _userManager.ResetPasswordAsync(user,
                            _userManager.GeneratePasswordResetTokenAsync(user).Result, model.Password);
                    }
                    if (result.Succeeded) {
                        return Ok();
                    }
                }
            }
        }
        return BadRequest("Error while saving data!");
    }
    
    [HttpGet("GetUser")]
    public async Task<CreateUserViewModel> Get(string id)
    {
        var user = string.IsNullOrEmpty(id)
            ? new IdentityUser()
            : await _userManager.FindByIdAsync(id);

        var userRoles = _db.UserRoles.FirstOrDefault(f => f.UserId == id)?.RoleId;

        var model = new CreateUserViewModel
        {
            Id = user.Id,
            Email = user.Email,
            Username = user.UserName,
            Role = userRoles,
            IsActive = user.LockoutEnd == null,
            PhoneNumber = user.PhoneNumber,
        };

        return model;
    }
    
    [HttpPost("DeleteUser")]
    public async Task<IActionResult> Delete([FromBody] string id) {
        var row = await _db.Users.FindAsync(id);
        if (row == null) {
            return BadRequest("User not found!");;
        }
        _db.Users.Remove(row);
        await _db.SaveChangesAsync();
        return Content("Succeeded");
    }
    
    [HttpPost("UploadFile")]
    public async Task<IActionResult> UploadFile()
    {
        try
        {
            var file = Request.Form.Files[0]; 

            if (file.Length > 0)
            {
                var filePath = Path.Combine("uploads", file.FileName); 
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream); 
                }
                return Ok(new { message = "File uploaded successfully" });
            }
            else
            {
                return BadRequest("No file uploaded");
            }
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex}");
        }
    }
}