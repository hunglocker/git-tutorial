using RentalSystem.Application.DTOs.RentalOrders;
using RentalSystem.Domain.Enums;

namespace RentalSystem.Application.Interfaces.Services;

public interface IRentalOrderService
{
    Task<IReadOnlyList<RentalOrderResponse>> GetAllAsync(
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<RentalOrderResponse>> GetByStatusAsync(
        RentalStatus status,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<RentalOrderResponse>> GetByCustomerAsync(
        Guid customerId,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<RentalOrderResponse>> GetOverdueAsync(
        CancellationToken cancellationToken = default);

    Task<RentalOrderResponse?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default);

    Task<RentalOrderResponse> CreateAsync(
        CreateRentalOrderRequest request,
        CancellationToken cancellationToken = default);

    Task<RentalOrderResponse> ActivateAsync(
        Guid id,
        CancellationToken cancellationToken = default);

    Task<RentalOrderResponse> ReturnAsync(
        Guid id,
        ReturnRentalOrderRequest request,
        CancellationToken cancellationToken = default);

    Task<RentalOrderResponse> CancelAsync(
        Guid id,
        CancelRentalOrderRequest request,
        CancellationToken cancellationToken = default);

    Task<RentalOrderResponse> MarkAsPaidAsync(
        Guid id,
        CancellationToken cancellationToken = default);
}
