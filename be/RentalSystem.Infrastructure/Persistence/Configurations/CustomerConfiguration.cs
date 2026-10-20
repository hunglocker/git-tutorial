using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RentalSystem.Domain.Constants;
using RentalSystem.Domain.Entities;

namespace RentalSystem.Infrastructure.Persistence.Configurations;

public sealed class CustomerConfiguration : IEntityTypeConfiguration<Customer>
{
    public void Configure(EntityTypeBuilder<Customer> builder)
    {
        builder.ToTable("Customers");

        builder.HasKey(c => c.Id);

        builder.Property(c => c.Id)
            .ValueGeneratedNever();

        builder.Property(c => c.FullName)
            .IsRequired()
            .HasMaxLength(RentalConstants.CustomerNameMaxLength);

        builder.Property(c => c.Phone)
            .IsRequired()
            .HasMaxLength(RentalConstants.CustomerPhoneMaxLength);

        builder.Property(c => c.Email)
            .HasMaxLength(RentalConstants.CustomerEmailMaxLength);

        builder.Property(c => c.Address)
            .HasMaxLength(RentalConstants.DescriptionMaxLength);

        builder.Property(c => c.IdentityNumber)
            .HasMaxLength(50);

        builder.Property(c => c.IsActive)
            .IsRequired()
            .HasDefaultValue(true);

        builder.Property(c => c.CreatedAt)
            .IsRequired();

        builder.Property(c => c.UpdatedAt);

        builder.HasIndex(c => c.Phone)
            .IsUnique();

        builder.HasMany(c => c.RentalOrders)
            .WithOne(r => r.Customer)
            .HasForeignKey(r => r.CustomerId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
