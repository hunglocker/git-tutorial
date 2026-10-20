using RentalSystem.Domain.Constants;

namespace RentalSystem.Domain.Entities;

public class Category
{
    public Guid Id { get; private set; }

    public string Name { get; private set; } = string.Empty;

    public string? Description { get; private set; }

    public bool IsActive { get; private set; }

    public DateTime CreatedAt { get; private set; }

    public DateTime? UpdatedAt { get; private set; }

    // Navigation
    public IReadOnlyCollection<Product> Products => _products.AsReadOnly();
    private readonly List<Product> _products = [];

    private Category() { }

    public Category(string name, string? description = null)
    {
        Id = Guid.NewGuid();
        CreatedAt = DateTime.UtcNow;
        IsActive = true;
        Update(name, description);
    }

    public void Update(string name, string? description)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Category name is required.", nameof(name));

        if (name.Length > RentalConstants.ProductNameMaxLength)
            throw new ArgumentException(
                $"Category name must not exceed {RentalConstants.ProductNameMaxLength} characters.",
                nameof(name));

        Name = name;
        Description = description;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Deactivate() => IsActive = false;

    public void Activate() => IsActive = true;
}
