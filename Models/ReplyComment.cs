using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace my8ProgramingBlogClient.Models
{
    public class ReplyComment
    {
        public string Id { get; set; }
        public string CommentId { get; set; }
        public string ArticleId { get; set; }
        public string Content { get; set; }
        public Author Author { get; set; }
        public int Likes { get; set; }
        public bool IsHidden { get; set; }
        public DateTime CreatedTime { get; set; }
        public DateTime ModifiedTime { get; set; }
        public string ProjectId { get; set; }
    }
}
