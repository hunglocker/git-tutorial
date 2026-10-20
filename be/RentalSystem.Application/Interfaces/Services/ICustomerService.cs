using RentalSystem.Application.DTOs.Customers;

namespace RentalSystem.Application.Interfaces.Services;

public interface ICustomerService
{
    Task<IReadOnlyList<CustomerResponse>> GetAllAsync(
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<CustomerResponse>> SearchAsync(
        string keyword,
        CancellationToken cancellationToken = default);

    Task<CustomerResponse?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default);

    Task<CustomerResponse> CreateAsync(
        CreateCustomerRequest request,
        CancellationToken cancellationToken = default);

    Task<CustomerResponse> UpdateAsync(
        Guid id,
        UpdateCustomerRequest request,
        CancellationToken cancellationToken = default);

    Task DeleteAsync(
        Guid id,
        CancellationToken cancellationToken = default);
}
