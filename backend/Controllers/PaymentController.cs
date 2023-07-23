using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Npgsql;
using ProjectBookStore.Model.Response;
using ProjectBookStore.Model;
using System.Data;
using System.Net;
using ProjectBookStore.Utils;

namespace ProjectBookStore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {

        private readonly IConfiguration _configuration;
        private AppLogger _logger;

        public PaymentController(IConfiguration configuration)
        {
            _configuration = configuration;
            _logger = new AppLogger(configuration);
        }


        [HttpGet]
        [Route("GetCities")]

        public ResponseAddress GetCitiesAndTowns()
        {

            NpgsqlConnection connection = new NpgsqlConnection(_configuration.GetConnectionString("PostgreString").ToString());
            NpgsqlDataAdapter da = new NpgsqlDataAdapter("Select * From city", connection);
            DataTable dt = new DataTable();
            da.Fill(dt);

            ResponseAddress response = new ResponseAddress();
            List<City> cities = new List<City>();

            if (dt.Rows.Count > 0)
            {
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    City city = new City();
                    city.Id = Convert.ToInt32(dt.Rows[i]["id"]);
                    city.CityName = Convert.ToString(dt.Rows[i]["cityname"]);
                    cities.Add(city);
                }

                if (cities.Count > 0)
                {
                    response.StatusCode = 200;
                    response.StatusMessage = "Data Found";
                    response.cityList = cities;
                }


            }
            else
            {
                response.StatusCode = 100;
                response.StatusMessage = "No Data Found";
                response.cityList = null;
            }

            return response;

        }



        [HttpGet]
        [Route("GetTowns")]

        public ResponseAddress GetTowns(int id)
        {

            NpgsqlConnection connection = new NpgsqlConnection(_configuration.GetConnectionString("PostgreString").ToString());
            NpgsqlDataAdapter da = new NpgsqlDataAdapter($"Select townname From town where cityid={id}", connection);
            DataTable dt = new DataTable();
            da.Fill(dt);

            ResponseAddress response = new ResponseAddress();
            List<Town> towns = new List<Town>();

            if (dt.Rows.Count > 0)
            {
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    Town town = new Town();
                    town.TownName = Convert.ToString(dt.Rows[i]["townname"]);
                    towns.Add(town);
                }

                if (towns.Count > 0)
                {
                    response.StatusCode = 200;
                    response.StatusMessage = "Data Found";
                    response.townList = towns;
                }


            }
            else
            {
                response.StatusCode = 100;
                response.StatusMessage = "No Data Found";
                response.cityList = null;
            }

            return response;

        }

        [HttpGet]
        [Route("GetTotal")]
        public int GetTotal()
        {
            NpgsqlConnection connection = new NpgsqlConnection(_configuration.GetConnectionString("PostgreString").ToString());
            NpgsqlDataAdapter da = new NpgsqlDataAdapter($"SELECT SUM(totalprice) as total FROM cart;", connection);
            DataTable dt = new DataTable();
            da.Fill(dt);

            int totalprice = Convert.ToInt32(dt.Rows[0]["total"]);

            return totalprice;

        }


        [HttpPost]
        [Route("CompletePayment")]
        public Response CompletePayment(PaymentInfo info)
        {
            NpgsqlConnection connection = new NpgsqlConnection(_configuration.GetConnectionString("PostgreString").ToString());
            Response response = new Response();

            NpgsqlDataAdapter da = new NpgsqlDataAdapter($"Select * From creditcard Where cardnumber='{info.cardnumber}'", connection);
            DataTable dt = new DataTable();
            da.Fill(dt);

            if (dt.Rows.Count > 0)
            {

                if (info.cvc == Convert.ToInt32(dt.Rows[0]["cvc"]) && info.month == Convert.ToString(dt.Rows[0]["month"]) && info.year == Convert.ToInt32(dt.Rows[0]["year"]))
                {
                    da = new NpgsqlDataAdapter($"Select id From users Where email='{info.email}'", connection);
                    dt = new DataTable();
                    da.Fill(dt);
                    int customerid = Convert.ToInt32(dt.Rows[0]["id"]);

                    da = new NpgsqlDataAdapter($"SELECT SUM(totalprice) as total FROM cart;", connection);
                    dt = new DataTable();
                    da.Fill(dt);
                    int totalprice = Convert.ToInt32(dt.Rows[0]["total"]);


                    NpgsqlCommand command = new NpgsqlCommand($"INSERT INTO receipt(customerid,totalprice,address,city,town,zip) VALUES({customerid},{totalprice},'{info.address}','{info.city}','{info.town}',{info.zip})", connection);
                    connection.Open();
                    int i = command.ExecuteNonQuery();
                    connection.Close();

                    da = new NpgsqlDataAdapter($"SELECT receiptid FROM receipt order by receiptid desc limit 1", connection);
                    dt = new DataTable();
                    da.Fill(dt);
                    int receiptid = Convert.ToInt32(dt.Rows[0]["receiptid"]);


                    da = new NpgsqlDataAdapter($"SELECT * FROM cart;", connection);
                    dt = new DataTable();
                    da.Fill(dt);

                    for (int k = 0; k < dt.Rows.Count; k++)
                    {

                        int bookid = Convert.ToInt32(dt.Rows[k]["productid"]);
                        int amount = Convert.ToInt32(dt.Rows[k]["amount"]);
                        int sumprice = Convert.ToInt32(dt.Rows[k]["totalprice"]);

                        command = new NpgsqlCommand($"INSERT INTO receiptdetail VALUES({receiptid},{bookid},{sumprice},{amount})", connection);
                        connection.Open();
                        i = command.ExecuteNonQuery();
                        connection.Close();
                    }

                    command = new NpgsqlCommand("TRUNCATE TABLE cart", connection);
                    connection.Open();
                    i = command.ExecuteNonQuery();
                    connection.Close();

                    response.StatusCode = 200;
                    response.StatusMessage = "Payment successful";
                    _logger.AddLog($"Payment: useremail:{info.email} total={totalprice}" , DateTime.Now.ToString());



                }
                else
                {
                    response.StatusCode = 100;
                    response.StatusMessage = "Invalid credit card";

                }

            }
            else
            {
                response.StatusCode = 100;
                response.StatusMessage = "Please check your credit card number";
            }

            return response;

        }


        [HttpGet]
        [Route("Logout")]
        public Response Logout()
        {
            NpgsqlConnection connection = new NpgsqlConnection(_configuration.GetConnectionString("PostgreString").ToString());
            Response response = new Response();

            NpgsqlCommand command = new NpgsqlCommand("TRUNCATE TABLE cart", connection);
            NpgsqlCommand command2 = new NpgsqlCommand("TRUNCATE TABLE favorite", connection);
            connection.Open();
            int i = command.ExecuteNonQuery();
            int k = command2.ExecuteNonQuery();
            connection.Close();

            response.StatusCode = 200;
            response.StatusMessage = "Logout is successful";
            _logger.AddLog($"User logged out from system " , DateTime.Now.ToString());

            return response;

        }




















    }
}
