FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /src
COPY ["src/Huong.Web.Host/Huong.Web.Host.csproj", "src/Huong.Web.Host/"]
COPY ["src/Huong.Web.Core/Huong.Web.Core.csproj", "src/Huong.Web.Core/"]
COPY ["src/Huong.Application/Huong.Application.csproj", "src/Huong.Application/"]
COPY ["src/Huong.Core/Huong.Core.csproj", "src/Huong.Core/"]
COPY ["src/Huong.EntityFrameworkCore/Huong.EntityFrameworkCore.csproj", "src/Huong.EntityFrameworkCore/"]
WORKDIR "/src/src/Huong.Web.Host"
RUN dotnet restore 

WORKDIR /src
COPY ["src/Huong.Web.Host", "src/Huong.Web.Host"]
COPY ["src/Huong.Web.Core", "src/Huong.Web.Core"]
COPY ["src/Huong.Application", "src/Huong.Application"]
COPY ["src/Huong.Core", "src/Huong.Core"]
COPY ["src/Huong.EntityFrameworkCore", "src/Huong.EntityFrameworkCore"]
WORKDIR "/src/src/Huong.Web.Host"
RUN dotnet publish -c Release -o /publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0
EXPOSE 80
WORKDIR /app
COPY --from=build /publish .
ENTRYPOINT ["dotnet", "Huong.Web.Host.dll"]
