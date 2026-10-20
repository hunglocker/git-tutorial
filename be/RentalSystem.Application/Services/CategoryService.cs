using RentalSystem.Application.DTOs.Categories;
using RentalSystem.Application.Exceptions;
using RentalSystem.Application.Interfaces.Services;
using RentalSystem.Domain.Entities;
using RentalSystem.Domain.Interfaces;
using RentalSystem.Domain.Interfaces.Repositories;

namespace RentalSystem.Application.Services;

public sealed class CategoryService : ICategoryService
{
    private readonly ICategoryRepository _categoryRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CategoryService(
        ICategoryRepository categoryRepository,
        IUnitOfWork unitOfWork)
    {
        _categoryRepository = categoryRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<IReadOnlyList<CategoryResponse>> GetAllAsync(
        CancellationToken cancellationToken = default)
    {
        var categories = await _categoryRepository.GetAllAsync(cancellationToken);
        return categories.Select(MapToResponse).ToList();
    }

    public async Task<IReadOnlyList<CategoryResponse>> GetActiveAsync(
        CancellationToken cancellationToken = default)
    {
        var categories = await _categoryRepository.GetActiveAsync(cancellationToken);
        return categories.Select(MapToResponse).ToList();
    }

    public async Task<CategoryResponse?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var category = await _categoryRepository.GetByIdAsync(id, cancellationToken);
        return category is null ? null : MapToResponse(category);
    }

    public async Task<CategoryResponse> CreateAsync(
        CreateCategoryRequest request,
        CancellationToken cancellationToken = default)
    {
        var exists = await _categoryRepository.ExistsByNameAsync(
            request.Name,
            cancellationToken: cancellationToken);

        if (exists)
            throw new ConflictException(
                $"Category with name '{request.Name}' already exists.");

        var category = new Category(request.Name, request.Description);

        await _categoryRepository.AddAsync(category, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return MapToResponse(category);
    }

    public async Task<CategoryResponse> UpdateAsync(
        Guid id,
        UpdateCategoryRequest request,
        CancellationToken cancellationToken = default)
    {
        var category = await _categoryRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException(nameof(Category), id);

        var exists = await _categoryRepository.ExistsByNameAsync(
            request.Name,
            excludeId: id,
            cancellationToken: cancellationToken);

        if (exists)
            throw new ConflictException(
                $"Category with name '{request.Name}' already exists.");

        category.Update(request.Name, request.Description);

        _categoryRepository.Update(category);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return MapToResponse(category);
    }

    public async Task DeleteAsync(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var category = await _categoryRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException(nameof(Category), id);

        _categoryRepository.Delete(category);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    private static CategoryResponse MapToResponse(Category category) =>
        new(
            category.Id,
            category.Name,
            category.Description,
            category.IsActive,
            category.CreatedAt,
            category.UpdatedAt);
}
