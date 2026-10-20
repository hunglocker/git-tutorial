using Microsoft.AspNetCore.Mvc;
using RentalSystem.Application.DTOs.RentalOrders;
using RentalSystem.Application.Interfaces.Services;
using RentalSystem.Domain.Enums;

namespace RentalSystem.Api.Controllers;

[ApiController]
[Route("api/v1/rental-orders")]
public sealed class RentalOrdersController : ControllerBase
{
    private readonly IRentalOrderService _rentalOrderService;

    public RentalOrdersController(IRentalOrderService rentalOrderService)
    {
        _rentalOrderService = rentalOrderService;
    }

    /// <summary>Get all rental orders.</summary>
    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<RentalOrderResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<RentalOrderResponse>>> GetAll(
        CancellationToken cancellationToken)
    {
        var orders = await _rentalOrderService.GetAllAsync(cancellationToken);
        return Ok(orders);
    }

    /// <summary>Get rental orders by status.</summary>
    [HttpGet("by-status/{status}")]
    [ProducesResponseType(typeof(IReadOnlyList<RentalOrderResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<RentalOrderResponse>>> GetByStatus(
        RentalStatus status,
        CancellationToken cancellationToken)
    {
        var orders = await _rentalOrderService.GetByStatusAsync(status, cancellationToken);
        return Ok(orders);
    }

    /// <summary>Get rental orders by customer.</summary>
    [HttpGet("by-customer/{customerId:guid}")]
    [ProducesResponseType(typeof(IReadOnlyList<RentalOrderResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<RentalOrderResponse>>> GetByCustomer(
        Guid customerId,
        CancellationToken cancellationToken)
    {
        var orders = await _rentalOrderService.GetByCustomerAsync(customerId, cancellationToken);
        return Ok(orders);
    }

    /// <summary>Get overdue rental orders.</summary>
    [HttpGet("overdue")]
    [ProducesResponseType(typeof(IReadOnlyList<RentalOrderResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<RentalOrderResponse>>> GetOverdue(
        CancellationToken cancellationToken)
    {
        var orders = await _rentalOrderService.GetOverdueAsync(cancellationToken);
        return Ok(orders);
    }

    /// <summary>Get rental order by id.</summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(RentalOrderResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<RentalOrderResponse>> GetById(
        Guid id,
        CancellationToken cancellationToken)
    {
        var order = await _rentalOrderService.GetByIdAsync(id, cancellationToken);

        if (order is null)
            return NotFound();

        return Ok(order);
    }

    /// <summary>Create a new rental order.</summary>
    [HttpPost]
    [ProducesResponseType(typeof(RentalOrderResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
    public async Task<ActionResult<RentalOrderResponse>> Create(
        [FromBody] CreateRentalOrderRequest request,
        CancellationToken cancellationToken)
    {
        var order = await _rentalOrderService.CreateAsync(request, cancellationToken);

        return CreatedAtAction(
            nameof(GetById),
            new { id = order.Id },
            order);
    }

    /// <summary>Activate a pending rental order (hand over product to customer).</summary>
    [HttpPatch("{id:guid}/activate")]
    [ProducesResponseType(typeof(RentalOrderResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
    public async Task<ActionResult<RentalOrderResponse>> Activate(
        Guid id,
        CancellationToken cancellationToken)
    {
        var order = await _rentalOrderService.ActivateAsync(id, cancellationToken);
        return Ok(order);
    }

    /// <summary>Return a product from an active rental order.</summary>
    [HttpPatch("{id:guid}/return")]
    [ProducesResponseType(typeof(RentalOrderResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
    public async Task<ActionResult<RentalOrderResponse>> Return(
        Guid id,
        [FromBody] ReturnRentalOrderRequest request,
        CancellationToken cancellationToken)
    {
        var order = await _rentalOrderService.ReturnAsync(id, request, cancellationToken);
        return Ok(order);
    }

    /// <summary>Cancel a rental order.</summary>
    [HttpPatch("{id:guid}/cancel")]
    [ProducesResponseType(typeof(RentalOrderResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
    public async Task<ActionResult<RentalOrderResponse>> Cancel(
        Guid id,
        [FromBody] CancelRentalOrderRequest request,
        CancellationToken cancellationToken)
    {
        var order = await _rentalOrderService.CancelAsync(id, request, cancellationToken);
        return Ok(order);
    }

    /// <summary>Mark a rental order as paid.</summary>
    [HttpPatch("{id:guid}/mark-paid")]
    [ProducesResponseType(typeof(RentalOrderResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<RentalOrderResponse>> MarkAsPaid(
        Guid id,
        CancellationToken cancellationToken)
    {
        var order = await _rentalOrderService.MarkAsPaidAsync(id, cancellationToken);
        return Ok(order);
    }
}
