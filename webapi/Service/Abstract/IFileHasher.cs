namespace webapi.Service.Abstract;

public interface IFileHasher
{
    string HashToString(byte[] data);

    byte[] HashToArray(byte[] data);
}