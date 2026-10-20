namespace RentalSystem.Application.DTOs.RentalOrders;

public sealed record CancelRentalOrderRequest(
    string? Reason);
