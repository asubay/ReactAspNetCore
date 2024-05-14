namespace webapi.Models.Base;

public abstract class DbEntity
{
    public int Id { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? ModifiedAt { get; set; }

    public string AppUserId { get; set; }
}