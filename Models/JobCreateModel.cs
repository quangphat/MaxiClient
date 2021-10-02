using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace my8ProgramingBlogClient.Models
{
    public class JobCreateModel
    {
        public string Title { get; set; }
        public string Preview { get; set; }
        public string Content { get; set; }
        public int Status { get; set; }
        public List<LocationSimple> Locations { get; set; }
        public decimal? MinSalary { get; set; }
        public decimal? MaxSalary { get; set; }
        public int SalaryType { get; set; }
        public bool IsNegotiationSalary { get; set; }
        public string EmploymentType { get; set; }
        public string ExperienceLevel { get; set; }
        public List<string> Tags { get; set; }
        public bool IsHeadHunt { get; set; }
    }

    public class Job 
    {
        public string Id { get; set; }
        public DateTime CreatedTime { get; set; }
        public DateTime ModifiedTime { get; set; }
        public string CreatedBy { get; set; }
        public string ModifiedBy { get; set; }
        public bool IsDeleted { get; set; }
        public string ProjectId { get; set; }
        public string Title { get; set; }
        public string Preview { get; set; }
        public string Content { get; set; }
        public int Status { get; set; }
        public List<LocationSimple> Locations { get; set; }
        public decimal? MinSalary { get; set; }
        public decimal? MaxSalary { get; set; }
        public int SalaryType { get; set; }
        public bool IsNegotiationSalary { get; set; }
        public string EmploymentType { get; set; }
        public string ExperienceLevel { get; set; }
        public List<string> Tags { get; set; }
        public string StatusReason { get; set; }
        public bool IsHeadHunt { get; set; }
        public string FriendlyUrl { get; set; }
    }
}
