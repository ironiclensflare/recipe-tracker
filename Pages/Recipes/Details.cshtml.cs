using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using RecipeTracker.Models;
using RecipeTracker.Services;

namespace RecipeTracker.Pages.Recipes;

public class DetailsModel : PageModel
{
    private readonly MongoDBService _mongoDBService;

    public DetailsModel(MongoDBService mongoDBService)
    {
        _mongoDBService = mongoDBService;
    }

    public Recipe Recipe { get; set; } = new();

    public async Task<IActionResult> OnGetAsync(string id)
    {
        var recipe = await _mongoDBService.GetRecipeAsync(id);
        if (recipe == null)
        {
            return NotFound();
        }

        Recipe = recipe;
        return Page();
    }
}
