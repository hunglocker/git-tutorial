using RentalSystem.Domain.Enums;

namespace RentalSystem.Application.DTOs.Products;

public sealed record ProductResponse(
    Guid Id,
    string Code,
    string Name,
    string? Description,
    decimal DailyRentalPrice,
    ProductStatus Status,
    string StatusDisplay,
    Guid CategoryId,
    string CategoryName,
    DateTime CreatedAt,
    DateTime? UpdatedAt);
