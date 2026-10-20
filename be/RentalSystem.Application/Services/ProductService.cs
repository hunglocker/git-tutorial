using RentalSystem.Application.DTOs.Products;
using RentalSystem.Application.Exceptions;
using RentalSystem.Application.Interfaces.Services;
using RentalSystem.Domain.Entities;
using RentalSystem.Domain.Enums;
using RentalSystem.Domain.Interfaces;
using RentalSystem.Domain.Interfaces.Repositories;

namespace RentalSystem.Application.Services;

public sealed class ProductService : IProductService
{
    private readonly IProductRepository _productRepository;
    private readonly ICategoryRepository _categoryRepository;
    private readonly IUnitOfWork _unitOfWork;

    public ProductService(
        IProductRepository productRepository,
        ICategoryRepository categoryRepository,
        IUnitOfWork unitOfWork)
    {
        _productRepository = productRepository;
        _categoryRepository = categoryRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<IReadOnlyList<ProductResponse>> GetAllAsync(
        CancellationToken cancellationToken = default)
    {
        var products = await _productRepository.GetAllAsync(cancellationToken);
        return products.Select(MapToResponse).ToList();
    }

    public async Task<IReadOnlyList<ProductResponse>> GetAvailableAsync(
        CancellationToken cancellationToken = default)
    {
        var products = await _productRepository.GetByStatusAsync(
            ProductStatus.Available,
            cancellationToken);

        return products.Select(MapToResponse).ToList();
    }

    public async Task<IReadOnlyList<ProductResponse>> GetByCategoryAsync(
        Guid categoryId,
        CancellationToken cancellationToken = default)
    {
        var products = await _productRepository.GetByCategoryAsync(categoryId, cancellationToken);
        return products.Select(MapToResponse).ToList();
    }

    public async Task<IReadOnlyList<ProductResponse>> GetByStatusAsync(
        ProductStatus status,
        CancellationToken cancellationToken = default)
    {
        var products = await _productRepository.GetByStatusAsync(status, cancellationToken);
        return products.Select(MapToResponse).ToList();
    }

    public async Task<ProductResponse?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var product = await _productRepository.GetByIdAsync(id, cancellationToken);
        return product is null ? null : MapToResponse(product);
    }

    public async Task<ProductResponse> CreateAsync(
        CreateProductRequest request,
        CancellationToken cancellationToken = default)
    {
        var codeExists = await _productRepository.ExistsByCodeAsync(
            request.Code,
            cancellationToken: cancellationToken);

        if (codeExists)
            throw new ConflictException(
                $"Product with code '{request.Code}' already exists.");

        var category = await _categoryRepository.GetByIdAsync(request.CategoryId, cancellationToken)
            ?? throw new NotFoundException(nameof(Category), request.CategoryId);

        var product = new Product(
            request.Code,
            request.Name,
            request.DailyRentalPrice,
            request.CategoryId,
            request.Description);

        await _productRepository.AddAsync(product, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // Attach category for response mapping
        return MapToResponse(product, category.Name);
    }

    public async Task<ProductResponse> UpdateAsync(
        Guid id,
        UpdateProductRequest request,
        CancellationToken cancellationToken = default)
    {
        var product = await _productRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException(nameof(Product), id);

        var codeExists = await _productRepository.ExistsByCodeAsync(
            request.Code,
            excludeId: id,
            cancellationToken: cancellationToken);

        if (codeExists)
            throw new ConflictException(
                $"Product with code '{request.Code}' already exists.");

        var category = await _categoryRepository.GetByIdAsync(request.CategoryId, cancellationToken)
            ?? throw new NotFoundException(nameof(Category), request.CategoryId);

        product.Update(
            request.Code,
            request.Name,
            request.DailyRentalPrice,
            request.CategoryId,
            request.Description);

        _productRepository.Update(product);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return MapToResponse(product, category.Name);
    }

    public async Task DeleteAsync(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var product = await _productRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException(nameof(Product), id);

        if (product.Status == ProductStatus.Rented)
            throw new BusinessRuleException(
                "Cannot delete a product that is currently rented.");

        _productRepository.Delete(product);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    private static ProductResponse MapToResponse(Product product, string? categoryName = null) =>
        new(
            product.Id,
            product.Code,
            product.Name,
            product.Description,
            product.DailyRentalPrice,
            product.Status,
            product.Status.ToString(),
            product.CategoryId,
            categoryName ?? product.Category?.Name ?? string.Empty,
            product.CreatedAt,
            product.UpdatedAt);
}
