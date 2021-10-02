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
    [Route("global")]
    public class SearchModelController : BaseController
    {
        public SearchModelController(HttpClient httpClient, IOptions<ClientConfig> clientConfig, CurrentProcess currentProcess)
            : base(httpClient, clientConfig, currentProcess)
        {
            
        }
        [HttpGet]
        public async Task<IActionResult> Search(string freeText, int page, int limit)
        {
            return await GetAsync($"/{ApiRouteRsx.Global}", new { freeText, page, limit });
        }
    }
}