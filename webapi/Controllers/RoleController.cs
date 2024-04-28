using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using webapi.Data;
using webapi.Models;

namespace webapi.Controllers;

[ApiController]
[Route("role")]
public class RoleController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    private readonly RoleManager<IdentityRole> _roleManager;
    
    public RoleController(ApplicationDbContext db, RoleManager<IdentityRole> roleManager)
    {
        _db = db;
        _roleManager = roleManager;
    }
    
    [HttpGet("GetRoleList")]
    public async Task<RoleViewModel[]> GetRoleList()
    {
        var roles = _db.Roles.Select(s => new RoleViewModel
        {
            Id = s.Id,
            Name = s.Name,
        }).ToArray();
        
        return roles;
    }
    
    [HttpPost("EditRole")]
    public async Task<IActionResult> Edit(RoleEditModel model)
    {
        if (ModelState.IsValid) {
            var role = await _roleManager.FindByIdAsync(model.Id);

            var isNewRole = role == null;
            if (isNewRole) {
                role = new IdentityRole(model.Name);
            }

            role.Name = model.Name;

            var result = isNewRole
                ? await _roleManager.CreateAsync(role)
                : await _roleManager.UpdateAsync(role);

            if (result.Succeeded) {
                return Ok();
            }
        }
        return BadRequest("Заполните все обязательные поля!");
    }
    
    [HttpGet("GetRole")]
    public async Task<RoleEditModel> Get(string id) {
        var role = string.IsNullOrEmpty(id)
            ? new IdentityRole()
            : await _roleManager.FindByIdAsync(id);
        
        var model = new RoleEditModel {
            Id = role.Id,
            Name = role.Name,
        };
        return model;
    }
}