namespace ProjectBookStore.Model.Response
{
    public class ResponseLogin
    {

        public int StatusCode { get; set; }
        public string StatusMessage { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Telephone { get; set; }

    }
}
