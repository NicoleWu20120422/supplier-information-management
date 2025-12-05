using Microsoft.AspNetCore.Mvc;
using SupplierInformationManagement.Api.Models;
using SupplierInformationManagement.Api.Services;

namespace SupplierInformationManagement.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SupplierController : ControllerBase
    {
        private readonly SupplierService _supplierService;
        private readonly ILogger<SupplierController> _logger;

        public SupplierController(SupplierService supplierService, ILogger<SupplierController> logger)
        {
            _supplierService = supplierService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<List<Supplier>>> GetAll()
        {
            try
            {
                return await _supplierService.GetAllSuppliersAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving suppliers");
                return StatusCode(500, new { 
                    error = "Failed to retrieve suppliers", 
                    message = ex.Message,
                    hint = "Ensure database is running and migrations have been executed. See backend/Migrations/README.md"
                });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Supplier>> Get(int id)
        {
            try
            {
                var supplier = await _supplierService.GetSupplierByIdAsync(id);
                if (supplier == null)
                    return NotFound();
                return supplier;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving supplier {SupplierId}", id);
                return StatusCode(500, new { 
                    error = "Failed to retrieve supplier", 
                    message = ex.Message 
                });
            }
        }

        [HttpPost]
        public async Task<ActionResult<Supplier>> Create([FromBody] Supplier supplier)
        {
            try
            {
                var newSupplier = await _supplierService.CreateSupplierAsync(supplier);
                return CreatedAtAction(nameof(Get), new { id = newSupplier.Id }, newSupplier);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating supplier");
                return StatusCode(500, new { 
                    error = "Failed to create supplier", 
                    message = ex.Message 
                });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Supplier>> Update(int id, [FromBody] Supplier supplier)
        {
            try
            {
                var updated = await _supplierService.UpdateSupplierAsync(id, supplier);
                if (updated == null)
                    return NotFound();
                return updated;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating supplier {SupplierId}", id);
                return StatusCode(500, new { 
                    error = "Failed to update supplier", 
                    message = ex.Message 
                });
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                var ok = await _supplierService.DeleteSupplierAsync(id);
                if (!ok)
                    return NotFound();
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting supplier {SupplierId}", id);
                return StatusCode(500, new { 
                    error = "Failed to delete supplier", 
                    message = ex.Message 
                });
            }
        }
    }
}
