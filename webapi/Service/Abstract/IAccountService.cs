using webapi.Models;
using webapi.ViewModels.User;

namespace webapi.Service.Abstract;

public interface IAccountService
{
    Task KeepSessionAlive(string user);
    Task<UserInformation> UpdateCurrentUserInfo(string username);
    Task<UserInformation> GetCurrentUserAsync();
}