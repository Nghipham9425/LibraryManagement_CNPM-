using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using System;
using LibraryManagement.API.Utils;

namespace LibraryManagement.API.Middlewares
{
    public class ErrorHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IHostEnvironment _env;

        public ErrorHandlingMiddleware(RequestDelegate next, IHostEnvironment env)
        {
            _next = next;
            _env = env;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                var statusCode = (ex is ApiException apiEx) ? apiEx.StatusCode : (int)HttpStatusCode.InternalServerError;
                var response = new
                {
                    statusCode,
                    message = ex.Message,
                    errors = (ex is ApiException apiEx2) ? apiEx2.Errors : null,
                    stack = _env.IsDevelopment() ? ex.StackTrace : null
                };
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = statusCode;
                await context.Response.WriteAsync(JsonSerializer.Serialize(response));
            }
        }
    }
}
