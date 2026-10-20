using RentalSystem.Application.DTOs.Customers;
using RentalSystem.Application.Exceptions;
using RentalSystem.Application.Interfaces.Services;
using RentalSystem.Domain.Entities;
using RentalSystem.Domain.Interfaces;
using RentalSystem.Domain.Interfaces.Repositories;

namespace RentalSystem.Application.Services;

public sealed class CustomerService : ICustomerService
{
    private readonly ICustomerRepository _customerRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CustomerService(
        ICustomerRepository customerRepository,
        IUnitOfWork unitOfWork)
    {
        _customerRepository = customerRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<IReadOnlyList<CustomerResponse>> GetAllAsync(
        CancellationToken cancellationToken = default)
    {
        var customers = await _customerRepository.GetAllAsync(cancellationToken);
        return customers.Select(MapToResponse).ToList();
    }

    public async Task<IReadOnlyList<CustomerResponse>> SearchAsync(
        string keyword,
        CancellationToken cancellationToken = default)
    {
        var customers = await _customerRepository.SearchAsync(keyword, cancellationToken);
        return customers.Select(MapToResponse).ToList();
    }

    public async Task<CustomerResponse?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var customer = await _customerRepository.GetByIdAsync(id, cancellationToken);
        return customer is null ? null : MapToResponse(customer);
    }

    public async Task<CustomerResponse> CreateAsync(
        CreateCustomerRequest request,
        CancellationToken cancellationToken = default)
    {
        var phoneExists = await _customerRepository.ExistsByPhoneAsync(
            request.Phone,
            cancellationToken: cancellationToken);

        if (phoneExists)
            throw new ConflictException(
                $"Customer with phone '{request.Phone}' already exists.");

        var customer = new Customer(
            request.FullName,
            request.Phone,
            request.Email,
            request.Address,
            request.IdentityNumber);

        await _customerRepository.AddAsync(customer, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return MapToResponse(customer);
    }

    public async Task<CustomerResponse> UpdateAsync(
        Guid id,
        UpdateCustomerRequest request,
        CancellationToken cancellationToken = default)
    {
        var customer = await _customerRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException(nameof(Customer), id);

        var phoneExists = await _customerRepository.ExistsByPhoneAsync(
            request.Phone,
            excludeId: id,
            cancellationToken: cancellationToken);

        if (phoneExists)
            throw new ConflictException(
                $"Customer with phone '{request.Phone}' already exists.");

        customer.Update(
            request.FullName,
            request.Phone,
            request.Email,
            request.Address,
            request.IdentityNumber);

        _customerRepository.Update(customer);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return MapToResponse(customer);
    }

    public async Task DeleteAsync(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var customer = await _customerRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException(nameof(Customer), id);

        _customerRepository.Delete(customer);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    private static CustomerResponse MapToResponse(Customer customer) =>
        new(
            customer.Id,
            customer.FullName,
            customer.Phone,
            customer.Email,
            customer.Address,
            customer.IdentityNumber,
            customer.IsActive,
            customer.CreatedAt,
            customer.UpdatedAt);
}
