using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace my8ProgramingBlogClient.Infrastructures
{
    public class ResponseJsonModel
    {
        public ErrorJsonModel error { get; set; }
    }
    public class ResponseJsonModel<T> : ResponseJsonModel where T : class
    {
        public T data { get; set; }

        public void InitDefaultData(T defaultData)
        {
            error = null;
            data = defaultData;
        }
    }
    public class ErrorJsonModel
    {
        public string code { get; set; }
        public string message { get; set; }
        public List<object> trace_keys { get; set; }
    }
    public class ResponseActionJsonModel : ResponseJsonModel
    {
        public bool? success { get; set; }
    }
}
