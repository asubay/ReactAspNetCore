using System.Text.RegularExpressions;

namespace webapi.Utils;

public static class StringExtensions
{
    public static string ToLowerCamelCase(this string input) {
        try {
          if (!string.IsNullOrEmpty(input)) {
            return char.ToLowerInvariant(input[0]) + input.Substring(1);
          }
          return input;
        } catch (Exception e) {
          Console.WriteLine(e);
          throw;
        }
    }
    
    public static string ToSnakeCase(this string input) {
      try {
        if (string.IsNullOrEmpty(input)) {
          return input;
        }
        var startUnderscores = Regex.Match(input, @"^_+");
        return startUnderscores + Regex.Replace(input, @"([a-z0-9])([A-Z])", "$1_$2").ToLower();
      } catch (Exception e) {
        Console.WriteLine(e);
        throw;
      }
    }
    
    public static string TrimEndString(this string input, string remove) {
      try {
        return input.Substring(0, input.LastIndexOf(remove, StringComparison.Ordinal));
      } catch (Exception e) {
        Console.WriteLine(e);
        throw;
      }
    }
    public static T ToEnum<T>(this string value)
    {
      return (T) Enum.Parse(typeof(T), value, true);
    }
}