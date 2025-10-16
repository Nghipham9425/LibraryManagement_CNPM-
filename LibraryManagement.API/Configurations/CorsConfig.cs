using Microsoft.Extensions.DependencyInjection;

namespace LibraryManagement.API.Configurations
{
    public static class CorsConfig
    {
        public static IServiceCollection AddCorsConfiguration(this IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("AllowReactApp", policy =>
                {
                    policy.WithOrigins(
                            "http://localhost:5173",
                            "http://localhost:5174",
                            "http://127.0.0.1:5173",
                            "http://127.0.0.1:5174"
                        )
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                });
            });
            return services;
        }
    }
}