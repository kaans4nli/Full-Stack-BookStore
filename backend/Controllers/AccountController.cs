using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Npgsql;
using ProjectBookStore.Model;
using ProjectBookStore.Model.Response;
using ProjectBookStore.Utils;
using System.Data;

namespace ProjectBookStore.Controllers
{
    [Route("account")]
    [ApiController]
    public class AccountController : ControllerBase
    {

        private readonly IConfiguration _configuration;
        private AppLogger _logger;
        public AccountController(IConfiguration configuration)
        {
            _configuration = configuration;
            _logger = new AppLogger(configuration);
        }

        [HttpPost]
        [Route("login")]
        public ResponseLogin CheckLogin(LoginUser loginUser)
        {
            NpgsqlConnection connection = new NpgsqlConnection(_configuration.GetConnectionString("PostgreString").ToString());
            ResponseLogin response = new ResponseLogin();

            NpgsqlDataAdapter da = new NpgsqlDataAdapter($"Select firstname,lastname,email,password,telephone From users Where email='{loginUser.Email}'", connection);
            DataTable dt = new DataTable();
            da.Fill(dt);


            if (dt.Rows.Count > 0)
            {
                if (loginUser.Password == Convert.ToString(dt.Rows[0]["password"]))
                {
                    response.StatusCode = 200;
                    response.StatusMessage = "User Found";
                    response.FirstName = Convert.ToString(dt.Rows[0]["firstname"]);
                    response.LastName = Convert.ToString(dt.Rows[0]["lastname"]);
                    response.Email = Convert.ToString(dt.Rows[0]["email"]);
                    response.Telephone = Convert.ToString(dt.Rows[0]["telephone"]);
                    _logger.AddLog($"User logged in to system: useremail={response.Email}", DateTime.Now.ToString());

                }
                else
                {
                    response.StatusCode = 100;
                    response.StatusMessage = "Incorrect password!";
                }
            }
            else
            {
                response.StatusCode = 100;
                response.StatusMessage = "No such user found";
            }

            return response;
        }

        [HttpPost]
        [Route("register")]

        public ResponseRegister AddUser(User user)
        {
            NpgsqlConnection connection = new NpgsqlConnection(_configuration.GetConnectionString("PostgreString").ToString());
            ResponseRegister response = new ResponseRegister();

            NpgsqlDataAdapter da = new NpgsqlDataAdapter($"Select email From users Where email='{user.Email}'", connection);
            DataTable dt = new DataTable();
            da.Fill(dt);


            if (dt.Rows.Count > 0)
            {
                response.StatusCode = 100;
                response.StatusMessage = "You already have an account ";
            }
            else
            {
                NpgsqlCommand command = new NpgsqlCommand($"Insert into users(firstname,lastname,email,password,telephone) values('{user.FirstName}','{user.LastName}','{user.Email}','{user.Password}','{user.Telephone}')", connection);
                connection.Open();
                int i = command.ExecuteNonQuery();
                connection.Close();

                if (i > 0)
                {
                    response.StatusCode = 200;
                    response.StatusMessage = "Account created successfully";
                    _logger.AddLog($"User registered to system: useremail={user.Email}" , DateTime.Now.ToString());
                }
                else
                {
                    response.StatusCode = 100;
                    response.StatusMessage = "Account can not be created";
                }

            }

            return response;
        }

        [HttpPost]
        [Route("adminlogin")]
        public ResponseLogin AdminLogin(LoginUser loginUser)
        {
            NpgsqlConnection connection = new NpgsqlConnection(_configuration.GetConnectionString("PostgreString").ToString());
            ResponseLogin response = new ResponseLogin();

            NpgsqlDataAdapter da = new NpgsqlDataAdapter($"Select firstname,lastname,email,password,telephone From admin Where email='{loginUser.Email}'", connection);
            DataTable dt = new DataTable();
            da.Fill(dt);


            if (dt.Rows.Count > 0)
            {
                if (loginUser.Password == Convert.ToString(dt.Rows[0]["password"]))
                {
                    response.StatusCode = 200;
                    response.StatusMessage = "Admin Found";
                    response.FirstName = Convert.ToString(dt.Rows[0]["firstname"]);
                    response.LastName = Convert.ToString(dt.Rows[0]["lastname"]);
                    response.Email = Convert.ToString(dt.Rows[0]["email"]);
                    response.Telephone = Convert.ToString(dt.Rows[0]["telephone"]);
                }
                else
                {
                    response.StatusCode = 100;
                    response.StatusMessage = "Incorrect password!";
                }
            }
            else
            {
                response.StatusCode = 100;
                response.StatusMessage = "No such admin found";
            }

            return response;
        }

















    }
}
