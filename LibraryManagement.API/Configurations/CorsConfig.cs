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
                            "http://localhost:5173",           // Development
                            "http://localhost:5175",           // Development  
                            "https://library-management-cnpm.vercel.app",  // Production
                            "https://library-management-*.vercel.app"      // Preview deployments
                        )
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials();
                });
            });
            return services;
        }
    }
}