FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["RecipeTracker.csproj", "./"]
RUN dotnet restore "RecipeTracker.csproj"
COPY . .
RUN dotnet build "RecipeTracker.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "RecipeTracker.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "RecipeTracker.dll"]
