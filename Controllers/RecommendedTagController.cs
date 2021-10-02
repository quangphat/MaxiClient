using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using my8ProgramingBlogClient.Infrastructures;
using my8ProgramingBlogClient.Models;

namespace my8ProgramingBlogClient.Controllers
{
    [Route("RecommendedTags")]
    public class RecommendedTagController : BaseController
    {
        public RecommendedTagController(HttpClient httpClient, IOptions<ClientConfig> clientConfig, CurrentProcess currentProcess)
            : base(httpClient, clientConfig, currentProcess)
        {
            
        }
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] RecommendedTag model)
        {
            return await PostAsync($"/{ApiRouteRsx.RecommendedTags}", null, model);
        }
        
        [HttpGet]
        public async Task<IActionResult> GetAllTags()
        {
            return await GetAsync($"/{ApiRouteRsx.RecommendedTags}/greencode");
        }
    }
}