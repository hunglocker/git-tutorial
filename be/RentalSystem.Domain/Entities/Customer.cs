using RentalSystem.Domain.Constants;

namespace RentalSystem.Domain.Entities;

public class Customer
{
    public Guid Id { get; private set; }

    public string FullName { get; private set; } = string.Empty;

    public string Phone { get; private set; } = string.Empty;

    public string? Email { get; private set; }

    public string? Address { get; private set; }

    public string? IdentityNumber { get; private set; }

    public bool IsActive { get; private set; }

    public DateTime CreatedAt { get; private set; }

    public DateTime? UpdatedAt { get; private set; }

    // Navigation
    public IReadOnlyCollection<RentalOrder> RentalOrders => _rentalOrders.AsReadOnly();
    private readonly List<RentalOrder> _rentalOrders = [];

    private Customer() { }

    public Customer(
        string fullName,
        string phone,
        string? email = null,
        string? address = null,
        string? identityNumber = null)
    {
        Id = Guid.NewGuid();
        CreatedAt = DateTime.UtcNow;
        IsActive = true;
        Update(fullName, phone, email, address, identityNumber);
    }

    public void Update(
        string fullName,
        string phone,
        string? email,
        string? address,
        string? identityNumber)
    {
        if (string.IsNullOrWhiteSpace(fullName))
            throw new ArgumentException("Customer full name is required.", nameof(fullName));

        if (fullName.Length > RentalConstants.CustomerNameMaxLength)
            throw new ArgumentException(
                $"Full name must not exceed {RentalConstants.CustomerNameMaxLength} characters.",
                nameof(fullName));

        if (string.IsNullOrWhiteSpace(phone))
            throw new ArgumentException("Customer phone is required.", nameof(phone));

        if (phone.Length > RentalConstants.CustomerPhoneMaxLength)
            throw new ArgumentException(
                $"Phone must not exceed {RentalConstants.CustomerPhoneMaxLength} characters.",
                nameof(phone));

        if (email is not null && email.Length > RentalConstants.CustomerEmailMaxLength)
            throw new ArgumentException(
                $"Email must not exceed {RentalConstants.CustomerEmailMaxLength} characters.",
                nameof(email));

        FullName = fullName;
        Phone = phone;
        Email = email;
        Address = address;
        IdentityNumber = identityNumber;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Deactivate() => IsActive = false;

    public void Activate() => IsActive = true;
}
