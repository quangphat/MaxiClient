using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace my8ProgramingBlogClient.Models
{
    public class RecommendedTag
    {
        public string Id { get; set; }
        public string Tag { get; set; }
        public int RecommendedType { get; set; }
        public int CountUsed { get; set; }
        public string CreatedBy { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime CreatedTime { get; set; }
        public DateTime ModifiedTime { get; set; }
    }
}
