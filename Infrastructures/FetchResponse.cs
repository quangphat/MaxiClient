using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace MaxiClient.Infrastructures
{
    public class FetchResponse<T>
    {
        public static FetchResponse<T> Create(
            HttpStatusCode statusCode,
            T data,
            string eTag = null,
            bool isNotModified = false,
            bool isRedirect = false,
            string redirectUrl = null)
        {
            return new FetchResponse<T>()
            {
                StatusCode = statusCode,
                Data = data,
                ETag = eTag,
                IsNotModified = isNotModified,
                IsRedirect = isRedirect,
                RedirectUrl = redirectUrl
            };
        }

        public HttpStatusCode StatusCode { get; private set; }
        public T Data { get; private set; }
        public string ETag { get; private set; }
        public bool IsNotModified { get; private set; }
        public bool IsRedirect { get; private set; }
        public string RedirectUrl { get; private set; }
    }
}
