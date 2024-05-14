using Microsoft.AspNetCore.Identity;
using Audit.EntityFramework;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using webapi.Models;
using webapi.Models.Base;
using webapi.Service.Abstract;
using webapi.Utils;

namespace webapi.Data;

public partial class ApplicationDbContext : AuditIdentityDbContext<IdentityUser>
{
    private readonly IUserIdProvider _currentUserProvider;
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
        _currentUserProvider = this.GetService<IUserIdProvider>();
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
        ConfigureModels(builder);
    }

    private void ChangeTrackerOnTracked(object sender, EntityTrackedEventArgs e)
    {
        if (!(e.Entry.Entity is DbEntity entity)) {
            return;
        }
        switch (e.Entry.State) {
            case EntityState.Added:
                // Проставляем дату создания только во вновь созданных, пропускаем загруженные из БД.
                if (!e.FromQuery) {
                    if (string.IsNullOrEmpty(entity.AppUserId)) {
                        entity.AppUserId = _currentUserProvider.TryGetCurrentUserId();
                    }
                    entity.CreatedAt = DateTime.Now;
                }
                break;
            case EntityState.Modified:
                e.Entry.Property(nameof(entity.CreatedAt)).IsModified = false;
                entity.ModifiedAt = DateTime.Now;
                break;
        }
    }

    private static void ChangeTrackerOnStateChanged(object sender, EntityStateChangedEventArgs e)
    {
        if (!(e.Entry.Entity is DbEntity entity)) {
            return;
        }
        switch (e.NewState) {
            case EntityState.Modified:
                e.Entry.Property(nameof(entity.CreatedAt)).IsModified = false;
                entity.ModifiedAt = DateTime.Now;
                break;
        }
    }

    private void ConfigureModels(ModelBuilder builder)
    {
        builder.Entity<UserFile>()
            .HasKey(e => new { e.FileId, e.UserId });
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