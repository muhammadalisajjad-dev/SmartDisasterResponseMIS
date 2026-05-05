using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using DisasterAPI.Data;

namespace DisasterAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ResourcesController : ControllerBase
    {
        private readonly DatabaseHelper _db;
        public ResourcesController(DatabaseHelper db) { _db = db; }

        [HttpGet]
        public IActionResult GetResources()
        {
            var list = new List<object>();
            using var conn = _db.GetConnection(); conn.Open();
            using var cmd = new SqlCommand("SELECT * FROM vw_warehouse_manager", conn);
            using var r = cmd.ExecuteReader();
            while (r.Read())
                list.Add(new
                {
                    id = r["resource_id"],
                    name = r["resource_name"],
                    type = r["resource_type"],
                    quantity = r["quantity"],
                    unit = r["unit"] == DBNull.Value ? "units" : r["unit"],
                    threshold = r["threshold"],
                    warehouseName = r["warehouse_name"],
                    lastUpdated = r["last_updated"] == DBNull.Value ? DateTime.Now.ToString("yyyy-MM-ddTHH:mm:ss") : Convert.ToDateTime(r["last_updated"]).ToString("yyyy-MM-ddTHH:mm:ss")
                });
            return Ok(list);
        }
    }
}