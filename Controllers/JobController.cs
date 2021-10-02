using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using my8ProgramingBlogClient.Infrastructures;
using my8ProgramingBlogClient.Models;

namespace my8ProgramingBlogClient.Controllers
{
    [Route("Jobs")]
    public class JobController : BaseController
    {
        public JobController(HttpClient httpClient, IOptions<ClientConfig> clientConfig, CurrentProcess currentProcess)
            : base(httpClient, clientConfig, currentProcess)
        {

        }

        [HttpGet]
        [Route("search")]
        public async Task<IActionResult> Gets(string searchStr, string authorId, string categoryId, int page, int limit)
        {
            return await GetAsync($"/{ApiRouteRsx.Job}/search", new
            {
                searchStr,
                authorId,
                categoryId,
                page,
                limit
            });
        }

        [HttpGet]
        [Route("employmenttypes-simples")]
        public async Task<IActionResult> GetByPersonId(string personId)
        {
            return await GetAsync($"/{ApiRouteRsx.Job}/employmenttypes-simples");
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            return await GetAsync($"/{ApiRouteRsx.Job}/{id}");
        }

        [HttpGet("friendlyUrl/{friendlyUrl}")]
        public async Task<IActionResult> GetByFriendlyUrl(string friendlyUrl)
        {
            return await GetAsync($"/{ApiRouteRsx.Job}/friendlyUrl/{friendlyUrl}");
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] JobCreateModel model)
        {
            return await PostAsync($"/{ApiRouteRsx.Job}", data: model);
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] Job model)
        {
            return await PutAsync($"/{ApiRouteRsx.Job}", data: model);
        }

        [HttpPost]
        [Route("applyjob")]
        public async Task<IActionResult> UploadAvatar([FromForm] ApplyJobModel model)
        {
            if (model == null)
            {
                return ToResponse(false, "invalid_data");
            }

            if (model.File == null)
            {
                return ToResponse(false, "missing_cv_file");
            }

            var postModel = new ApplyJobApiModel
            {
                FullName = model.FullName,
                MinSalary = model.MinSalary,
                Email = model.Email,
                JobId = model.JobId,
                Phone = model.Phone,
                File = await model.File.UploadFileHelper()
            };

            return await PostAsync($"/{ApiRouteRsx.Job}/applyjob", data: postModel);
        }
    }
}