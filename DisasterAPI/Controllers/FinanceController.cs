using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using DisasterAPI.Data;

namespace DisasterAPI.Controllers
{
    [Route("/api/finance")]
    [ApiController]
    public class FinanceController : ControllerBase
    {
        private readonly DatabaseHelper _db;
        public FinanceController(DatabaseHelper db) { _db = db; }

        [HttpGet]
        public IActionResult GetFinance()
        {
            var list = new List<object>();
            using var conn = _db.GetConnection(); conn.Open();
            using var cmd = new SqlCommand("SELECT * FROM vw_finance_officer", conn);
            using var r = cmd.ExecuteReader();
            while (r.Read())
                list.Add(new
                {
                    id = r["transaction_id"],
                    type = r["type"],
                    amount = r["amount"],
                    description = r["description"] == DBNull.Value ? "" : r["description"],
                    category = r["category"] == DBNull.Value ? "" : r["category"],
                    party = r["party"] == DBNull.Value ? "" : r["party"],
                    status = r["status"],
                    date = r["created_at"] == DBNull.Value ? "" : r["created_at"]?.ToString(),
                    recordedBy = r["recorded_by"]?.ToString() ?? "",
                    relatedIncident = r["related_incident"] == DBNull.Value ? "" : r["related_incident"]
                });
            return Ok(list);
        }

        [HttpPost]
        public IActionResult CreateTransaction([FromBody] CreateTxnRequest request)
        {
            using var conn = _db.GetConnection(); conn.Open();
            using var cmd = new SqlCommand(
                "INSERT INTO transactions (type, amount, description, category, party, recorded_by, status) " +
                "VALUES (@type, @amount, @description, @category, @party, 5, 'pending'); SELECT SCOPE_IDENTITY();", conn);
            cmd.Parameters.AddWithValue("@type", request.type ?? "donation");
            cmd.Parameters.AddWithValue("@amount", request.amount);
            cmd.Parameters.AddWithValue("@description", request.description ?? "");
            cmd.Parameters.AddWithValue("@category", request.category ?? "");
            cmd.Parameters.AddWithValue("@party", request.party ?? "");
            var newId = Convert.ToInt32(cmd.ExecuteScalar());
            return Ok(new { id = newId, type = request.type, amount = request.amount, description = request.description ?? "", category = request.category ?? "", party = request.party ?? "", status = "pending", date = DateTime.Now.ToString("yyyy-MM-dd") });
        }
    }

    public class CreateTxnRequest
    {
        public string type { get; set; } = "donation";
        public decimal amount { get; set; }
        public string description { get; set; } = "";
        public string category { get; set; } = "";
        public string party { get; set; } = "";
    }
}