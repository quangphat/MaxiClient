using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace my8ProgramingBlogClient.Infrastructures
{
    public class ClientConfig
    {
        public string ServiceUrl { get; set; }
        public string ApiKey { get; set; }
        public string SecretKey { get; set; }
        public string ProjectId { get; set; }
    }
}
