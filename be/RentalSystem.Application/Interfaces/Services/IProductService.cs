using RentalSystem.Application.DTOs.Products;
using RentalSystem.Domain.Enums;

namespace RentalSystem.Application.Interfaces.Services;

public interface IProductService
{
    Task<IReadOnlyList<ProductResponse>> GetAllAsync(
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<ProductResponse>> GetAvailableAsync(
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<ProductResponse>> GetByCategoryAsync(
        Guid categoryId,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<ProductResponse>> GetByStatusAsync(
        ProductStatus status,
        CancellationToken cancellationToken = default);

    Task<ProductResponse?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default);

    Task<ProductResponse> CreateAsync(
        CreateProductRequest request,
        CancellationToken cancellationToken = default);

    Task<ProductResponse> UpdateAsync(
        Guid id,
        UpdateProductRequest request,
        CancellationToken cancellationToken = default);

    Task DeleteAsync(
        Guid id,
        CancellationToken cancellationToken = default);
}
