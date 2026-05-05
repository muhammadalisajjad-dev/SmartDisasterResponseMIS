using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using DisasterAPI.Data;

namespace DisasterAPI.Controllers
{
    [Route("/api/teams")]
    [ApiController]
    public class TeamsController : ControllerBase
    {
        private readonly DatabaseHelper _db;
        public TeamsController(DatabaseHelper db) { _db = db; }

        [HttpGet]
        public IActionResult GetTeams()
        {
            var list = new List<object>();
            using var conn = _db.GetConnection(); conn.Open();
            using var cmd = new SqlCommand("SELECT * FROM rescue_teams", conn);
            using var r = cmd.ExecuteReader();
            while (r.Read())
                list.Add(new
                {
                    id = r["team_id"],
                    name = r["team_name"],
                    type = r["team_type"],
                    location = r["current_location"],
                    status = r["status"],
                    memberCount = r["member_count"] == DBNull.Value ? 0 : r["member_count"],
                    leader = r["leader"] == DBNull.Value ? "" : r["leader"],
                    lastUpdated = r["last_updated"] == DBNull.Value ? "" : r["last_updated"]?.ToString()
                });
            return Ok(list);
        }

        [HttpPost("{teamId}/assign")]
        public IActionResult AssignTeam(int teamId, [FromBody] AssignRequest request)
        {
            using var conn = _db.GetConnection(); conn.Open();
            using var cmd = new SqlCommand(
                "INSERT INTO team_assignments (team_id, report_id, assigned_by) VALUES (@teamId, @reportId, 1); " +
                "UPDATE rescue_teams SET status = 'assigned' WHERE team_id = @teamId; " +
                "SELECT * FROM rescue_teams WHERE team_id = @teamId", conn);
            cmd.Parameters.AddWithValue("@teamId", teamId);
            cmd.Parameters.AddWithValue("@reportId", request.reportId);
            using var r = cmd.ExecuteReader();
            if (r.Read())
                return Ok(new
                {
                    id = r["team_id"],
                    name = r["team_name"],
                    type = r["team_type"],
                    location = r["current_location"],
                    status = r["status"],
                    memberCount = r["member_count"] == DBNull.Value ? 0 : r["member_count"],
                    leader = r["leader"] == DBNull.Value ? "" : r["leader"],
                    assignedReportId = request.reportId,
                    lastUpdated = r["last_updated"] == DBNull.Value ? "" : r["last_updated"]?.ToString()
                });
            return NotFound();
        }
    }

    public class AssignRequest { public int reportId { get; set; } }
}