using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using DisasterAPI.Data;

namespace DisasterAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuditController : ControllerBase
    {
        private readonly DatabaseHelper _db;
        public AuditController(DatabaseHelper db) { _db = db; }

        [HttpGet]
        public IActionResult GetAudit()
        {
            var list = new List<object>();
            using var conn = _db.GetConnection(); conn.Open();
            using var cmd = new SqlCommand("SELECT * FROM audit_log ORDER BY logged_at DESC", conn);
            using var r = cmd.ExecuteReader();
            while (r.Read())
                list.Add(new
                {
                    id = r["log_id"],
                    userId = r["user_id"] == DBNull.Value ? 0 : r["user_id"],
                    userName = r["user_id"] == DBNull.Value ? "System" : r["user_id"]?.ToString(),
                    role = "admin",
                    action = r["action"] == DBNull.Value ? "UNKNOWN" : r["action"],
                    tableName = r["table_name"] == DBNull.Value ? "" : r["table_name"],
                    recordId = r["record_id"] == DBNull.Value ? 0 : r["record_id"],
                    timestamp = r["logged_at"] == DBNull.Value ? "" : r["logged_at"]?.ToString(),
                    details = r["details"] == DBNull.Value ? "" : r["details"]
                });
            return Ok(list);
        }
    }
}