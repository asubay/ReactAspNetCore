using System.Security.Cryptography;
using webapi.Service.Abstract;

namespace webapi.Service;

public class FileHasher : IFileHasher
{
    private static readonly uint[] HashLookup = CreateLookup();
    private readonly HashAlgorithm _hasher = SHA1.Create();
    private static uint[] CreateLookup() {
        var result = new uint[256];
        for (var i = 0; i < 256; ++i) {
            var str = $"{i:x2}";
            result[i] = str[0] + ((uint) str[1] << 16);
        }
        return result;
    }
   
    public string HashToString(byte[] data)
    {
        var hash = HashToArray(data);
        var result = new char[hash.Length * 2];

        for (var i = 0; i < hash.Length; ++i) {
            var val = HashLookup[hash[i]];
            result[2 * i] = (char) val;
            result[2 * i + 1] = (char) (val >> 16);
        }

        return new string(result);
    }

    public byte[] HashToArray(byte[] data)
    {
        return _hasher.ComputeHash(data);
    }
}