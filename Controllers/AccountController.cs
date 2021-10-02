using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using CoreObject.Mongo;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using my8ProgramingBlogClient.Infrastructures;
using my8ProgramingBlogClient.Models;
using my8ShareObject;
using my8ShareObject.Request;
using my8ShareObject.ViewModels;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace my8ProgramingBlogClient.Controllers
{
    [Route("account")]
    public class AccountController : BaseController
    {
        public AccountController(HttpClient httpClient, IOptions<ClientConfig> clientConfig, CurrentProcess currentProcess)
            : base(httpClient, clientConfig, currentProcess)
        {
        }

        public IActionResult Login()
        {
            return View();
        }
        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login([FromBody] AccountLogin model)
        {
            var account = await LoginUser(model);

            if (!isValidAccount(account))
                return ToResponse(account);

            List<Claim> claims = new List<Claim>();
            claims.Add(new Claim("PersonId", account.PersonId));

            claims.Add(new Claim("Email", account.Email));

            claims.Add(new Claim("ProjectId", account.ProjectId.ToString()));

            if (!string.IsNullOrWhiteSpace(account.DisplayName))
                claims.Add(new Claim("DisplayName", account.DisplayName));

            if (!string.IsNullOrWhiteSpace(account.Headline))
                claims.Add(new Claim("WorkAs", account.Headline));

            if (!string.IsNullOrWhiteSpace(account.Role))
                claims.Add(new Claim("Role", account.Role));

            if (!string.IsNullOrWhiteSpace(account.Avatar))
                claims.Add(new Claim("Avatar", account.Avatar));

            if (!string.IsNullOrWhiteSpace(account.ProfileName))
                claims.Add(new Claim("ProfileName", account.ProfileName));

            if (string.IsNullOrWhiteSpace(account.Token) || string.IsNullOrWhiteSpace(account.RefreshToken))
                return null;

            claims.Add(new Claim("access_token", account.Token));

            claims.Add(new Claim("refresh_token", account.RefreshToken));

            if (account.Scopes != null && account.Scopes.Any())
            {
                claims.Add(new Claim("Scopes", String.Join(",", account.Scopes)));
            }
            var userIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

            ClaimsPrincipal principal = new ClaimsPrincipal(userIdentity);
            var authProperties = new AuthenticationProperties
            {
                IsPersistent = true
            };
            await HttpContext.SignInAsync(principal, authProperties);
            return ToResponse(account);
        }


        [HttpPost]
        [Route("signup")]
        public async Task<IActionResult> SignUp([FromBody] RegisterModel model)
        {
            return await PostAsync($"/{ApiRouteRsx.Account}/signup", null, model);
        }

        [HttpPost]
        [Route("employer/signup")]
        public async Task<IActionResult> EmployerSignUp([FromBody] CompanyRegisterModel model)
        {
            return await PostAsync($"/{ApiRouteRsx.Account}/employer/signup", null, model);
        }

        private bool isValidAccount(AccountViewModel account)
        {
            if (account == null
                || string.IsNullOrWhiteSpace(account.PersonId)
                || string.IsNullOrWhiteSpace(account.Email)
                || string.IsNullOrWhiteSpace(account.ProjectId))
                return false;
            return true;
        }


        [HttpPost]
        [Route("selecttag/{personId}")]
        public async Task<IActionResult> SelectTags([FromBody] StringModel model, string personId)
        {
            return await PostAsync($"/{ApiRouteRsx.Account}/selecttag/{personId}", null, model);
        }

        [HttpPost]
        [Route("security")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePassword model)
        {
            return await PostAsync($"/{ApiRouteRsx.Account}/security", null, model);
        }


        private async Task<AccountViewModel> LoginUser(AccountLogin model)
        {
            if (model == null)
            {
                return null;
            }
            if (string.IsNullOrWhiteSpace(model.Password) || string.IsNullOrWhiteSpace(model.Email))
            {
                return null;
            }
            //model.Password = Utils.GetSHA256Hash(model.Password);
            var result = await LoginPostAsync("/accounts/login", null, model);
            if (result.StatusCode == System.Net.HttpStatusCode.OK && result.Data != null)
            {
                if(result.Data.success)
                {
                    return result.Data.data;
                }
                else
                {
                    _currentProcess.AddError(result.Data.error.code);
                    return null;
                }
                
            }
            return null;
        }
    }
}