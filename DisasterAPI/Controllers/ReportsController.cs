using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using DisasterAPI.Data;

namespace DisasterAPI.Controllers
{
    [Route("/api/reports")]
    [ApiController]
    public class ReportsController : ControllerBase
    {
        private readonly DatabaseHelper _db;
        public ReportsController(DatabaseHelper db) { _db = db; }

        [HttpGet]
        public IActionResult GetReports()
        {
            var reports = new List<object>();
            using var conn = _db.GetConnection();
            conn.Open();
            using var cmd = new SqlCommand(
                "SELECT report_id, location, disaster_type, severity, incident_status, description, reported_at, reported_by, team_name, team_type, team_status FROM vw_admin_dashboard", conn);
            using var reader = cmd.ExecuteReader();
            while (reader.Read())
            {
                reports.Add(new
                {
                    id = reader.GetInt32(0),
                    location = reader.GetString(1),
                    disasterType = reader.GetString(2),
                    severity = reader.GetString(3),
                    status = reader.GetString(4),
                    description = reader.IsDBNull(5) ? null : reader.GetString(5),
                    reportedAt = reader.IsDBNull(6) ? null : reader.GetDateTime(6).ToString("yyyy-MM-ddTHH:mm:ss"),
                    reportedBy = reader.IsDBNull(7) ? "" : reader.GetString(7),
                    teamAssigned = reader.IsDBNull(8) ? null : reader.GetString(8)
                });
            }
            return Ok(reports);
        }

        [HttpPost]
        public IActionResult CreateReport([FromBody] CreateReportRequest request)
        {
            using var conn = _db.GetConnection();
            conn.Open();
            using var cmd = new SqlCommand(
                "INSERT INTO emergencies (location, disaster_type, severity, status, description, reported_by) " +
                "VALUES (@location, @type, @severity, 'open', @description, 1); SELECT SCOPE_IDENTITY();", conn);
            cmd.Parameters.AddWithValue("@location", request.location ?? "");
            cmd.Parameters.AddWithValue("@type", request.disasterType ?? "other");
            cmd.Parameters.AddWithValue("@severity", request.severity ?? "medium");
            cmd.Parameters.AddWithValue("@description", request.description ?? "");

            var newId = Convert.ToInt32(cmd.ExecuteScalar());

            return Ok(new { id = newId, status = "ok" });
        }
    }

    public class CreateReportRequest
    {
        public string location { get; set; } = "";
        public string disasterType { get; set; } = "other";
        public string severity { get; set; } = "medium";
        public string description { get; set; } = "";
        public string reportedBy { get; set; } = "Citizen App";
    }
}