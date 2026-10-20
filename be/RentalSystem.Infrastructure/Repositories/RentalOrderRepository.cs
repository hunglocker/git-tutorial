using Microsoft.EntityFrameworkCore;
using RentalSystem.Domain.Entities;
using RentalSystem.Domain.Enums;
using RentalSystem.Domain.Interfaces.Repositories;
using RentalSystem.Infrastructure.Persistence;

namespace RentalSystem.Infrastructure.Repositories;

public sealed class RentalOrderRepository : IRentalOrderRepository
{
    private readonly AppDbContext _context;

    public RentalOrderRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<RentalOrder?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        return await _context.RentalOrders
            .Include(r => r.Customer)
            .Include(r => r.Product)
            .FirstOrDefaultAsync(r => r.Id == id, cancellationToken);
    }

    public async Task<RentalOrder?> GetByOrderCodeAsync(
        string orderCode,
        CancellationToken cancellationToken = default)
    {
        return await _context.RentalOrders
            .Include(r => r.Customer)
            .Include(r => r.Product)
            .FirstOrDefaultAsync(r => r.OrderCode == orderCode, cancellationToken);
    }

    public async Task<IReadOnlyList<RentalOrder>> GetAllAsync(
        CancellationToken cancellationToken = default)
    {
        return await _context.RentalOrders
            .AsNoTracking()
            .Include(r => r.Customer)
            .Include(r => r.Product)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<RentalOrder>> GetByCustomerAsync(
        Guid customerId,
        CancellationToken cancellationToken = default)
    {
        return await _context.RentalOrders
            .AsNoTracking()
            .Include(r => r.Customer)
            .Include(r => r.Product)
            .Where(r => r.CustomerId == customerId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<RentalOrder>> GetByProductAsync(
        Guid productId,
        CancellationToken cancellationToken = default)
    {
        return await _context.RentalOrders
            .AsNoTracking()
            .Include(r => r.Customer)
            .Include(r => r.Product)
            .Where(r => r.ProductId == productId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<RentalOrder>> GetByStatusAsync(
        RentalStatus status,
        CancellationToken cancellationToken = default)
    {
        return await _context.RentalOrders
            .AsNoTracking()
            .Include(r => r.Customer)
            .Include(r => r.Product)
            .Where(r => r.Status == status)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<RentalOrder>> GetOverdueAsync(
        CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;

        return await _context.RentalOrders
            .AsNoTracking()
            .Include(r => r.Customer)
            .Include(r => r.Product)
            .Where(r =>
                (r.Status == RentalStatus.Active || r.Status == RentalStatus.Overdue) &&
                r.ExpectedReturnDate < now)
            .OrderBy(r => r.ExpectedReturnDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<bool> ExistsByOrderCodeAsync(
        string orderCode,
        CancellationToken cancellationToken = default)
    {
        return await _context.RentalOrders
            .AnyAsync(r => r.OrderCode == orderCode, cancellationToken);
    }

    public async Task AddAsync(
        RentalOrder rentalOrder,
        CancellationToken cancellationToken = default)
    {
        await _context.RentalOrders.AddAsync(rentalOrder, cancellationToken);
    }

    public void Update(RentalOrder rentalOrder)
    {
        _context.RentalOrders.Update(rentalOrder);
    }
}
