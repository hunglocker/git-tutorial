using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RentalSystem.Domain.Constants;
using RentalSystem.Domain.Entities;
using RentalSystem.Domain.Enums;

namespace RentalSystem.Infrastructure.Persistence.Configurations;

public sealed class RentalOrderConfiguration : IEntityTypeConfiguration<RentalOrder>
{
    public void Configure(EntityTypeBuilder<RentalOrder> builder)
    {
        builder.ToTable("RentalOrders");

        builder.HasKey(r => r.Id);

        builder.Property(r => r.Id)
            .ValueGeneratedNever();

        builder.Property(r => r.OrderCode)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(r => r.CustomerId)
            .IsRequired();

        builder.Property(r => r.ProductId)
            .IsRequired();

        builder.Property(r => r.StartDate)
            .IsRequired();

        builder.Property(r => r.ExpectedReturnDate)
            .IsRequired();

        builder.Property(r => r.ActualReturnDate);

        builder.Property(r => r.DailyRentalPrice)
            .IsRequired()
            .HasColumnType("decimal(18,2)");

        builder.Property(r => r.TotalAmount)
            .IsRequired()
            .HasColumnType("decimal(18,2)");

        builder.Property(r => r.DepositAmount)
            .IsRequired()
            .HasColumnType("decimal(18,2)");

        builder.Property(r => r.Status)
            .IsRequired()
            .HasDefaultValue(RentalStatus.Pending)
            .HasConversion<string>();

        builder.Property(r => r.PaymentStatus)
            .IsRequired()
            .HasDefaultValue(PaymentStatus.Unpaid)
            .HasConversion<string>();

        builder.Property(r => r.Note)
            .HasMaxLength(RentalConstants.NoteMaxLength);

        builder.Property(r => r.CreatedAt)
            .IsRequired();

        builder.Property(r => r.UpdatedAt);

        builder.HasIndex(r => r.OrderCode)
            .IsUnique();

        builder.HasOne(r => r.Customer)
            .WithMany(c => c.RentalOrders)
            .HasForeignKey(r => r.CustomerId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(r => r.Product)
            .WithMany(p => p.RentalOrders)
            .HasForeignKey(r => r.ProductId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
