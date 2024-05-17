using webapi.models;
using webapi.ViewModels.User;

namespace webapi.Service.Abstract;

public interface IUserService
{
    Task<List<UserViewModel>> GetUserList();
    Task<string> Edit(UserEditModel model);
    Task<UserEditModel> Get(string id);
    Task SavePhoto(string userId, RequestFileModel file);
    Task<ResponseFileModel> GetPhoto(string userId);
    Task<int> PhotoId(string userId);
}