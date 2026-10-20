using Microsoft.EntityFrameworkCore;
using RentalSystem.Domain.Entities;
using RentalSystem.Domain.Interfaces.Repositories;
using RentalSystem.Infrastructure.Persistence;

namespace RentalSystem.Infrastructure.Repositories;

public sealed class CustomerRepository : ICustomerRepository
{
    private readonly AppDbContext _context;

    public CustomerRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Customer?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        return await _context.Customers
            .FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
    }

    public async Task<IReadOnlyList<Customer>> GetAllAsync(
        CancellationToken cancellationToken = default)
    {
        return await _context.Customers
            .AsNoTracking()
            .OrderBy(c => c.FullName)
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<Customer>> SearchAsync(
        string keyword,
        CancellationToken cancellationToken = default)
    {
        var lower = keyword.ToLower();

        return await _context.Customers
            .AsNoTracking()
            .Where(c =>
                c.FullName.ToLower().Contains(lower) ||
                c.Phone.Contains(keyword) ||
                (c.Email != null && c.Email.ToLower().Contains(lower)))
            .OrderBy(c => c.FullName)
            .ToListAsync(cancellationToken);
    }

    public async Task<bool> ExistsByPhoneAsync(
        string phone,
        Guid? excludeId = null,
        CancellationToken cancellationToken = default)
    {
        return await _context.Customers
            .AnyAsync(
                c => c.Phone == phone && (excludeId == null || c.Id != excludeId),
                cancellationToken);
    }

    public async Task AddAsync(
        Customer customer,
        CancellationToken cancellationToken = default)
    {
        await _context.Customers.AddAsync(customer, cancellationToken);
    }

    public void Update(Customer customer)
    {
        _context.Customers.Update(customer);
    }

    public void Delete(Customer customer)
    {
        _context.Customers.Remove(customer);
    }
}
