# Use the official .NET SDK image to build the project
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY *.csproj .
RUN dotnet restore

# Copy the rest of the source code
COPY . .
RUN dotnet publish -c Release -o /app

# Build the runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app .

# Configure the container to listen on all interfaces
ENV ASPNETCORE_URLS=http://+:42069

# Expose the port the app runs on
EXPOSE 42069

# Start the application
ENTRYPOINT ["dotnet", "server.dll"] 