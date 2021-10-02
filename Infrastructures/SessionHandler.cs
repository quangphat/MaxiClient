using Microsoft.AspNetCore.Http;
using my8ProgramingBlogClient.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace my8ProgramingBlogClient.Infrastructures
{
    public class SessionHandler
    {
        private readonly RequestDelegate _next;
        internal const string SESSION_KEY = "current-user";
        public SessionHandler(RequestDelegate next)
        {
            _next = next;
        }
        public async Task Invoke(HttpContext httpContext, CurrentProcess process)
        {
            var raw = httpContext.Session.Get(SESSION_KEY);
            if (raw == null)
            {
                var user = httpContext.GetUserInfo();
                if (user == null)
                {
                    await _next(httpContext);
                    return;
                }
                raw = Utils.ToBinary(user);
                httpContext.Session.Set(SESSION_KEY, raw);
            }
            var account = Utils.FromBinary(raw);
            process.Account = account;
            await _next(httpContext);
        }
    }
}
