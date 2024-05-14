namespace webapi.models;

public class RequestFileModel
{
    public string FileName { get; set; }
    public string? FileExtension { get; set; }
    public Stream FileStream { get; set; }
}