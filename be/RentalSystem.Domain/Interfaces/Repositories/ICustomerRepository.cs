using RentalSystem.Domain.Entities;

namespace RentalSystem.Domain.Interfaces.Repositories;

public interface ICustomerRepository
{
    Task<Customer?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<Customer>> GetAllAsync(
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<Customer>> SearchAsync(
        string keyword,
        CancellationToken cancellationToken = default);

    Task<bool> ExistsByPhoneAsync(
        string phone,
        Guid? excludeId = null,
        CancellationToken cancellationToken = default);

    Task AddAsync(
        Customer customer,
        CancellationToken cancellationToken = default);

    void Update(Customer customer);

    void Delete(Customer customer);
}
