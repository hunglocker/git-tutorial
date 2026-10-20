using RentalSystem.Domain.Entities;
using RentalSystem.Domain.Enums;

namespace RentalSystem.Domain.Interfaces.Repositories;

public interface IRentalOrderRepository
{
    Task<RentalOrder?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default);

    Task<RentalOrder?> GetByOrderCodeAsync(
        string orderCode,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<RentalOrder>> GetAllAsync(
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<RentalOrder>> GetByCustomerAsync(
        Guid customerId,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<RentalOrder>> GetByProductAsync(
        Guid productId,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<RentalOrder>> GetByStatusAsync(
        RentalStatus status,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<RentalOrder>> GetOverdueAsync(
        CancellationToken cancellationToken = default);

    Task<bool> ExistsByOrderCodeAsync(
        string orderCode,
        CancellationToken cancellationToken = default);

    Task AddAsync(
        RentalOrder rentalOrder,
        CancellationToken cancellationToken = default);

    void Update(RentalOrder rentalOrder);
}
