# Use the official .NET 8 SDK image to build the app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj file and restore dependencies
COPY ["LibraryManagement.API/LibraryManagement.API.csproj", "."]
RUN dotnet restore "LibraryManagement.API.csproj"

# Copy everything else and build
COPY . .
RUN dotnet build "LibraryManagement.API/LibraryManagement.API.csproj" -c Release -o /app/build

# Publish the app
FROM build AS publish
RUN dotnet publish "LibraryManagement.API/LibraryManagement.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Use the official .NET 8 runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Expose port 80
EXPOSE 80

# Set the entry point
ENTRYPOINT ["dotnet", "LibraryManagement.API.dll"]