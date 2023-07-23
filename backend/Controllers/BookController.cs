using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Npgsql;
using ProjectBookStore.Model;
using ProjectBookStore.Model.Response;
using System.Data;
using ProjectBookStore.Utils;

namespace ProjectBookStore.Controllers
{
    [Route("api")]
    [ApiController]
    public class BookController : ControllerBase
    {

        private readonly IConfiguration _configuration;
        private AppLogger _logger;


        public BookController(IConfiguration configuration)
        {
            _configuration = configuration;
            _logger=new AppLogger(configuration);
           
        }


        [HttpGet]
        [Route("ProductList")]    // View 

        public Response GetAllProducts()
        {
            List<Product> listproducts = new List<Product>();

            NpgsqlConnection connection = new NpgsqlConnection(_configuration.GetConnectionString("PostgreString").ToString());
            // NpgsqlDataAdapter da = new NpgsqlDataAdapter("Select * From products", connection);
            NpgsqlDataAdapter da = new NpgsqlDataAdapter("Select * from productsTable", connection);
            DataTable dt = new DataTable();
            da.Fill(dt);

            Response response = new Response();

            if (dt.Rows.Count > 0)
            {
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    Product product = new Product();
                    product.Id = Convert.ToInt32(dt.Rows[i]["id"]);
                    product.Name = Convert.ToString(dt.Rows[i]["name"]);
                    product.Price = Convert.ToInt32(dt.Rows[i]["price"]);
                    product.Image = Convert.ToString(dt.Rows[i]["image"]);
                    product.Category = Convert.ToString(dt.Rows[i]["category"]);
                    listproducts.Add(product);
                }

                if (listproducts.Count > 0)
                {
                    response.StatusCode = 200;
                    response.StatusMessage = "Data Found";
                    response.listproducts = listproducts;
                }


            }
            else
            {
                response.StatusCode = 100;
                response.StatusMessage = "No Data Found";
                response.listproducts = null;
            }

            return response;

        }


        // Add Book to cart
        [HttpPost]
        [Route("AddProduct")]
        public Response AddProduct(Product product)
        {
            NpgsqlConnection connection = new NpgsqlConnection(_configuration.GetConnectionString("PostgreString").ToString());
            Response response = new Response();

            NpgsqlDataAdapter da = new NpgsqlDataAdapter($"Select * From cart Where productid={product.Id}", connection);
            DataTable dt = new DataTable();
            da.Fill(dt);

            if (dt.Rows.Count == 0)
            {


                NpgsqlCommand command = new NpgsqlCommand($"INSERT INTO cart(productid,totalprice) VALUES({product.Id},{product.Price})", connection);
                connection.Open();
                int i = command.ExecuteNonQuery();
                connection.Close();

                if (i > 0)
                {
                    response.StatusCode = 200;
                    response.StatusMessage = "Item added to cart";
                    _logger.AddLog($"Book with id : {product.Id} added to cart" , DateTime.Now.ToString());
                }
                else
                {
                    response.StatusCode = 100;
                    response.StatusMessage = "Item can not added to cart (Internal Error)";
                }
            }
            else
            {
                response.StatusCode = 200;
                response.StatusMessage = "Item already added to cart !!";
            }

            return response;

        }

        // Add Book to Favorite
        [HttpPost]
        [Route("AddFavorite")]
        public Response AddFavorite(int id)
        {
            NpgsqlConnection connection = new NpgsqlConnection(_configuration.GetConnectionString("PostgreString").ToString());
            Response response = new Response();


            NpgsqlDataAdapter da = new NpgsqlDataAdapter($"Select * From favorite Where bookid={id}", connection);
            DataTable dt = new DataTable();
            da.Fill(dt);

            if (dt.Rows.Count == 0)
            {

                NpgsqlCommand command = new NpgsqlCommand($"INSERT INTO favorite(bookid) VALUES({id})", connection);
                connection.Open();
                int i = command.ExecuteNonQuery();
                connection.Close();

                if (i > 0)
                {
                    response.StatusCode = 200;
                    response.StatusMessage = "Item added to favorite";
                    _logger.AddLog($"Book with id : {id} added to favorites" , DateTime.Now.ToString());
                }
                else
                {
                    response.StatusCode = 100;
                    response.StatusMessage = "Item can not added to favorite (Internal Error)";
                }
            }
            else
            {
                response.StatusCode = 200;
                response.StatusMessage = "Item already added to favorite !!";
            }

            return response;

        }

        //Get Cart List
        [HttpGet]
        [Route("CartList")]
        public Response GetCartList()
        {
            List<Product> listproducts = new List<Product>();

            NpgsqlConnection connection = new NpgsqlConnection(_configuration.GetConnectionString("PostgreString").ToString());
            NpgsqlDataAdapter da = new NpgsqlDataAdapter("Select P.id,P.name, P.image, P.price,C.amount From products P Inner Join cart C on C.productid=P.id", connection);
            DataTable dt = new DataTable();
            da.Fill(dt);

            Response response = new Response();

            if (dt.Rows.Count > 0)
            {
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    Product product = new Product();
                    product.Id = Convert.ToInt32(dt.Rows[i]["id"]);
                    product.Name = Convert.ToString(dt.Rows[i]["name"]);
                    product.Price = Convert.ToInt32(dt.Rows[i]["price"]);
                    product.Image = Convert.ToString(dt.Rows[i]["image"]);
                    product.Amount = Convert.ToInt32(dt.Rows[i]["amount"]);
                    listproducts.Add(product);
                }

                if (listproducts.Count > 0)
                {
                    response.StatusCode = 200;
                    response.StatusMessage = "Data Found";
                    response.listproducts = listproducts;
                }


            }
            else
            {
                response.StatusCode = 100;
                response.StatusMessage = "No Data Found";
                response.listproducts = null;
            }

            return response;

        }


        [HttpDelete("{id}")]  //SP
        public Response DeleteBook(int id)
        {
            NpgsqlConnection connection = new NpgsqlConnection(_configuration.GetConnectionString("PostgreString").ToString());
            Response response = new Response();
            // NpgsqlCommand command = new NpgsqlCommand($"DELETE FROM cart WHERE productid={id}", connection);
            NpgsqlCommand command = new NpgsqlCommand("call delete_book(:p_id)", connection);  // SP
            command.Parameters.AddWithValue("p_id", DbType.Int64).Value = id;
            command.CommandType = CommandType.Text;
            connection.Open();
            int i = command.ExecuteNonQuery();
            connection.Close();

            response.StatusCode = 200;
            response.StatusMessage = "Item deleted from cart";
            _logger.AddLog($"Book with id : {id} deleted from cart" , DateTime.Now.ToString());

            return response;

        }


        [HttpPost]
        [Route("DeleteFavorite")]
        public Response DeleteFavorite(int id)
        {
            NpgsqlConnection connection = new NpgsqlConnection(_configuration.GetConnectionString("PostgreString").ToString());
            Response response = new Response();
            NpgsqlCommand command = new NpgsqlCommand($"DELETE FROM favorite WHERE bookid={id}", connection);
            connection.Open();
            int i = command.ExecuteNonQuery();
            connection.Close();

            if (i > 0)
            {
                response.StatusCode = 200;
                response.StatusMessage = "Item deleted from favorites";
                _logger.AddLog($"Book with id : {id} deleted from favorite" , DateTime.Now.ToString());
            }
            else
            {
                response.StatusCode = 100;
                response.StatusMessage = "Item can not deleted from favorites";
            }


            return response;

        }

        //Get Favorite List
        [HttpGet]
        [Route("FavoriteList")]  //view
        public Response FavoriteList()
        {
            List<Product> listproducts = new List<Product>();

            NpgsqlConnection connection = new NpgsqlConnection(_configuration.GetConnectionString("PostgreString").ToString());
            // NpgsqlDataAdapter da = new NpgsqlDataAdapter("Select P.id,P.name, P.image,P.price From products P Inner Join favorite F on F.bookid=P.id", connection);
            NpgsqlDataAdapter da = new NpgsqlDataAdapter("Select * from favoriteTable", connection);
            DataTable dt = new DataTable();
            da.Fill(dt);

            Response response = new Response();

            if (dt.Rows.Count > 0)
            {
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    Product product = new Product();
                    product.Id = Convert.ToInt32(dt.Rows[i]["id"]);
                    product.Name = Convert.ToString(dt.Rows[i]["name"]);
                    product.Price = Convert.ToInt32(dt.Rows[i]["price"]);
                    product.Image = Convert.ToString(dt.Rows[i]["image"]);

                    listproducts.Add(product);
                }

                if (listproducts.Count > 0)
                {
                    response.StatusCode = 200;
                    response.StatusMessage = "Data Found";
                    response.listproducts = listproducts;
                }


            }
            else
            {
                response.StatusCode = 100;
                response.StatusMessage = "No Data Found";
                response.listproducts = null;
            }

            return response;

        }


        [HttpPut]
        [Route("UpdateCart")]  // Sp 
        public ResponseUpdate UpdateBook(UpdatedBook updatedBook)
        {

            NpgsqlConnection connection = new NpgsqlConnection(_configuration.GetConnectionString("PostgreString").ToString());
            ResponseUpdate response = new ResponseUpdate();

            // NpgsqlCommand command = new NpgsqlCommand($"UPDATE cart SET amount={updatedBook.Amount},totalprice={updatedBook.Amount * updatedBook.Price}WHERE productid={updatedBook.Id}", connection);
            // NpgsqlCommand command = new NpgsqlCommand($"UPDATE cart SET amount={updatedBook.Amount},totalprice={updatedBook.Amount * updatedBook.Price}WHERE productid={updatedBook.Id}", connection);
            NpgsqlCommand command = new NpgsqlCommand($"call update_book({updatedBook.Amount},{updatedBook.Amount * updatedBook.Price},{updatedBook.Id})", connection);  // SP
            command.CommandType = CommandType.Text;
            connection.Open();
            int i = command.ExecuteNonQuery();
            connection.Close();

            response.StatusCode = 200;
            response.StatusMessage = "Item updated from cart";
            _logger.AddLog($"Book with id: {updatedBook.Id} updated in cart" , DateTime.Now.ToString());

            return response;
        }



        [HttpGet]
        [Route("CategoryList")]

        public List<String> GetCategoryList()
        {
            List<String> listproducts = new List<String>();

            NpgsqlConnection connection = new NpgsqlConnection(_configuration.GetConnectionString("PostgreString").ToString());
            NpgsqlDataAdapter da = new NpgsqlDataAdapter("Select * From category", connection);
            DataTable dt = new DataTable();
            da.Fill(dt);


            if (dt.Rows.Count > 0)
            {
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    listproducts.Add(Convert.ToString(dt.Rows[i]["name"]));
                }

            }

            return listproducts;
        }



        [HttpGet]
        [Route("GetByCategory")]

        public Response GetByCategory(String category)
        {
            List<Product> listproducts = new List<Product>();
            NpgsqlConnection connection = new NpgsqlConnection(_configuration.GetConnectionString("PostgreString").ToString());

            NpgsqlDataAdapter da;
            if (!(category == "All"))
            {
                da = new NpgsqlDataAdapter($"Select * From products where category='{category}'", connection);
            }
            else
            {
                da = new NpgsqlDataAdapter($"Select * From products", connection);
            }

            DataTable dt = new DataTable();
            da.Fill(dt);

            Response response = new Response();

            if (dt.Rows.Count > 0)
            {
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    Product product = new Product();
                    product.Id = Convert.ToInt32(dt.Rows[i]["id"]);
                    product.Name = Convert.ToString(dt.Rows[i]["name"]);
                    product.Price = Convert.ToInt32(dt.Rows[i]["price"]);
                    product.Image = Convert.ToString(dt.Rows[i]["image"]);
                    product.Category = Convert.ToString(dt.Rows[i]["category"]);
                    listproducts.Add(product);
                }

                if (listproducts.Count > 0)
                {
                    response.StatusCode = 200;
                    response.StatusMessage = "Data Found";
                    response.listproducts = listproducts;
                    _logger.AddLog($"[GET] Request for book list by category: " + category , DateTime.Now.ToString());
                }


            }
            else
            {
                response.StatusCode = 200;
                response.StatusMessage = "No Data Found";
                response.listproducts = null;
            }

            return response;

        }



































    }
}
