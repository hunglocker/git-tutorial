using RentalSystem.Domain.Constants;
using RentalSystem.Domain.Enums;

namespace RentalSystem.Domain.Entities;

public class RentalOrder
{
    public Guid Id { get; private set; }

    public string OrderCode { get; private set; } = string.Empty;

    public Guid CustomerId { get; private set; }

    public Guid ProductId { get; private set; }

    public DateTime StartDate { get; private set; }

    public DateTime ExpectedReturnDate { get; private set; }

    public DateTime? ActualReturnDate { get; private set; }

    public decimal DailyRentalPrice { get; private set; }

    public decimal TotalAmount { get; private set; }

    public decimal DepositAmount { get; private set; }

    public RentalStatus Status { get; private set; }

    public PaymentStatus PaymentStatus { get; private set; }

    public string? Note { get; private set; }

    public DateTime CreatedAt { get; private set; }

    public DateTime? UpdatedAt { get; private set; }

    // Navigation
    public Customer? Customer { get; private set; }

    public Product? Product { get; private set; }

    private RentalOrder() { }

    public RentalOrder(
        string orderCode,
        Guid customerId,
        Guid productId,
        DateTime startDate,
        DateTime expectedReturnDate,
        decimal dailyRentalPrice,
        decimal depositAmount,
        string? note = null)
    {
        if (string.IsNullOrWhiteSpace(orderCode))
            throw new ArgumentException("Order code is required.", nameof(orderCode));

        if (customerId == Guid.Empty)
            throw new ArgumentException("Customer is required.", nameof(customerId));

        if (productId == Guid.Empty)
            throw new ArgumentException("Product is required.", nameof(productId));

        if (expectedReturnDate <= startDate)
            throw new ArgumentException(
                "Expected return date must be after start date.",
                nameof(expectedReturnDate));

        if (dailyRentalPrice < RentalConstants.MinRentalPrice)
            throw new ArgumentOutOfRangeException(
                nameof(dailyRentalPrice),
                "Daily rental price must be non-negative.");

        if (depositAmount < 0)
            throw new ArgumentOutOfRangeException(
                nameof(depositAmount),
                "Deposit amount must be non-negative.");

        Id = Guid.NewGuid();
        OrderCode = orderCode;
        CustomerId = customerId;
        ProductId = productId;
        StartDate = startDate;
        ExpectedReturnDate = expectedReturnDate;
        DailyRentalPrice = dailyRentalPrice;
        DepositAmount = depositAmount;
        Note = note;
        Status = RentalStatus.Pending;
        PaymentStatus = PaymentStatus.Unpaid;
        CreatedAt = DateTime.UtcNow;

        TotalAmount = CalculateTotalAmount(startDate, expectedReturnDate, dailyRentalPrice);
    }

    public void Activate()
    {
        if (Status != RentalStatus.Pending)
            throw new InvalidOperationException(
                $"Order cannot be activated. Current status: {Status}.");

        Status = RentalStatus.Active;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Return(DateTime actualReturnDate)
    {
        if (Status != RentalStatus.Active)
            throw new InvalidOperationException(
                $"Order cannot be returned. Current status: {Status}.");

        if (actualReturnDate < StartDate)
            throw new ArgumentException(
                "Actual return date cannot be before start date.",
                nameof(actualReturnDate));

        ActualReturnDate = actualReturnDate;
        TotalAmount = CalculateTotalAmount(StartDate, actualReturnDate, DailyRentalPrice);
        Status = RentalStatus.Returned;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Cancel(string? reason = null)
    {
        if (Status is RentalStatus.Returned or RentalStatus.Cancelled)
            throw new InvalidOperationException(
                $"Order cannot be cancelled. Current status: {Status}.");

        Note = reason ?? Note;
        Status = RentalStatus.Cancelled;
        UpdatedAt = DateTime.UtcNow;
    }

    public void MarkAsOverdue()
    {
        if (Status != RentalStatus.Active)
            throw new InvalidOperationException(
                $"Order cannot be marked as overdue. Current status: {Status}.");

        Status = RentalStatus.Overdue;
        UpdatedAt = DateTime.UtcNow;
    }

    public void MarkAsPaid()
    {
        PaymentStatus = PaymentStatus.Paid;
        UpdatedAt = DateTime.UtcNow;
    }

    private static decimal CalculateTotalAmount(
        DateTime start,
        DateTime end,
        decimal dailyPrice)
    {
        var days = Math.Max(1, (int)Math.Ceiling((end - start).TotalDays));
        return days * dailyPrice;
    }
}
