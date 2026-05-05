using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using DisasterAPI.Data;

namespace DisasterAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly DatabaseHelper _db;
        public UsersController(DatabaseHelper db) { _db = db; }

        [HttpGet]
        public IActionResult GetUsers()
        {
            var list = new List<object>();
            using var conn = _db.GetConnection(); conn.Open();
            using var cmd = new SqlCommand("SELECT user_id, full_name, email, role FROM users", conn);
            using var r = cmd.ExecuteReader();
            while (r.Read())
                list.Add(new
                {
                    id = r["user_id"],
                    name = r["full_name"] == DBNull.Value ? "" : r["full_name"],
                    email = r["email"] == DBNull.Value ? "" : r["email"],
                    role = r["role"] == DBNull.Value ? "" : r["role"]
                });
            return Ok(list);
        }
    }
}