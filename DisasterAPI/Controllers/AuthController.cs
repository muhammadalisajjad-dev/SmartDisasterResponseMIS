using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using DisasterAPI.Data;

namespace DisasterAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly DatabaseHelper _db;

        public AuthController(DatabaseHelper db)
        {
            _db = db;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            using var conn = _db.GetConnection();
            conn.Open();

            using var cmd = new SqlCommand(
            "SELECT user_id, full_name, email, role FROM users WHERE email = @email AND password_hash = HASHBYTES('SHA2_256', @password)", conn);
            cmd.Parameters.AddWithValue("@email", request.email);
            cmd.Parameters.AddWithValue("@password", request.password);

            using var reader = cmd.ExecuteReader();
            if (reader.Read())
            {
                return Ok(new
                {
                    user = new
                    {
                        id = reader["user_id"],
                        name = reader["full_name"],
                        email = reader["email"],
                        role = reader["role"]
                    },
                    token = "mock-jwt-token"
                });
            }

            return Unauthorized(new { message = "Invalid credentials" });
        }
    }

    public class LoginRequest
    {
        public string email { get; set; }
        public string password { get; set; }
    }
}