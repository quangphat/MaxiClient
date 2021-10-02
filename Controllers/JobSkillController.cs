using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using my8ProgramingBlogClient.Infrastructures;

namespace my8ProgramingBlogClient.Controllers
{
    [Route("JobSkills")]
    public class JobSkillController : BaseController
    {
        public JobSkillController(HttpClient httpClient, IOptions<ClientConfig> clientConfig, CurrentProcess currentProcess)
            : base(httpClient, clientConfig, currentProcess)
        {
            
        }
        [HttpGet]
        [Route("search")]
        public async Task<IActionResult> Search(string freeText, int page, int limit)
        {
            return await GetAsync($"/{ApiRouteRsx.JobSkill}/search", new { freeText, page, limit });
        }
        [HttpGet]
        [Route("suggested")]
        public async Task<IActionResult> GetSuggestedSkill()
        {
            return await GetAsync($"/{ApiRouteRsx.JobSkill}/suggested");
        }
    }
}