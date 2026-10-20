namespace RentalSystem.Application.DTOs.RentalOrders;

public sealed record CreateRentalOrderRequest(
    Guid CustomerId,
    Guid ProductId,
    DateTime StartDate,
    DateTime ExpectedReturnDate,
    decimal DepositAmount,
    string? Note);
