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
    [Route("Categories")]
    public class CategoryController : BaseController
    {
        public CategoryController(HttpClient httpClient, IOptions<ClientConfig> clientConfig, CurrentProcess currentProcess)
            : base(httpClient, clientConfig, currentProcess)
        {
            
        }
        [HttpPost]
        [Route("create")]
        public async Task<IActionResult> Create([FromBody] Category model)
        {
            return await PostAsync($"/{ApiRouteRsx.Category}/create", null, model);
        }
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            return await GetAsync($"/{ApiRouteRsx.Category}");
        }
    }
}