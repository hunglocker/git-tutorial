# CODING CONVENTIONS — ASP.NET CORE WEB API

**Architecture:** Repository Pattern + Service Layer  
**Language:** C#  
**Framework:** ASP.NET Core / Entity Framework Core  
**Version:** 1.0

## 1. Mục đích

Tài liệu quy định các tiêu chuẩn viết code thống nhất trong dự án ASP.NET Core Web API.

Mục tiêu:

- Code dễ đọc, dễ hiểu và dễ bảo trì.
- Phân chia trách nhiệm rõ ràng giữa các layer.
- Tuân thủ SOLID, DRY, KISS và Dependency Injection.
- Hạn chế duplicate code và tight coupling.
- Dễ dàng viết Unit Test và Integration Test.
- Thống nhất quy trình phát triển và review code.

## 2. Project Structure

Dự án sử dụng Repository Pattern kết hợp Service Layer và Dependency Injection.

```text
MyProject/
│
├── MyProject.Api/
│   ├── Controllers/
│   │   └── ProductsController.cs
│   ├── Middlewares/
│   │   └── ExceptionMiddleware.cs
│   ├── Extensions/
│   │   └── ServiceCollectionExtensions.cs
│   ├── Program.cs
│   └── appsettings.json
│
├── MyProject.Application/
│   ├── DTOs/
│   │   └── Products/
│   │       ├── CreateProductRequest.cs
│   │       ├── UpdateProductRequest.cs
│   │       └── ProductResponse.cs
│   ├── Interfaces/
│   │   └── Services/
│   │       └── IProductService.cs
│   ├── Services/
│   │   └── ProductService.cs
│   ├── Validators/
│   └── Exceptions/
│
├── MyProject.Domain/
│   ├── Entities/
│   │   └── Product.cs
│   ├── Interfaces/
│   │   └── Repositories/
│   │       └── IProductRepository.cs
│   ├── Enums/
│   └── Constants/
│
├── MyProject.Infrastructure/
│   ├── Persistence/
│   │   ├── AppDbContext.cs
│   │   ├── Configurations/
│   │   └── Migrations/
│   ├── Repositories/
│   │   └── ProductRepository.cs
│   └── DependencyInjection.cs
│
├── MyProject.Tests/
│   ├── UnitTests/
│   └── IntegrationTests/
│
├── .editorconfig
├── .gitignore
└── MyProject.sln
```

### 2.1. Trách nhiệm từng layer

| Layer | Trách nhiệm |
|---|---|
| API | Tiếp nhận HTTP request, trả response, authentication |
| Application | Business use cases, validation, DTO mapping |
| Domain | Entity, business rules, repository contracts |
| Infrastructure | Database, EF Core, repository implementations |
| Tests | Unit Test, Integration Test |

### 2.2. Dependency Rule

Các dependency phải đi từ layer bên ngoài vào layer bên trong.

```text
API
 ├── Application
 └── Infrastructure (DI registration)

Infrastructure
 ├── Application (nếu cần)
 └── Domain

Application
 └── Domain

Domain
 └── Không phụ thuộc layer khác
```

**Quy định bắt buộc:**

- Controller không được truy cập trực tiếp `DbContext`.
- Controller gọi Application Service, không gọi Repository trực tiếp.
- Service không chứa câu lệnh SQL hoặc phụ thuộc trực tiếp EF Core.
- Repository chịu trách nhiệm truy cập và truy vấn dữ liệu.
- Domain không tham chiếu Infrastructure.
- DTO không được sử dụng thay thế Entity trong tầng Persistence.
- Không trả Entity trực tiếp từ API.

## 3. Naming Convention

### 3.1. Quy tắc đặt tên

| Thành phần | Convention | Ví dụ |
|---|---|---|
| Class | PascalCase | `ProductService` |
| Interface | I + PascalCase | `IProductRepository` |
| Method | PascalCase | `GetProductByIdAsync()` |
| Property | PascalCase | `ProductName` |
| Local Variable | camelCase | `productName` |
| Parameter | camelCase | `productId` |
| Private Field | _camelCase | `_productRepository` |
| Constant | PascalCase | `MaxRetryCount` |
| Enum | PascalCase | `OrderStatus` |
| Namespace | PascalCase | `MyProject.Application.Services` |
| Async Method | Hậu tố Async | `CreateProductAsync()` |

### 3.2. Quy định đặt tên

- Tên phải thể hiện rõ mục đích.
- Không viết tắt gây khó hiểu.
- Không dùng tên chung chung như `Data`, `Manager`, `Helper` khi có thể đặt tên cụ thể.
- Không dùng tên biến `a`, `b`, `x`, `temp` nếu không có ngữ cảnh rõ ràng.
- Interface phải bắt đầu bằng chữ `I`.
- Các phương thức bất đồng bộ phải kết thúc bằng `Async`.

**Không nên:**

```csharp
public class ProductSvc
{
    public Task<Product> Get(int x);
}
```

**Nên:**

```csharp
public interface IProductService
{
    Task<ProductResponse?> GetByIdAsync(
        Guid productId,
        CancellationToken cancellationToken = default);
}
```

## 4. Entity Convention

Entity đại diện cho dữ liệu nghiệp vụ.

```csharp
public class Product
{
    public Guid Id { get; private set; }

    public string Name { get; private set; } = string.Empty;

    public decimal Price { get; private set; }

    private Product() { }

    public Product(string name, decimal price)
    {
        Id = Guid.NewGuid();
        Update(name, price);
    }

    public void Update(string name, decimal price)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException(
                "Product name is required.");

        if (price < 0)
            throw new ArgumentOutOfRangeException(
                nameof(price));

        Name = name;
        Price = price;
    }
}
```

**Quy định:**

- Entity sử dụng PascalCase cho property.
- Không chứa logic HTTP hoặc truy cập database.
- Các quy tắc nghiệp vụ cốt lõi nên được bảo vệ trong Domain.
- Hạn chế public setter nếu có thể làm mất tính hợp lệ của Entity.
- Không đặt Data Annotation phục vụ API request trực tiếp vào Entity.

## 5. Repository Pattern Convention

Repository là lớp chịu trách nhiệm truy cập dữ liệu.

### 5.1. Repository Interface

Đặt tại:

`MyProject.Domain/Interfaces/Repositories/IProductRepository.cs`

```csharp
public interface IProductRepository
{
    Task<Product?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<Product>> GetAllAsync(
        CancellationToken cancellationToken = default);

    Task AddAsync(
        Product product,
        CancellationToken cancellationToken = default);
}
```

### 5.2. Repository Implementation

Đặt tại:

`MyProject.Infrastructure/Repositories/ProductRepository.cs`

```csharp
public sealed class ProductRepository
    : IProductRepository
{
    private readonly AppDbContext _context;

    public ProductRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Product?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        return await _context.Products
            .FirstOrDefaultAsync(
                x => x.Id == id,
                cancellationToken);
    }

    public async Task<IReadOnlyList<Product>> GetAllAsync(
        CancellationToken cancellationToken = default)
    {
        return await _context.Products
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }

    public async Task AddAsync(
        Product product,
        CancellationToken cancellationToken = default)
    {
        await _context.Products.AddAsync(
            product,
            cancellationToken);
    }
}
```

**Quy định bắt buộc:**

- Repository chỉ xử lý persistence và truy vấn dữ liệu.
- Không chứa business workflow.
- Không trả `IQueryable` ra Application Layer nếu kiến trúc không quy định rõ.
- Sử dụng `AsNoTracking()` cho truy vấn chỉ đọc khi phù hợp.
- Ưu tiên async/await cho database I/O.
- Truyền `CancellationToken` xuyên suốt.
- Không tự ý gọi `SaveChangesAsync()` trong mọi repository method nếu dự án quản lý transaction theo Unit of Work.

## 6. Service Layer Convention

Service chịu trách nhiệm xử lý use case và điều phối nghiệp vụ.

### 6.1. Service Interface

```csharp
public interface IProductService
{
    Task<ProductResponse?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default);

    Task<ProductResponse> CreateAsync(
        CreateProductRequest request,
        CancellationToken cancellationToken = default);
}
```

### 6.2. Service Implementation

```csharp
public sealed class ProductService : IProductService
{
    private readonly IProductRepository _repository;
    private readonly IUnitOfWork _unitOfWork;

    public ProductService(
        IProductRepository repository,
        IUnitOfWork unitOfWork)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
    }

    public async Task<ProductResponse> CreateAsync(
        CreateProductRequest request,
        CancellationToken cancellationToken = default)
    {
        var product = new Product(
            request.Name,
            request.Price);

        await _repository.AddAsync(
            product,
            cancellationToken);

        await _unitOfWork.SaveChangesAsync(
            cancellationToken);

        return new ProductResponse(
            product.Id,
            product.Name,
            product.Price);
    }

    public async Task<ProductResponse?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var product = await _repository.GetByIdAsync(
            id,
            cancellationToken);

        return product is null
            ? null
            : new ProductResponse(
                product.Id,
                product.Name,
                product.Price);
    }
}
```

`IUnitOfWork` là abstraction cho việc commit thay đổi dữ liệu. Infrastructure sẽ triển khai interface này thông qua `AppDbContext.SaveChangesAsync()`.

**Quy định:**

- Service phụ thuộc Repository Interface, không phụ thuộc Repository Implementation.
- Không trả `IActionResult`, `HttpResponseMessage` từ Application Service.
- Không xử lý HTTP status code trong Service.
- Không gọi trực tiếp `DbContext` nếu dự án đã quy định Repository abstraction.
- Một Service nên tập trung vào một nhóm use case liên quan.
- Không tạo Service chỉ để chuyển tiếp một lời gọi nếu không mang lại giá trị kiến trúc rõ ràng.

## 7. Controller Convention

Controller chỉ chịu trách nhiệm xử lý HTTP.

```csharp
[ApiController]
[Route("api/v1/products")]
public sealed class ProductsController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductsController(
        IProductService productService)
    {
        _productService = productService;
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ProductResponse>> GetById(
        Guid id,
        CancellationToken cancellationToken)
    {
        var product = await _productService.GetByIdAsync(
            id,
            cancellationToken);

        if (product is null)
            return NotFound();

        return Ok(product);
    }

    [HttpPost]
    public async Task<ActionResult<ProductResponse>> Create(
        [FromBody] CreateProductRequest request,
        CancellationToken cancellationToken)
    {
        var product = await _productService.CreateAsync(
            request,
            cancellationToken);

        return CreatedAtAction(
            nameof(GetById),
            new { id = product.Id },
            product);
    }
}
```

**Quy định:**

- Controller phải mỏng (Thin Controller).
- Không chứa business logic.
- Không gọi trực tiếp database.
- Sử dụng HTTP method đúng ngữ nghĩa.
- Sử dụng `ActionResult<T>` khi cần trả nhiều HTTP status.
- Tránh `try/catch` lặp lại trong mỗi action; sử dụng global exception handling.

## 8. DTO Convention

DTO dùng để trao đổi dữ liệu giữa API và Application.

```csharp
public sealed record CreateProductRequest(
    string Name,
    decimal Price);

public sealed record UpdateProductRequest(
    string Name,
    decimal Price);

public sealed record ProductResponse(
    Guid Id,
    string Name,
    decimal Price);
```

**Quy định:**

- Request DTO và Response DTO phải tách biệt.
- Không trả Entity trực tiếp cho client.
- Không chứa thông tin nhạy cảm không cần thiết.
- Validate request tại API/Application boundary.
- Không sử dụng một DTO duy nhất cho mọi nghiệp vụ CRUD.

## 9. Dependency Injection Convention

Đăng ký dependency tập trung tại Infrastructure.

```csharp
public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services)
    {
        services.AddScoped<
            IProductRepository,
            ProductRepository>();

        services.AddScoped<
            IUnitOfWork,
            EfUnitOfWork>();

        return services;
    }
}
```

Trong `Program.cs`:

```csharp
builder.Services.AddInfrastructure();

builder.Services.AddScoped<
    IProductService,
    ProductService>();
```

**Quy định:**

- Sử dụng Constructor Injection.
- Không tự tạo dependency bằng `new` trong Controller hoặc Service.
- Repository dùng EF Core thường được đăng ký `Scoped`.
- Không inject một Scoped service vào Singleton.
- Không sử dụng Service Locator thay cho Constructor Injection.

## 10. Error Handling Convention

Sử dụng global exception handling thông qua `IExceptionHandler` hoặc middleware.

Quy định:

- Validation error: HTTP 400 hoặc 422 theo API contract.
- Resource not found: HTTP 404.
- Authentication failure: HTTP 401.
- Authorization failure: HTTP 403.
- Conflict: HTTP 409.
- Unexpected server error: HTTP 500.

Ưu tiên response theo chuẩn `ProblemDetails` (RFC 9457).

Không được:

- Trả stack trace cho client.
- Nuốt exception bằng `catch { }`.
- Sử dụng `throw ex;` làm mất stack trace gốc.
- Log mật khẩu, access token hoặc dữ liệu bí mật.

## 11. Async/Await Convention

- Database I/O và network I/O sử dụng async.
- Async method phải có hậu tố `Async`, ngoại trừ các method framework định nghĩa tên khác.
- Tránh `.Result` và `.Wait()`.
- Không sử dụng `async void`, ngoại trừ event handler phù hợp.
- Truyền `CancellationToken` từ Controller xuống Service và Repository.
- Không sử dụng `Task.Run()` để bọc truy vấn EF Core.

## 12. Code Formatting Convention

- Sử dụng 4 spaces cho indentation.
- Mỗi file nên chứa một top-level type chính.
- Sử dụng file-scoped namespace khi phù hợp.
- Luôn sử dụng dấu `{ }` cho khối điều kiện nhiều dòng.
- Ưu tiên early return để giảm nested code.
- Bật Nullable Reference Types.
- Sử dụng `var` khi kiểu dữ liệu rõ ràng từ biểu thức.
- Sử dụng `readonly` cho dependency fields.
- Sử dụng `sealed` cho class không được thiết kế để kế thừa, khi phù hợp.

Ví dụ:

```csharp
public async Task<ProductResponse?> GetAsync(
    Guid id,
    CancellationToken cancellationToken)
{
    if (id == Guid.Empty)
    {
        throw new ArgumentException(
            "Invalid product ID.",
            nameof(id));
    }

    var product = await _repository.GetByIdAsync(
        id,
        cancellationToken);

    if (product is null)
    {
        return null;
    }

    return new ProductResponse(
        product.Id,
        product.Name,
        product.Price);
}
```

## 13. Database Convention

- Sử dụng EF Core Migrations để quản lý schema.
- Không chỉnh sửa migration đã áp dụng ở môi trường dùng chung nếu có thể gây sai lệch lịch sử.
- Sử dụng Fluent API để cấu hình entity mapping phức tạp.
- Dùng `decimal` cho giá tiền, không dùng `float` hoặc `double`.
- Cấu hình precision/scale rõ ràng.
- Sử dụng transaction cho nghiệp vụ cần tính nguyên tử.
- Không tạo N+1 queries không cần thiết.
- Sử dụng pagination cho danh sách dữ liệu lớn.
- Không truy vấn toàn bộ bảng rồi mới lọc trong memory khi có thể lọc ở database.

## 14. Logging Convention

Sử dụng `ILogger<T>`.

```csharp
_logger.LogInformation(
    "Creating product with name {ProductName}",
    request.Name);
```

Quy định:

- Sử dụng structured logging.
- Không dùng `Console.WriteLine()` để logging nghiệp vụ.
- `Information`: Sự kiện hoạt động bình thường quan trọng.
- `Warning`: Tình huống bất thường có thể phục hồi.
- `Error`: Lỗi thực thi cần xử lý.
- Không log dữ liệu nhạy cảm.
- Không ghi cùng một exception nhiều lần ở các layer nếu không cần thiết.

## 15. Git Convention

### Branch Naming

```text
feature/product-management
feature/user-authentication
fix/product-validation
refactor/product-repository
test/product-service
```

### Commit Convention

Áp dụng Conventional Commits:

```text
feat: add product creation endpoint
fix: handle product not found
refactor: separate product repository
test: add product service unit tests
docs: update coding conventions
```

Quy định:

- Không commit secrets hoặc file cấu hình chứa mật khẩu.
- Không commit `bin/`, `obj/`.
- Không push trực tiếp vào protected branch.
- Mỗi Pull Request nên tập trung vào một thay đổi logic.
- Chạy build và test trước khi tạo Pull Request.

## 16. Testing Convention

- Unit Test tập trung vào business rules và Service.
- Mock Repository Interface khi test Service.
- Integration Test kiểm tra Repository với database test phù hợp.
- Test Controller/API cho HTTP contract.
- Đặt tên test rõ ràng theo hành vi.

Ví dụ:

```csharp
[Fact]
public async Task GetByIdAsync_WhenProductNotFound_ReturnsNull()
{
    // Arrange
    // Act
    // Assert
}
```

Khuyến nghị sử dụng xUnit, Moq hoặc NSubstitute, FluentAssertions nếu phù hợp với chính sách dependency của dự án.

## 17. Pull Request Checklist

Trước khi tạo Pull Request, developer phải kiểm tra:

- [ ] Code tuân thủ naming convention.
- [ ] Controller không chứa business logic.
- [ ] Service không truy cập trực tiếp DbContext.
- [ ] Repository không chứa business workflow.
- [ ] Đã sử dụng Dependency Injection.
- [ ] Request và Response DTO tách biệt.
- [ ] Có validation và error handling.
- [ ] Không hardcode secrets.
- [ ] Không có logging dữ liệu nhạy cảm.
- [ ] Không có code dư thừa hoặc commented-out code.
- [ ] Build thành công.
- [ ] Các test liên quan chạy thành công.
- [ ] Migration được kiểm tra nếu thay đổi database.

## 18. Architecture Flow

Luồng xử lý chuẩn:

```text
Client
  |
  v
API Controller
  |
  v
Application Service
  |
  v
Repository Interface
  |
  v
Repository Implementation
  |
  v
Entity Framework Core
  |
  v
Database
```

Khi ghi dữ liệu, Application Service điều phối Unit of Work để commit transaction.

**Nguyên tắc quan trọng nhất:**

> Controller xử lý HTTP, Service xử lý use case và nghiệp vụ, Repository xử lý truy cập dữ liệu, Domain bảo vệ các quy tắc nghiệp vụ cốt lõi.

---

**Document Version:** 1.0  
**Status:** Proposed Standard  
**Applies To:** ASP.NET Core Web API projects using Repository Pattern and Service Layer.
