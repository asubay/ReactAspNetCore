using Microsoft.AspNetCore.Mvc;
using webapi.Data;
using webapi.Models;

namespace webapi.Controllers;

[ApiController]
[Route("role")]
public class RoleController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    
    public RoleController(ApplicationDbContext db)
    {
        _db = db;
    }
    
    [HttpGet("GetRoles")]
    public async Task<List<RoleViewModel>> GetRoleList()
    {
        var roles = _db.Roles.Select(s => new RoleViewModel
        {
            Id = s.Id,
            Name = s.Name,
        }).ToList();
        
        return roles;
    }
}