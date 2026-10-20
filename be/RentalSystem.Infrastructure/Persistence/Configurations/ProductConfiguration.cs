using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RentalSystem.Domain.Constants;
using RentalSystem.Domain.Entities;
using RentalSystem.Domain.Enums;

namespace RentalSystem.Infrastructure.Persistence.Configurations;

public sealed class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.ToTable("Products");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.Id)
            .ValueGeneratedNever();

        builder.Property(p => p.Code)
            .IsRequired()
            .HasMaxLength(RentalConstants.ProductCodeMaxLength);

        builder.Property(p => p.Name)
            .IsRequired()
            .HasMaxLength(RentalConstants.ProductNameMaxLength);

        builder.Property(p => p.Description)
            .HasMaxLength(RentalConstants.DescriptionMaxLength);

        builder.Property(p => p.DailyRentalPrice)
            .IsRequired()
            .HasColumnType("decimal(18,2)");

        builder.Property(p => p.Status)
            .IsRequired()
            .HasDefaultValue(ProductStatus.Available)
            .HasConversion<string>();

        builder.Property(p => p.CategoryId)
            .IsRequired();

        builder.Property(p => p.CreatedAt)
            .IsRequired();

        builder.Property(p => p.UpdatedAt);

        builder.HasIndex(p => p.Code)
            .IsUnique();

        builder.HasMany(p => p.RentalOrders)
            .WithOne(r => r.Product)
            .HasForeignKey(r => r.ProductId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
