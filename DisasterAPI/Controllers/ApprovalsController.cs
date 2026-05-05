using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using DisasterAPI.Data;

namespace DisasterAPI.Controllers
{
    [Route("/api/approvals")]
    [ApiController]
    public class ApprovalsController : ControllerBase
    {
        private readonly DatabaseHelper _db;
        public ApprovalsController(DatabaseHelper db) { _db = db; }

        [HttpGet]
        public IActionResult GetApprovals()
        {
            var list = new List<object>();
            using var conn = _db.GetConnection(); conn.Open();
            using var cmd = new SqlCommand("SELECT * FROM approval_requests", conn);
            using var r = cmd.ExecuteReader();
            while (r.Read())
                list.Add(new
                {
                    id = r["request_id"],
                    type = r["request_type"],
                    title = r["title"] == DBNull.Value ? "" : r["title"],
                    description = r["description"] == DBNull.Value ? "" : r["description"],
                    status = r["status"],
                    requestedBy = r["requested_by"]?.ToString() ?? "",
                    requestedAt = r["requested_at"] == DBNull.Value ? "" : r["requested_at"]?.ToString(),
                    reviewedBy = r["reviewed_by"] == DBNull.Value ? null : r["reviewed_by"]?.ToString(),
                    reviewedAt = r["reviewed_at"] == DBNull.Value ? null : r["reviewed_at"]?.ToString()
                });
            return Ok(list);
        }

        [HttpPut("{id}")]
        public IActionResult ReviewApproval(int id, [FromBody] ReviewRequest request)
        {
            using var conn = _db.GetConnection(); conn.Open();
            using var cmd = new SqlCommand(
                "UPDATE approval_requests SET status = @status, reviewed_by = 1, reviewed_at = GETDATE() WHERE request_id = @id; " +
                "SELECT * FROM approval_requests WHERE request_id = @id", conn);
            cmd.Parameters.AddWithValue("@status", request.status);
            cmd.Parameters.AddWithValue("@id", id);
            using var r = cmd.ExecuteReader();
            if (r.Read())
                return Ok(new
                {
                    id = r["request_id"],
                    type = r["request_type"],
                    title = r["title"] == DBNull.Value ? "" : r["title"],
                    status = r["status"],
                    reviewedBy = "Admin Khan",
                    reviewedAt = DateTime.Now.ToString("o")
                });
            return NotFound();
        }
    }

    public class ReviewRequest { public string status { get; set; } = "approved"; }
}