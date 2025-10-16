using System;
using System.Collections.Generic;

namespace LibraryManagement.API.Utils
{
    public class ApiException : Exception
    {
        public int StatusCode { get; }
        public IEnumerable<string>? Errors { get; }

        public ApiException(int statusCode, string message, IEnumerable<string>? errors = null)
            : base(message)
        {
            StatusCode = statusCode;
            Errors = errors;
        }
    }
}
