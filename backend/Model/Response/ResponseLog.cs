
namespace ProjectBookStore.Model.Response
{
    public class ResponseLog
    {
        public int StatusCode { get; set; }
        public string StatusMessage { get; set; }
        public List<Log> list { get; set; }
        
    }
}