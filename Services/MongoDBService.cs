using MongoDB.Driver;
using RecipeTracker.Models;

namespace RecipeTracker.Services;

public class MongoDBService
{
    private readonly IMongoCollection<Recipe> _recipes;

    public MongoDBService(IConfiguration configuration)
    {
        var connectionString = configuration["MongoDB:ConnectionString"] ?? "mongodb://mongodb:27017";
        var databaseName = configuration["MongoDB:DatabaseName"] ?? "RecipeTrackerDB";
        var collectionName = configuration["MongoDB:CollectionName"] ?? "Recipes";

        var client = new MongoClient(connectionString);
        var database = client.GetDatabase(databaseName);
        _recipes = database.GetCollection<Recipe>(collectionName);
    }

    public async Task<List<Recipe>> GetAllRecipesAsync() =>
        await _recipes.Find(_ => true).ToListAsync();

    public async Task<Recipe?> GetRecipeAsync(string id) =>
        await _recipes.Find(r => r.Id == id).FirstOrDefaultAsync();

    public async Task CreateRecipeAsync(Recipe recipe) =>
        await _recipes.InsertOneAsync(recipe);

    public async Task UpdateRecipeAsync(string id, Recipe recipe) =>
        await _recipes.ReplaceOneAsync(r => r.Id == id, recipe);

    public async Task DeleteRecipeAsync(string id) =>
        await _recipes.DeleteOneAsync(r => r.Id == id);
}
