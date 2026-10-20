using RentalSystem.Application.DTOs.RentalOrders;
using RentalSystem.Application.Exceptions;
using RentalSystem.Application.Interfaces.Services;
using RentalSystem.Domain.Entities;
using RentalSystem.Domain.Enums;
using RentalSystem.Domain.Interfaces;
using RentalSystem.Domain.Interfaces.Repositories;

namespace RentalSystem.Application.Services;

public sealed class RentalOrderService : IRentalOrderService
{
    private readonly IRentalOrderRepository _rentalOrderRepository;
    private readonly IProductRepository _productRepository;
    private readonly ICustomerRepository _customerRepository;
    private readonly IUnitOfWork _unitOfWork;

    public RentalOrderService(
        IRentalOrderRepository rentalOrderRepository,
        IProductRepository productRepository,
        ICustomerRepository customerRepository,
        IUnitOfWork unitOfWork)
    {
        _rentalOrderRepository = rentalOrderRepository;
        _productRepository = productRepository;
        _customerRepository = customerRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<IReadOnlyList<RentalOrderResponse>> GetAllAsync(
        CancellationToken cancellationToken = default)
    {
        var orders = await _rentalOrderRepository.GetAllAsync(cancellationToken);
        return orders.Select(MapToResponse).ToList();
    }

    public async Task<IReadOnlyList<RentalOrderResponse>> GetByStatusAsync(
        RentalStatus status,
        CancellationToken cancellationToken = default)
    {
        var orders = await _rentalOrderRepository.GetByStatusAsync(status, cancellationToken);
        return orders.Select(MapToResponse).ToList();
    }

    public async Task<IReadOnlyList<RentalOrderResponse>> GetByCustomerAsync(
        Guid customerId,
        CancellationToken cancellationToken = default)
    {
        var orders = await _rentalOrderRepository.GetByCustomerAsync(customerId, cancellationToken);
        return orders.Select(MapToResponse).ToList();
    }

    public async Task<IReadOnlyList<RentalOrderResponse>> GetOverdueAsync(
        CancellationToken cancellationToken = default)
    {
        var orders = await _rentalOrderRepository.GetOverdueAsync(cancellationToken);
        return orders.Select(MapToResponse).ToList();
    }

    public async Task<RentalOrderResponse?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var order = await _rentalOrderRepository.GetByIdAsync(id, cancellationToken);
        return order is null ? null : MapToResponse(order);
    }

    public async Task<RentalOrderResponse> CreateAsync(
        CreateRentalOrderRequest request,
        CancellationToken cancellationToken = default)
    {
        var customer = await _customerRepository.GetByIdAsync(request.CustomerId, cancellationToken)
            ?? throw new NotFoundException(nameof(Customer), request.CustomerId);

        var product = await _productRepository.GetByIdAsync(request.ProductId, cancellationToken)
            ?? throw new NotFoundException(nameof(Product), request.ProductId);

        if (product.Status != ProductStatus.Available)
            throw new BusinessRuleException(
                $"Product '{product.Name}' is not available for rent. Current status: {product.Status}.");

        var orderCode = GenerateOrderCode();

        var order = new RentalOrder(
            orderCode,
            request.CustomerId,
            request.ProductId,
            request.StartDate,
            request.ExpectedReturnDate,
            product.DailyRentalPrice,
            request.DepositAmount,
            request.Note);

        product.MarkAsRented();

        await _rentalOrderRepository.AddAsync(order, cancellationToken);
        _productRepository.Update(product);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return MapToResponse(order, customer, product);
    }

    public async Task<RentalOrderResponse> ActivateAsync(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var order = await _rentalOrderRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException(nameof(RentalOrder), id);

        order.Activate();

        _rentalOrderRepository.Update(order);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return MapToResponse(order);
    }

    public async Task<RentalOrderResponse> ReturnAsync(
        Guid id,
        ReturnRentalOrderRequest request,
        CancellationToken cancellationToken = default)
    {
        var order = await _rentalOrderRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException(nameof(RentalOrder), id);

        var product = await _productRepository.GetByIdAsync(order.ProductId, cancellationToken)
            ?? throw new NotFoundException(nameof(Product), order.ProductId);

        order.Return(request.ActualReturnDate);
        product.MarkAsAvailable();

        _rentalOrderRepository.Update(order);
        _productRepository.Update(product);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return MapToResponse(order);
    }

    public async Task<RentalOrderResponse> CancelAsync(
        Guid id,
        CancelRentalOrderRequest request,
        CancellationToken cancellationToken = default)
    {
        var order = await _rentalOrderRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException(nameof(RentalOrder), id);

        var product = await _productRepository.GetByIdAsync(order.ProductId, cancellationToken)
            ?? throw new NotFoundException(nameof(Product), order.ProductId);

        order.Cancel(request.Reason);

        if (product.Status == ProductStatus.Rented)
            product.MarkAsAvailable();

        _rentalOrderRepository.Update(order);
        _productRepository.Update(product);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return MapToResponse(order);
    }

    public async Task<RentalOrderResponse> MarkAsPaidAsync(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var order = await _rentalOrderRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException(nameof(RentalOrder), id);

        order.MarkAsPaid();

        _rentalOrderRepository.Update(order);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return MapToResponse(order);
    }

    private static string GenerateOrderCode()
    {
        var timestamp = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
        var suffix = Guid.NewGuid().ToString("N")[..6].ToUpper();
        return $"RNT-{timestamp}-{suffix}";
    }

    private static RentalOrderResponse MapToResponse(
        RentalOrder order,
        Customer? customer = null,
        Product? product = null) =>
        new(
            order.Id,
            order.OrderCode,
            order.CustomerId,
            customer?.FullName ?? order.Customer?.FullName ?? string.Empty,
            customer?.Phone ?? order.Customer?.Phone ?? string.Empty,
            order.ProductId,
            product?.Name ?? order.Product?.Name ?? string.Empty,
            product?.Code ?? order.Product?.Code ?? string.Empty,
            order.StartDate,
            order.ExpectedReturnDate,
            order.ActualReturnDate,
            order.DailyRentalPrice,
            order.TotalAmount,
            order.DepositAmount,
            order.Status,
            order.Status.ToString(),
            order.PaymentStatus,
            order.PaymentStatus.ToString(),
            order.Note,
            order.CreatedAt,
            order.UpdatedAt);
}
