namespace RentalSystem.Application.DTOs.Products;

public sealed record UpdateProductRequest(
    string Code,
    string Name,
    decimal DailyRentalPrice,
    Guid CategoryId,
    string? Description);
