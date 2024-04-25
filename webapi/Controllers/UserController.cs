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

    public async Task<IActionResult> Edit(CreateUserViewModel model)
    {
        if (ModelState.IsValid)
        {
            var user = await _userManager.FindByNameAsync(model.Login);
            if (user == null)
            {
                var row = new IdentityUser
                {
                    UserName = model.Login,
                    Email = model.Email,
                    PhoneNumber = model.PhoneNumber,
                    NormalizedUserName = model.Name,

                };
                _db.Users.Add(new IdentityUser());
                
            }
        }
        return Ok();
    }
}