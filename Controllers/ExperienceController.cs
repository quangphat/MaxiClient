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
    [Route("Experiences")]
    public class ExperienceController : BaseController
    {

        public ExperienceController(HttpClient httpClient, IOptions<ClientConfig> clientConfig, CurrentProcess currentProcess)
            : base(httpClient, clientConfig, currentProcess)
        {
            
        }
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Experience model)
        {
            if (model == null)
                return ToResponse(false,errors.invalid_data);
            return await PostAsync($"/{ApiRouteRsx.Experiences}", null, model);
        }
        [HttpGet]
        [Route("{personId}")]
        public async Task<IActionResult> GetByPersonId(string personId)
        {
            if (string.IsNullOrWhiteSpace(personId))
                return ToResponse(false, errors.invalid_data);
            return await GetAsync($"/{ApiRouteRsx.Experiences}/{personId}");
        }
    }
    
}