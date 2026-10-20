using RentalSystem.Domain.Entities;

namespace RentalSystem.Domain.Interfaces.Repositories;

public interface ICategoryRepository
{
    Task<Category?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<Category>> GetAllAsync(
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<Category>> GetActiveAsync(
        CancellationToken cancellationToken = default);

    Task<bool> ExistsByNameAsync(
        string name,
        Guid? excludeId = null,
        CancellationToken cancellationToken = default);

    Task AddAsync(
        Category category,
        CancellationToken cancellationToken = default);

    void Update(Category category);

    void Delete(Category category);
}
