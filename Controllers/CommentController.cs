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
    [Route("Comments")]
    public class CommentController : BaseController
    {
        public CommentController(HttpClient httpClient, IOptions<ClientConfig> clientConfig, CurrentProcess currentProcess)
            : base(httpClient, clientConfig, currentProcess)
        {
            
        }
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Comments model)
        {
            return await PostAsync($"/{ApiRouteRsx.Comment}", null, model);
        }
        [HttpGet]
        [Route("{feedId}/{page}/{limit}")]
        public async Task<IActionResult> GetByFeedId(string feedId, int page, int limit)
        {
            return await GetAsync($"/{ApiRouteRsx.Comment}/{feedId}/{page}/{limit}");
        }
    }
}