using RentalSystem.Domain.Constants;
using RentalSystem.Domain.Enums;

namespace RentalSystem.Domain.Entities;

public class Product
{
    public Guid Id { get; private set; }

    public string Code { get; private set; } = string.Empty;

    public string Name { get; private set; } = string.Empty;

    public string? Description { get; private set; }

    public decimal DailyRentalPrice { get; private set; }

    public ProductStatus Status { get; private set; }

    public Guid CategoryId { get; private set; }

    public DateTime CreatedAt { get; private set; }

    public DateTime? UpdatedAt { get; private set; }

    // Navigation
    public Category? Category { get; private set; }

    public IReadOnlyCollection<RentalOrder> RentalOrders => _rentalOrders.AsReadOnly();
    private readonly List<RentalOrder> _rentalOrders = [];

    private Product() { }

    public Product(
        string code,
        string name,
        decimal dailyRentalPrice,
        Guid categoryId,
        string? description = null)
    {
        Id = Guid.NewGuid();
        CreatedAt = DateTime.UtcNow;
        Status = ProductStatus.Available;
        Update(code, name, dailyRentalPrice, categoryId, description);
    }

    public void Update(
        string code,
        string name,
        decimal dailyRentalPrice,
        Guid categoryId,
        string? description)
    {
        if (string.IsNullOrWhiteSpace(code))
            throw new ArgumentException("Product code is required.", nameof(code));

        if (code.Length > RentalConstants.ProductCodeMaxLength)
            throw new ArgumentException(
                $"Product code must not exceed {RentalConstants.ProductCodeMaxLength} characters.",
                nameof(code));

        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Product name is required.", nameof(name));

        if (name.Length > RentalConstants.ProductNameMaxLength)
            throw new ArgumentException(
                $"Product name must not exceed {RentalConstants.ProductNameMaxLength} characters.",
                nameof(name));

        if (dailyRentalPrice < RentalConstants.MinRentalPrice)
            throw new ArgumentOutOfRangeException(
                nameof(dailyRentalPrice),
                "Daily rental price must be non-negative.");

        if (categoryId == Guid.Empty)
            throw new ArgumentException("Category is required.", nameof(categoryId));

        Code = code;
        Name = name;
        DailyRentalPrice = dailyRentalPrice;
        CategoryId = categoryId;
        Description = description;
        UpdatedAt = DateTime.UtcNow;
    }

    public void MarkAsRented()
    {
        if (Status != ProductStatus.Available)
            throw new InvalidOperationException(
                $"Product cannot be rented. Current status: {Status}.");

        Status = ProductStatus.Rented;
        UpdatedAt = DateTime.UtcNow;
    }

    public void MarkAsAvailable()
    {
        Status = ProductStatus.Available;
        UpdatedAt = DateTime.UtcNow;
    }

    public void MarkAsMaintenance()
    {
        Status = ProductStatus.Maintenance;
        UpdatedAt = DateTime.UtcNow;
    }
}
