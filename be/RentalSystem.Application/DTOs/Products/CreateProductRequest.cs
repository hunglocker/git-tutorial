namespace RentalSystem.Application.DTOs.Products;

public sealed record CreateProductRequest(
    string Code,
    string Name,
    decimal DailyRentalPrice,
    Guid CategoryId,
    string? Description);
