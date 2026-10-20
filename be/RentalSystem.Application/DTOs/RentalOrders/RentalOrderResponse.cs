using RentalSystem.Domain.Enums;

namespace RentalSystem.Application.DTOs.RentalOrders;

public sealed record RentalOrderResponse(
    Guid Id,
    string OrderCode,
    Guid CustomerId,
    string CustomerName,
    string CustomerPhone,
    Guid ProductId,
    string ProductName,
    string ProductCode,
    DateTime StartDate,
    DateTime ExpectedReturnDate,
    DateTime? ActualReturnDate,
    decimal DailyRentalPrice,
    decimal TotalAmount,
    decimal DepositAmount,
    RentalStatus Status,
    string StatusDisplay,
    PaymentStatus PaymentStatus,
    string PaymentStatusDisplay,
    string? Note,
    DateTime CreatedAt,
    DateTime? UpdatedAt);
