namespace RentalSystem.Application.DTOs.Customers;

public sealed record CustomerResponse(
    Guid Id,
    string FullName,
    string Phone,
    string? Email,
    string? Address,
    string? IdentityNumber,
    bool IsActive,
    DateTime CreatedAt,
    DateTime? UpdatedAt);
