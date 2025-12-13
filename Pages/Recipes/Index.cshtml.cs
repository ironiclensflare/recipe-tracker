using Microsoft.AspNetCore.Mvc.RazorPages;
using RecipeTracker.Models;
using RecipeTracker.Services;

namespace RecipeTracker.Pages.Recipes;

public class IndexModel : PageModel
{
    private readonly MongoDBService _mongoDBService;

    public IndexModel(MongoDBService mongoDBService)
    {
        _mongoDBService = mongoDBService;
    }

    public List<Recipe> Recipes { get; set; } = new();

    public async Task OnGetAsync()
    {
        Recipes = await _mongoDBService.GetAllRecipesAsync();
    }
}
