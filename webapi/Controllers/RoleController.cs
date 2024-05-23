using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using webapi.Data;
using webapi.Models;
using webapi.ViewModels.Role;

namespace webapi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RoleController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly ILogger<RoleController> _logger;
    
    public RoleController(ApplicationDbContext db, RoleManager<IdentityRole> roleManager,
        ILogger<RoleController> logger)
    {
        _db = db;
        _roleManager = roleManager;
        _logger = logger;
    }
    
    /// <summary>Получить список ролей</summary>
    [HttpGet("GetRoleList")]
    public async Task<ActionResult<RoleViewModel>> GetRoleList()
    {
        try
        {
            var roles = _db.Roles.Select(s => new RoleViewModel
            {
                Id = s.Id,
                Name = s.Name,
            }).ToList();
            
            return Ok(roles);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while getting role list");
            return StatusCode(500, "Internal server error");
        }
    }
    
    /// <summary>Редактировать роль</summary>
    [HttpPost("EditRole")]
    public async Task<IActionResult> Edit(RoleEditModel model)
    {
        if (ModelState.IsValid) {
            try
            {
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
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while edit role");
                return StatusCode(500, "Internal server error");
            }
        }
        return BadRequest("Error while saving data!");
    }
    
    /// <summary>Получить данные о роли</summary>
    [HttpGet("GetRole")]
    public async Task<ActionResult<RoleEditModel>> Get(string id) {
        try
        {
            var role = string.IsNullOrEmpty(id)
                ? new IdentityRole()
                : await _roleManager.FindByIdAsync(id);
        
            var model = new RoleEditModel {
                Id = role.Id,
                Name = role.Name,
            };
            return Ok(model);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error while getting user with id {id}");
            return StatusCode(500, "Internal server error");
        }
    }
    
    /// <summary>Удаление роли</summary>
    [HttpDelete("DeleteRole/{id}")]
    public async Task<IActionResult> Delete(string id) {
        try
        {
            var row = await _db.Roles.FindAsync(id);
            if (row == null) {
                return BadRequest("Role not found!");;
            }
            _db.Roles.Remove(row);
            await _db.SaveChangesAsync();
            return Content("Succeeded");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error while deleting role with id {id}");
            return StatusCode(500, "Internal server error");
        }
    }
}