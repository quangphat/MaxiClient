using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace MaxiClient.Infrastructures
{
    public class ProxyMiddleware
    {
        private readonly RequestDelegate next;

        public ProxyMiddleware(RequestDelegate next)
        {
            this.next = next;
        }

        private const string SERVICE_WEB_TYPE = "web";
        private const string SERVICE_API_TYPE = "api";

        public async Task Invoke(
            HttpContext httpContext,
            HttpClient httpClient,
            IOptions<ServiceApi> serviceUrlsConfig,
            ILogger<ProxyMiddleware> log)
        {
            if (httpContext.Request.Path.HasValue)
            {
                var path = httpContext.Request.Path.Value;

                if (path.StartsWith("/"))
                    path = path.Substring(1);

                var segments = path.Split('/');

                if (segments.Length>=2 && segments[0].ToLower()=="api")
                {

                    var serviceUrl = serviceUrlsConfig.Value.MaxiApiUrl;


                    if (!string.IsNullOrEmpty(serviceUrl))
                    {

                        var serviceResponse = await this.ProxyCall(
                            httpContext,
                            httpClient,
                            serviceUrl,
                            segments,
                            httpContext.Request.QueryString,
                            log);

                        httpContext.Response.ContentType = "application/json";

                        var responseData = serviceResponse.Data;

                        httpContext.SetStatusCode(serviceResponse.StatusCode);

                        await httpContext.Response.WriteAsync(responseData, Encoding.UTF8);

                        return;
                    }
                }

            }

            await this.next(httpContext);
        }

        private async Task<FetchResponse<string>> ProxyCall(
            HttpContext httpContext,
            HttpClient httpClient,
            string serviceUrl,
            string[] segments,
            QueryString queryString,
            ILogger<ProxyMiddleware> log)
        {
            var apiUrl = serviceUrl;

            for (var i = 0; i < segments.Length; i++)
                apiUrl += "/" + segments[i];

            if (queryString != null)
                apiUrl += queryString.Value;

            httpContext.Request.EnableBuffering();

            string rawBody = null;

            using (var reader = new StreamReader(httpContext.Request.Body))
            {
                reader.BaseStream.Seek(0, SeekOrigin.Begin);
                rawBody = await reader.ReadToEndAsync();
            }

            if (rawBody == string.Empty)
                rawBody = "{}";

            var headers = new Dictionary<string, string>();

            return await httpClient.Execute<string>(
                new HttpMethod(httpContext.Request.Method),
                apiUrl,
                rawBody,
                headers: headers,
                isCatchRedirect: true);
        }
    }
    public static class HttpContextExtensions
    {
        public static void SetStatusCode(this HttpContext httpContext, HttpStatusCode statusCode)
        {
            httpContext.Response.StatusCode = (int)statusCode;
        }

        public static void SetRedirect(this HttpContext httpContext, string url)
        {
            httpContext.Response.Redirect(url, true);
        }
    }
}
