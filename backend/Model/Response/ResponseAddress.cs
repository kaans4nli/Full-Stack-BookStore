namespace ProjectBookStore.Model.Response
{
    public class ResponseAddress
    {
        public int StatusCode { get; set; }
        public string StatusMessage { get; set; }
        public List<City> cityList { get; set; }

        public List<Town> townList { get; set; }



    }
}
