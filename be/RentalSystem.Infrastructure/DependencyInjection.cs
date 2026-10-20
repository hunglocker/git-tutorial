using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using RentalSystem.Domain.Interfaces;
using RentalSystem.Domain.Interfaces.Repositories;
using RentalSystem.Infrastructure.Persistence;
using RentalSystem.Infrastructure.Repositories;

namespace RentalSystem.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddDbContext<AppDbContext>(options =>
            options.UseSqlServer(
                configuration.GetConnectionString("DefaultConnection"),
                sqlOptions => sqlOptions.MigrationsAssembly(
                    typeof(AppDbContext).Assembly.FullName)));

        services.AddScoped<IUnitOfWork, EfUnitOfWork>();

        services.AddScoped<ICategoryRepository, CategoryRepository>();
        services.AddScoped<IProductRepository, ProductRepository>();
        services.AddScoped<ICustomerRepository, CustomerRepository>();
        services.AddScoped<IRentalOrderRepository, RentalOrderRepository>();

        return services;
    }
}
