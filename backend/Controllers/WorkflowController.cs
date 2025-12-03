using Microsoft.AspNetCore.Mvc;
using SupplierInformationManagement.Api.Models;
using SupplierInformationManagement.Api.Services;

namespace SupplierInformationManagement.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DocumentController : ControllerBase
    {
        private readonly DocumentService _documentService;

        public DocumentController(DocumentService documentService)
        {
            _documentService = documentService;
        }

        [HttpGet("supplier/{supplierId}")]
        public async Task<ActionResult<List<Document>>> GetBySupplier(int supplierId)
        {
            var docs = await _documentService.GetDocumentsBySupplierAsync(supplierId);
            return docs;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Document>> GetById(int id)
        {
            var doc = await _documentService.GetDocumentAsync(id);
            if (doc == null)
                return NotFound();
            return doc;
        }

        [HttpPost]
        public async Task<ActionResult<Document>> Add([FromBody] Document doc)
        {
            var newDoc = await _documentService.AddDocumentAsync(doc);
            return CreatedAtAction(nameof(GetById), new { id = newDoc.Id }, newDoc);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var ok = await _documentService.DeleteDocumentAsync(id);
            if (!ok)
                return NotFound();
            return NoContent();
        }
    }
}
