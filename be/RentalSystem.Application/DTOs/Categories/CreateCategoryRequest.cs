namespace RentalSystem.Application.DTOs.Categories;

public sealed record CreateCategoryRequest(
    string Name,
    string? Description);
