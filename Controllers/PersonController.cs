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
    [Route("Person")]
    public class PersonController : BaseController
    {
        public PersonController(HttpClient httpClient, IOptions<ClientConfig> clientConfig, CurrentProcess currentProcess)
            : base(httpClient, clientConfig, currentProcess)
        {

        }
        [HttpGet]
        [Route("{profileName}")]
        public async Task<IActionResult> GetProfileByName(string profileName)
        {
            return await GetAsync($"/{ApiRouteRsx.Author}/{profileName}");
        }
        [HttpPut]
        [Route("skills")]
        public async Task<IActionResult> UpdateSkill([FromBody] StringModel model)
        {
            return await PutAsync($"/{ApiRouteRsx.Author}/skills", null, model);
        }
        [HttpGet]
        [Route("skills/{personId}")]
        public async Task<IActionResult> GetPersonSkill(string personId)
        {
            return await GetAsync($"/{ApiRouteRsx.Author}/skills/{personId}");
        }
    }
}