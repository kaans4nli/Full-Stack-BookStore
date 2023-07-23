
using System.ComponentModel;
using System.Diagnostics.Tracing;
using System.Data;
using Microsoft.AspNetCore.Mvc;
using Npgsql;
using ProjectBookStore.Model.Response;
using ProjectBookStore.Model;

namespace ProjectBookStore.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LogController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        public LogController(IConfiguration configuration)
        {
            _configuration = configuration;
        }


        [HttpGet]
        [Route("LogList")]    // View 

        public ResponseLog GetLogs()
        {

            NpgsqlConnection connection = new NpgsqlConnection(_configuration.GetConnectionString("PostgreString").ToString());
            NpgsqlDataAdapter da = new NpgsqlDataAdapter("Select * from logger", connection);
            DataTable dt = new DataTable();
            da.Fill(dt);

            ResponseLog response = new ResponseLog();
            List<Log> list = new List<Log>();
            if (dt.Rows.Count > 0)
            {

                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    Log log = new Log();
                    log.Id = Convert.ToInt32(dt.Rows[i]["id"]);
                    log.text = Convert.ToString(dt.Rows[i]["log"]);
                    log.date = Convert.ToString(dt.Rows[i]["date"]);
                    list.Add(log);
                }

                if (list.Count > 0)
                {
                    response.StatusCode = 200;
                    response.StatusMessage = "Logs Found";
                    response.list = list;
                }


            }
            else
            {
                response.StatusCode = 100;
                response.StatusMessage = "No LogData Found";
                response.list = null;
            }

            return response;

        }

    }
}