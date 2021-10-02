using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using my8ProgramingBlogClient.Infrastructures;
using my8ProgramingBlogClient.Models;
using my8ShareObject;
using my8ShareObject.ViewModels;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace my8ProgramingBlogClient.Controllers
{
    public class BaseController : Controller
    {
        protected readonly HttpClient _httpClient;
        protected readonly ClientConfig _clientConfig;
        protected readonly CurrentProcess _currentProcess;
        private const string SESSION_KEY = "current-user";
        public BaseController(HttpClient httpClient, IOptions<ClientConfig> clientConfig, CurrentProcess currentProcess)
        {
            _httpClient = httpClient;
            _clientConfig = clientConfig.Value;
            _currentProcess = currentProcess;
        }
        protected async Task<IActionResult> GetAsync(string path = "/", object param = null)
        {
            var response = await _httpClient.Call(_clientConfig, HttpContext, HttpMethod.Get, path, param, null, _currentProcess);
           
            return response;
        }
        protected async Task<IActionResult> DeleteAsync(string path = "/", object data = null)
        {
            return await _httpClient.Call(_clientConfig, HttpContext, HttpMethod.Delete, path, null, null, _currentProcess);
           
        }

        protected async Task<IActionResult> PostAsync(string path = "/", object param = null, object data = null)
        {
            return await _httpClient.Call(_clientConfig, HttpContext, HttpMethod.Post, path, null, data, _currentProcess);
           
        }

        protected async Task<IActionResult> PutAsync(string path = "/", object param = null, object data = null)
        {
            return await _httpClient.Call(_clientConfig, HttpContext, HttpMethod.Put, path, null, data, _currentProcess);
            
        }
        protected async Task<HttpClientResult<ResponseJsonModel<AccountViewModel>>> LoginPostAsync(string path = "/",
            object param = null, object data = null)
        {
            var result = await _httpClient.SendRequestAsync<ResponseJsonModel<AccountViewModel>>(_clientConfig, HttpContext.Request, path, param, data, _currentProcess);
            return result;
        }

        protected IActionResult ToResponse()
        {
            var model = new ResponseJsonModel();
            bool hasError = _checkHasError(model);
            return Json(model, _jsonSerializerSettings);
        }
        protected IActionResult ToResponse<T>(T data) where T : class
        {
            var model = new ResponseJsonModel<T>();
            if (!_checkHasError(model))
                model.data = data;

            return Json(model, _jsonSerializerSettings);
        }

        protected IActionResult ToResponse(bool isSuccess, string messageCode = null)
        {
            var model = new ResponseActionJsonModel();

            model.success = isSuccess;
            model.error = new ErrorJsonModel
            {
                code = messageCode
            };

            return Json(model, _jsonSerializerSettings);
        }
        private JsonSerializerSettings _jsonSerializerSettings = new JsonSerializerSettings
        {
            NullValueHandling = NullValueHandling.Include,
            ContractResolver = new CamelCasePropertyNamesContractResolver()
        };

        

        private bool _checkHasError(ResponseJsonModel model)
        {
            var hasError = _currentProcess.HasError;
            if (hasError)
            {
                var errorMessage = _currentProcess.ToError();

                model.error = new ErrorJsonModel()
                {
                    code = errorMessage.Message,
                    message = "error",
                    trace_keys = errorMessage.TraceKeys
                };
            }
            model.success = !hasError;
            return hasError;
        }
    }
}