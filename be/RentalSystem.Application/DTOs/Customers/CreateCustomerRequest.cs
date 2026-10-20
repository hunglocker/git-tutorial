namespace RentalSystem.Application.DTOs.Customers;

public sealed record CreateCustomerRequest(
    string FullName,
    string Phone,
    string? Email,
    string? Address,
    string? IdentityNumber);
