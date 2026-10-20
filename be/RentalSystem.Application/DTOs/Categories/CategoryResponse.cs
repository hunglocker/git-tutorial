namespace RentalSystem.Application.DTOs.Categories;

public sealed record CategoryResponse(
    Guid Id,
    string Name,
    string? Description,
    bool IsActive,
    DateTime CreatedAt,
    DateTime? UpdatedAt);
