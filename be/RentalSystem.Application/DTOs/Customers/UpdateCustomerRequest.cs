namespace RentalSystem.Application.DTOs.Customers;

public sealed record UpdateCustomerRequest(
    string FullName,
    string Phone,
    string? Email,
    string? Address,
    string? IdentityNumber);
