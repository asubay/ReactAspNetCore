using webapi.Models;

namespace webapi.Service.Abstract;

public interface IAccountService
{
    Task KeepSessionAlive(string user);
    Task UpdateCurrentUserInfo(string username);
    Task<UserInformation> GetCurrentUserAsync();
}