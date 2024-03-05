using Microsoft.AspNetCore.Identity;
using Audit.EntityFramework;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Metadata;
using webapi.Utils;

namespace webapi.Data;

public partial class ApplicationDbContext : AuditIdentityDbContext<IdentityUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
        ChangeTracker.Tracked += ChangeTrackerOnTracked;
        ChangeTracker.StateChanged += ChangeTrackerOnStateChanged;
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.UseIdentityByDefaultColumns();
        /*
          это метод из библиотеки Entity Framework Core для настройки модели базы данных для 
          спользования расширения PostGIS в PostgreSQL.

          PostGIS - это географическое расширение для PostgreSQL, которое добавляет поддержку 
          географических объектов и операций с ними в базу данных. 
         */
        builder.HasPostgresExtension("postgis");
        ConvertNamesToSnakeCase(builder);

    }

    private void ChangeTrackerOnTracked(object sender, EntityTrackedEventArgs e)
    {
    }

    private static void ChangeTrackerOnStateChanged(object sender, EntityStateChangedEventArgs e)
    {
    }
    
    private static void ConvertNamesToSnakeCase(ModelBuilder builder) {
        foreach (var type in builder.Model.GetEntityTypes()) {
            var table = type.GetTableName().ToSnakeCase();
            if (table != null) {
                type.SetTableName(table);
                foreach (var property in type.GetProperties()) {
                    var schema = type.GetSchema();
                    var id = StoreObjectIdentifier.Table(table, schema);
                    property.SetColumnName(property.GetColumnName(id).ToSnakeCase());
                }
            }
            foreach (var key in type.GetKeys()) {
                key.SetName(key.GetName().ToSnakeCase());
            }
            foreach (var key in type.GetForeignKeys()) {
                key.SetConstraintName(key.GetConstraintName().ToSnakeCase());
            }
            foreach (var index in type.GetIndexes()) {
                index.SetDatabaseName(index.GetDatabaseName().ToSnakeCase());
            }
        }
    }

}