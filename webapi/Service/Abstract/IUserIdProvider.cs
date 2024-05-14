namespace webapi.Service.Abstract;

public interface IUserIdProvider
{
    string TryGetCurrentUserId();
}