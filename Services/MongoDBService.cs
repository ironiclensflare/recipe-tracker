using MongoDB.Driver;
using RecipeTracker.Models;

namespace RecipeTracker.Services;

public class MongoDBService
{
    private readonly IMongoCollection<Recipe> _recipes;
    private readonly IMongoCollection<ShortlistedRecipe> _shortlistedRecipes;

    public MongoDBService(IConfiguration configuration)
    {
        var connectionString = configuration["MongoDB:ConnectionString"] ?? "mongodb://mongodb:27017";
        var databaseName = configuration["MongoDB:DatabaseName"] ?? "RecipeTrackerDB";
        var collectionName = configuration["MongoDB:CollectionName"] ?? "Recipes";

        var client = new MongoClient(connectionString);
        var database = client.GetDatabase(databaseName);
        _recipes = database.GetCollection<Recipe>(collectionName);
        _shortlistedRecipes = database.GetCollection<ShortlistedRecipe>("ShortlistedRecipes");
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

    public async Task DeleteAllRecipesAsync() =>
        await _recipes.DeleteManyAsync(_ => true);

    public async Task CreateManyRecipesAsync(List<Recipe> recipes) =>
        await _recipes.InsertManyAsync(recipes);

    // Shortlist methods
    public async Task<List<ShortlistedRecipe>> GetAllShortlistedRecipesAsync() =>
        await _shortlistedRecipes.Find(_ => true).ToListAsync();

    public async Task<ShortlistedRecipe?> GetShortlistedRecipeByRecipeIdAsync(string recipeId) =>
        await _shortlistedRecipes.Find(s => s.RecipeId == recipeId).FirstOrDefaultAsync();

    public async Task AddToShortlistAsync(string recipeId)
    {
        var existing = await GetShortlistedRecipeByRecipeIdAsync(recipeId);
        if (existing == null)
        {
            var shortlistedRecipe = new ShortlistedRecipe { RecipeId = recipeId };
            await _shortlistedRecipes.InsertOneAsync(shortlistedRecipe);
        }
    }

    public async Task RemoveFromShortlistAsync(string recipeId) =>
        await _shortlistedRecipes.DeleteOneAsync(s => s.RecipeId == recipeId);
}
