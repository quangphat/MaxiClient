using my8ProgramingBlogClient.Models;
using System;

public class Comments
{

    public string Id { get; set; }
    public string Content { get; set; }
    public Author Author { get; set; }
    public string ArticleId { get; set; }
    public int Likes { get; set; }
    public int Replies { get; set; }
    public bool IsHidden { get; set; }
    public DateTime CreatedTime { get; set; }
    public DateTime ModifiedTime { get; set; }
    public int ProjectId { get; set; }
}
