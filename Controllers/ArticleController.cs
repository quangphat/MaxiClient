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
    [Route("Articles")]
    public class ArticleController : BaseController
    {
        public ArticleController(HttpClient httpClient, IOptions<ClientConfig> clientConfig, CurrentProcess currentProcess)
            : base(httpClient, clientConfig, currentProcess)
        {
            //_lastSkip = 0;
        }
        [HttpGet]
        [Route("search")]
        public async Task<IActionResult> Gets(string searchStr, string authorId, string categoryId, int page, int limit)
        {
            return await GetAsync($"/{ApiRouteRsx.Article}/search", new
            {
                searchStr,
                authorId,
                categoryId,
                page,
                limit
            });
        }
        [HttpGet]
        [Route("byauthor/{authorId}")]
        public async Task<IActionResult> GetsByAuthor( string authorId, int page, int limit)
        {
            return await GetAsync($"/{ApiRouteRsx.Article}/byauthor/{authorId}", new
            {
                page,
                limit
            });
        }
        [HttpPost]
        [Route("top3byAuthor/{authorId}")]
        public async Task<IActionResult> GetRelateArticleByAuthor(string authorId,[FromBody] StringModel ignoreIds)
        {
            return await PostAsync($"/{ApiRouteRsx.Article}/top3byAuthor/{authorId}", null, ignoreIds);
        }
        [HttpPost]
        [Route("relatebytags/{ignoreAuthorId}")]
        public async Task<IActionResult> GetRelateArticleByTags(string ignoreAuthorId,[FromBody] StringModelV2 model)
        {
            return await PostAsync($"/{ApiRouteRsx.Article}/relatebytags/{ignoreAuthorId}", null, model);
        }
        [HttpGet]
        [Route("tags")]
        public async Task<IActionResult> GetRelateArticleByTags(string tags, int page, int limit)
        {
            return await GetAsync($"/{ApiRouteRsx.Article}/tags", new {tags, page, limit });
        }
        [HttpGet]
        [Route("series")]
        public async Task<IActionResult> GetSeriesByAuthor(string searchStr, string authorId, string categoryId, int page, int limit)
        {
            return await GetAsync($"/{ApiRouteRsx.Article}/series", new
            {
                searchStr,
                authorId,
                categoryId,
                page,
                limit
            });
        }
        [HttpPost]
        public async Task<IActionResult> CreateArticle([FromBody] Article model)
        {
            if (model == null)
                return BadRequest();
            var author = AutoMapper.Mapper.Map<Author>(_currentProcess.Account);
            model.Author = author;
            return await PostAsync($"/{ApiRouteRsx.Article}", null, model);
        }
        [HttpPost]
        [Route("draft")]
        public async Task<IActionResult> CreateArticleDraft()
        {
           
            return await PostAsync($"/{ApiRouteRsx.Article}/draft");
        }
        [HttpGet]
        [Route("draft/{draftId}")]
        public async Task<IActionResult> GetDraftById(string draftId)
        {
            return await GetAsync($"/{ApiRouteRsx.Article}/draft/{draftId}");
        }
        [HttpGet]
        [Route("{articleId}")]
        public async Task<IActionResult> Detail(string articleId)
        {
            if (string.IsNullOrWhiteSpace(articleId))
                return BadRequest();
            return await GetAsync($"/{ApiRouteRsx.Article}/{articleId}");
        }
        [HttpGet]
        [Route("friendlyurl/{friendlyUrl}")]
        public async Task<IActionResult> GetByFriendlyUrl(string friendlyUrl)
        {
            if (string.IsNullOrWhiteSpace(friendlyUrl))
                return BadRequest();
            return await GetAsync($"/{ApiRouteRsx.Article}/friendlyurl/{friendlyUrl}");
        }
        [HttpPost]
        [Route("like/{articleId}/{isLike}")]
        public async Task<IActionResult> Like(string articleId, bool isLike)
        {
            if(isLike)
            {
                return await PostAsync($"/{ApiRouteRsx.Article}/like/{articleId}");
            }
            return await PostAsync($"/{ApiRouteRsx.Article}/unlike/{articleId}");
        }
        [HttpPut]
        public async Task<IActionResult> Update([FromBody] Article model)
        {
            return await PutAsync($"/{ApiRouteRsx.Article}", null, model);
        }
        [HttpPut("draft")]
        public async Task<IActionResult> SaveDraft([FromBody] Article model)
        {
            if (model == null)
                return BadRequest();
            Author author = AutoMapper.Mapper.Map<Author>(_currentProcess.Account);
            model.Author = author;
            return await PutAsync($"/{ApiRouteRsx.Article}/draft", null, model);
        }
    }
}