using System;

namespace my8ProgramingBlogClient.Models
{
    public class Experience
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string CompanyName { get; set; }
        public Location Location { get; set; }
        public int StartMonth { get; set; }
        public int StartYear { get; set; }
        public bool IsPresent { get; set; }
        public int? EndMonth { get; set; }
        public int? EndYear { get; set; }
        public JobFunction JobFunction { get; set; }
        public string Description { get; set; }
        public string PersonId { get; set; }
    }
}

