using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using my8ProgramingBlogClient.Infrastructures;
using my8ProgramingBlogClient.Models;
using my8ShareObject;
using my8ShareObject.ViewModels;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Reflection;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace my8ProgramingBlogClient.Infrastructures
{
    public static class CoreApiClient
    {
        private static bool _IsTokenExpired = false;
        public static async Task<IActionResult> Call(this HttpClient httpClient, ClientConfig clientConfig, HttpContext context,
            HttpMethod method, string path = "/", object param = null, object data = null, CurrentProcess process = null)
        {
            if (param != null)
                path = path.AddQuery(param);
            var url = $"{clientConfig.ServiceUrl}{path}";
            var requestMessage = new HttpRequestMessage(method, url);
            string json = null;

            HttpContent content = null;

            if (data != null)
                if (data is string)
                    content = new StringContent((string)data, Encoding.UTF8, "application/json");
                else if (data is IDictionary<string, object>)
                {
                    var formData = new MultipartFormDataContent();

                    foreach (var pair in data as IDictionary<string, object>)
                        if (pair.Value is byte[])
                            formData.Add(new ByteArrayContent(pair.Value as byte[]), pair.Key, pair.Key);
                        else
                            formData.Add(new StringContent(pair.Value.ToString()), pair.Key);

                    content = formData;
                }
                else
                {
                    json = JsonConvert.SerializeObject(data, new JsonSerializerSettings
                    {
                        NullValueHandling = NullValueHandling.Ignore
                    });

                    content = new StringContent(json, Encoding.UTF8, "application/json");
                }
            var signature = string.Empty;
            var originalData = string.Empty;
            if (method == HttpMethod.Get)
            {
                var list = new List<string>();

                if (url.Contains("?"))
                    foreach (var q in url.Split('?')[1].Split('&'))
                        if (q.Contains("="))
                            list.Add(q.Split('=')[1]);

                originalData = string.Join(string.Empty, list);
            }
            else if (data != null)
                originalData = json;

            if (string.IsNullOrWhiteSpace(originalData))
                originalData = string.Empty;
            string personId = process != null ? process?.Account?.PersonId : "guest";
            requestMessage.Headers.Add("X-my8-Key", clientConfig.ApiKey);
            requestMessage.Headers.Add("X-my8-PersonId", personId);
            requestMessage.Headers.Add("X-my8-ProjectId", clientConfig.ProjectId.ToString());
            if (process.Account != null)
            {
                //requestMessage.Headers.Add("Authorization", $"Bearer {process.Account.Token}");
                requestMessage.Headers.Authorization = new AuthenticationHeaderValue("Bearer", process.Account.Token);
            }
            
            requestMessage.Content = content;
            var response = await httpClient.SendAsync(requestMessage).ConfigureAwait(false);
            IEnumerable<string> headerValues;
            var refreshTokenData = null as AccountViewModel;
            if ((response.Headers.TryGetValues("Token-Expired", out headerValues)))
            {
                if (Convert.ToBoolean(headerValues.FirstOrDefault()) == true)
                {
                    _IsTokenExpired = true;
                }
            }
            else if (response.StatusCode == HttpStatusCode.Unauthorized && process.Account != null)
            {
                _IsTokenExpired = true;
            }
            refreshTokenData = await GetRefreshTokenAsync(httpClient, clientConfig, context.Request, process);
            if (refreshTokenData != null)
            {
                process.Account.Token = refreshTokenData.Token;
                process.Account.RefreshToken = refreshTokenData.RefreshToken;
                //requestMessage.Headers.Add("Authorization", $"Bearer {process.Account.Token}");
                
                requestMessage.Headers.Authorization = new AuthenticationHeaderValue("Bearer", process.Account.Token);
                // response = await httpClient.SendAsync(requestMessage).ConfigureAwait(false);
                var retry = await requestMessage.CloneAsync();
                response = await httpClient.SendAsync(retry).ConfigureAwait(false);
                await SetNewCookieAsync(refreshTokenData, context);
            }
            response.EnsureSuccessStatusCode();
            return new HttpContentActionResult(response.Content);
        }
        public static async Task<HttpRequestMessage> CloneAsync(this HttpRequestMessage request)
        {
            var clone = new HttpRequestMessage(request.Method, request.RequestUri)
            {
                Content = await request.Content.CloneAsync().ConfigureAwait(false),
                Version = request.Version
            };
            foreach (KeyValuePair<string, object> prop in request.Properties)
            {
                clone.Properties.Add(prop);
            }
            foreach (KeyValuePair<string, IEnumerable<string>> header in request.Headers)
            {
                clone.Headers.TryAddWithoutValidation(header.Key, header.Value);
            }

            return clone;
        }

        public static async Task<HttpContent> CloneAsync(this HttpContent content)
        {
            if (content == null) return null;

            var ms = new MemoryStream();
            await content.CopyToAsync(ms).ConfigureAwait(false);
            ms.Position = 0;

            var clone = new StreamContent(ms);
            foreach (KeyValuePair<string, IEnumerable<string>> header in content.Headers)
            {
                clone.Headers.Add(header.Key, header.Value);
            }
            return clone;
        }
        public static async Task<AccountViewModel> GetRefreshTokenAsync(this HttpClient httpClient, ClientConfig clientConfig, HttpRequest request, CurrentProcess process = null)
        {
            if (!_IsTokenExpired)
                return null;
            var data = new RefreshTokenRequest
            {
                Email = process.Account.Email,
                OldToken = process.Account.Token,
                RefreshToken = process.Account.RefreshToken
            };
            var response = await httpClient.SendRequestAsync<ResponseJsonModel<AccountViewModel>>(clientConfig, request, "/accounts/refresh_token", null, data, process);
            if (response != null && response.Data != null)
            {
                _IsTokenExpired = false;
                return response.Data.data;
            }
            return null;
        }
        public static async Task<HttpClientResult<T>> SendRequestAsync<T>(
             this HttpClient httpClient, ClientConfig clientConfig,
             HttpRequest request, string path = "/", object param = null, object data = null, CurrentProcess process = null)
        {
            var response = await httpClient.CallGetResponse(clientConfig, request, HttpMethod.Post, path, param, data, process);

            if (response != null)
            {
                var result = JsonConvert.DeserializeObject<T>(response.Item2);

                if (result is ResponseJsonModel)
                {
                    var obj = result as ResponseJsonModel;

                    if (obj?.error?.code != null)
                        obj.error.message = "Lỗi";
                }

                return HttpClientResult<T>.Create(response.Item1, result, response.Item3, response.Item4);
            }
            else
                return HttpClientResult<T>.Create(response.Item1, TypeExtensions.GetDefaultValue<T>(), null, false);
        }
        private static async Task<Tuple<HttpStatusCode, string, string, bool>> CallGetResponse(this HttpClient httpClient, ClientConfig clientConfig, HttpRequest request,
            HttpMethod method, string path = "/", object param = null, object data = null, CurrentProcess process = null)
        {
            if (param != null)
                path = path.AddQuery(param);
            var url = $"{clientConfig.ServiceUrl}{path}";
            var requestMessage = new HttpRequestMessage(method, url);
            string json = null;

            HttpContent content = null;

            if (data != null)
                if (data is string)
                    content = new StringContent((string)data, Encoding.UTF8, "application/json");
                else if (data is IDictionary<string, object>)
                {
                    var formData = new MultipartFormDataContent();

                    foreach (var pair in data as IDictionary<string, object>)
                        if (pair.Value is byte[])
                            formData.Add(new ByteArrayContent(pair.Value as byte[]), pair.Key, pair.Key);
                        else
                            formData.Add(new StringContent(pair.Value.ToString()), pair.Key);

                    content = formData;
                }
                else
                {
                    json = JsonConvert.SerializeObject(data, new JsonSerializerSettings
                    {
                        NullValueHandling = NullValueHandling.Ignore
                    });

                    content = new StringContent(json, Encoding.UTF8, "application/json");
                }
            var signature = string.Empty;
            var originalData = string.Empty;
            //if (method == HttpMethod.Get)
            //{
            //    var list = new List<string>();

            //    if (url.Contains("?"))
            //        foreach (var q in url.Split('?')[1].Split('&'))
            //            if (q.Contains("="))
            //                list.Add(q.Split('=')[1]);

            //    originalData = string.Join(string.Empty, list);
            //}
            //else 
            if (data != null)
                originalData = json;

            if (string.IsNullOrWhiteSpace(originalData))
                originalData = string.Empty;
            string personId = process != null ? process.Account?.PersonId : "guest";
            requestMessage.Headers.Add("X-my8-Key", clientConfig.ApiKey);
            requestMessage.Headers.Add("X-my8-PersonId", personId);
            requestMessage.Headers.Add("X-my8-ProjectId", clientConfig.ProjectId.ToString());
            requestMessage.Content = content;
            using (var response = await httpClient.SendAsync(requestMessage))
            {
                if (response.Content != null)
                {
                    var responseData = response.StatusCode == HttpStatusCode.Moved || response.StatusCode == HttpStatusCode.Found
                        ? response.Headers.Location.AbsoluteUri
                        : await response.Content.ReadAsStringAsync().ConfigureAwait(false);

                    return new Tuple<HttpStatusCode, string, string, bool>(
                        response.StatusCode,
                        responseData,
                        response.Headers?.ETag?.Tag,
                        response.StatusCode == HttpStatusCode.NotModified);
                }
                else
                    throw new Exception($"request to {url} error {response.StatusCode}");
            }
        }
        public static async Task SetNewCookieAsync(AccountViewModel account, HttpContext context)
        {
            var raw = Utils.ToBinary(account);
            //var identity = new ClaimsIdentity(context.User.Identity);
            //var avatarClaim = identity.FindFirst(key);
            //if (avatarClaim != null)
            //    identity.RemoveClaim(identity.FindFirst(key));
            //if (!string.IsNullOrWhiteSpace(account.Avatar))
            //    identity.AddClaim(new Claim(key, account.Avatar));
            //ClaimsPrincipal principal = new ClaimsPrincipal(identity);
            //var authProperties = new AuthenticationProperties
            //{
            //    IsPersistent = true
            //};
            //await context.SignInAsync(principal, authProperties);
            //context.Session.Set("current-user", raw);
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
                await Task.CompletedTask;
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
            await context.SignInAsync(principal, authProperties);
            context.Session.Set("current-user", raw);
            await Task.CompletedTask;
        }
    }
    public class HttpContentActionResult : IActionResult
    {
        private readonly HttpContent content;
        public HttpContentActionResult(HttpContent content)
        {
            this.content = content;
        }

        public async Task ExecuteResultAsync(ActionContext context)
        {
            using (var stream = await content.ReadAsStreamAsync())
            {
                context.HttpContext.Response.ContentType = content.Headers.ContentType.ToString();

                await stream.CopyToAsync(context.HttpContext.Response.Body);
            }
        }
    }
}
public class HttpClientResult<T>
{
    public static HttpClientResult<T> Create(HttpStatusCode statusCode, T data, string eTag, bool isCache)
    {
        return new HttpClientResult<T>()
        {
            StatusCode = statusCode,
            Data = data,
            ETag = eTag,
            IsCache = isCache
        };
    }

    public HttpStatusCode StatusCode { get; set; }
    public T Data { get; set; }
    public string ETag { get; set; }
    public bool IsCache { get; set; }
}
public static class TypeExtensions
{
    public static T GetDefaultValue<T>()
    {
        return (T)GetDefaultValue(typeof(T));
    }

    public static object GetDefaultValue(this Type type)
    {
        return type.GetTypeInfo().IsValueType ? Activator.CreateInstance(type) : null;
    }
}