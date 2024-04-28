using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using webapi.Data;
using webapi.Models;

namespace webapi.Controllers;

[ApiController]
[Route("user")]
public class UserController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    private readonly UserManager<IdentityUser> _userManager;

    public UserController(ApplicationDbContext db, UserManager<IdentityUser> userManager)
    {
        _db = db;
        _userManager = userManager;
    }
    
    [HttpGet("GetUsers")]
    public async Task<List<UserViewModel>> GetUserList()
    {
        var users = _db.Users.Select(s => new UserViewModel
        {
            Id = s.Id,
            Name = s.NormalizedEmail,
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
            var isNewUser = user == null;
            user.Email = model.Email;
            user.UserName = model.Username;
            user.Email = model.Email;
            user.PhoneNumber = model.PhoneNumber;
            user.NormalizedUserName = model.Name;
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

                result = await _userManager.AddToRolesAsync(user, model.Role);
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
        return BadRequest("Заполните все обязательные поля!");
    }
    
    [HttpGet("GetUser")]
    public async Task<CreateUserViewModel> Edit(string id) {
        var user = string.IsNullOrEmpty(id)
            ? new IdentityUser()
            : await _userManager.FindByIdAsync(id);
        var userRoles = await _userManager.GetRolesAsync(user);

        var model = new CreateUserViewModel {
            Id = Guid.Parse(user.Id),
            Email = user.Email,
            Username = user.UserName,
            Role = userRoles.ToArray(),
            IsActive = user.LockoutEnd == null,
            Name = user.NormalizedUserName,
            PhoneNumber = user.PhoneNumber,
        };
        return model;
    }
}