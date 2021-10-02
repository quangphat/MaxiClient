
namespace my8ProgramingBlogClient.Models
{
    public class Notification
    {
        public string Id { get; set; }
        public string OwnerActionId { get; set; }//accountId
        public string Content { get; set; }
        public string[] ReceiversId { get; set; }
    }
}
