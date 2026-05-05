using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using DisasterAPI.Data;

namespace DisasterAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HospitalsController : ControllerBase
    {
        private readonly DatabaseHelper _db;
        public HospitalsController(DatabaseHelper db) { _db = db; }

        [HttpGet]
        public IActionResult GetHospitals()
        {
            var list = new List<object>();
            using var conn = _db.GetConnection(); conn.Open();
            using var cmd = new SqlCommand("SELECT * FROM vw_hospital_capacity", conn);
            using var r = cmd.ExecuteReader();
            while (r.Read())
                list.Add(new
                {
                    id = r["hospital_id"],
                    name = r["hospital_name"],
                    location = r["location"],
                    totalBeds = r["total_beds"],
                    availableBeds = r["available_beds"],
                    criticalCases = r["critical_cases"] == DBNull.Value ? 0 : r["critical_cases"],
                    admittedPatients = r["admitted_patients"] == DBNull.Value ? 0 : r["admitted_patients"],
                    contactNumber = r["contact_number"] == DBNull.Value ? "" : r["contact_number"]
                });
            return Ok(list);
        }
    }
}