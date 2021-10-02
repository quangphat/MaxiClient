using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace my8ProgramingBlogClient.Models
{
    public class ApplyJobModel
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string JobId { get; set; }
        public decimal? MinSalary { get; set; }
        public IFormFile File { get; set; }
    }

    public class ApplyJobApiModel
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string JobId { get; set; }
        public decimal? MinSalary { get; set; }
        public List<Tuple<string, object>> File { get; set; }
    }
}
