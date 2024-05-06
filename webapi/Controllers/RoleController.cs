using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using webapi.Data;
using webapi.Models;
using webapi.ViewModels.Role;

namespace webapi.Controllers;

[ApiController]
[Route("api/role")]
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
        return BadRequest("Error while saving data!");
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
    
    [HttpPost("DeleteRole")]
    public async Task<IActionResult> Delete([FromBody] string id) {
        var row = await _db.Roles.FindAsync(id);
        if (row == null) {
            return BadRequest("Role not found!");;
        }
        _db.Roles.Remove(row);
        await _db.SaveChangesAsync();
        return Content("Succeeded");
    }
    
}