using Microsoft.AspNetCore.Mvc;
using SupplierInformationManagement.Api.Services;

namespace SupplierInformationManagement.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WorkflowController : ControllerBase
    {
        private readonly WorkflowService _workflowService;

        public WorkflowController(WorkflowService workflowService)
        {
            _workflowService = workflowService;
        }

        [HttpGet("status/{supplierId}")]
        public ActionResult<string> GetStatus(int supplierId)
        {
            var status = _workflowService.GetOnboardingStatus(supplierId);
            return status;
        }

        [HttpPost("advance/{supplierId}")]
        public ActionResult<string> Advance(int supplierId)
        {
            var result = _workflowService.AdvanceWorkflow(supplierId);
            return result;
        }
    }
}
