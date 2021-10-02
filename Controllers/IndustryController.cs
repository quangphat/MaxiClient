using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using my8ProgramingBlogClient.Infrastructures;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace my8ProgramingBlogClient.Controllers
{
    [Route("Industry")]
    public class IndustryController : BaseController
    {
        public IndustryController(HttpClient httpClient, IOptions<ClientConfig> clientConfig, CurrentProcess currentProcess) : base(httpClient, clientConfig, currentProcess)
        {
        }

        [HttpGet]
        [Route("search")]
        public async Task<IActionResult> Search(string freeText, int page, int limit)
        {
            return await GetAsync($"/{ApiRouteRsx.Industry}/search", new { freeText, page, limit });
        }
    }
}
