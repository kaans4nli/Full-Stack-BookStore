using System.ComponentModel.Design;
using Npgsql;

namespace ProjectBookStore.Utils
{
    public class AppLogger
    {

        private readonly IConfiguration _configuration;


        public AppLogger(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public void AddLog(String text,String date)
        {
            NpgsqlConnection connection = new NpgsqlConnection(_configuration.GetConnectionString("PostgreString").ToString());
            NpgsqlCommand command = new NpgsqlCommand($"INSERT INTO logger(log,date) VALUES('{text}','{date}')", connection);
            connection.Open();
            int i = command.ExecuteNonQuery();
            connection.Close();
        }


    }
}
