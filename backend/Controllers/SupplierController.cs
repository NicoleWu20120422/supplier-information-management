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

        public SupplierController(SupplierService supplierService)
        {
            _supplierService = supplierService;
        }

        [HttpGet]
        public async Task<ActionResult<List<Supplier>>> GetAll()
        {
            return await _supplierService.GetAllSuppliersAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Supplier>> Get(int id)
        {
            var supplier = await _supplierService.GetSupplierByIdAsync(id);
            if (supplier == null)
                return NotFound();
            return supplier;
        }

        [HttpPost]
        public async Task<ActionResult<Supplier>> Create([FromBody] Supplier supplier)
        {
            var newSupplier = await _supplierService.CreateSupplierAsync(supplier);
            return CreatedAtAction(nameof(Get), new { id = newSupplier.Id }, newSupplier);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Supplier>> Update(int id, [FromBody] Supplier supplier)
        {
            var updated = await _supplierService.UpdateSupplierAsync(id, supplier);
            if (updated == null)
                return NotFound();
            return updated;
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var ok = await _supplierService.DeleteSupplierAsync(id);
            if (!ok)
                return NotFound();
            return NoContent();
        }
    }
}
