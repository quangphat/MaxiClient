using System;

namespace my8ProgramingBlogClient.Models
{
    public class Category
    {
        public string Id { get; set; }
        public string CategoryName { get; set; }
        public bool IsRoot { get; set; }
        public string ParentCategoryId { get; set; }
        public int Level { get; set; }
        public string ProjectId { get; set; }
        public string[] CategoryIds { get; set; }
        public string[] CategoryNames { get; set; }
        public DateTime? CreatedTime { get; set; }
        public DateTime? ModifiedTime { get; set; }
    }
}

