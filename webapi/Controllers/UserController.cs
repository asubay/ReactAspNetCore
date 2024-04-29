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
                roles.Add(model.Role);

                result = await _userManager.AddToRolesAsync(user, roles);
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
    public async Task<CreateUserViewModel> Get(string id) {
        var user = string.IsNullOrEmpty(id)
            ? new IdentityUser()
            : await _userManager.FindByIdAsync(id);
        var userRoles = await _userManager.GetRolesAsync(user);

        var model = new CreateUserViewModel {
            Id = user.Id,
            Email = user.Email,
            Username = user.UserName,
            Role = userRoles[0],
            IsActive = user.LockoutEnd == null,
            PhoneNumber = user.PhoneNumber,
        };
        return model;
    }
}