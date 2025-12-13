using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using RecipeTracker.Models;
using RecipeTracker.Services;

namespace RecipeTracker.Pages.Recipes;

public class EditModel : PageModel
{
    private readonly MongoDBService _mongoDBService;

    public EditModel(MongoDBService mongoDBService)
    {
        _mongoDBService = mongoDBService;
    }

    [BindProperty]
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

    public async Task<IActionResult> OnPostAsync(List<string> IngredientNames, List<string> IngredientQuantities, List<string> IngredientUnits)
    {
        Recipe.Ingredients = new List<Ingredient>();
        
        for (int i = 0; i < IngredientNames.Count; i++)
        {
            if (!string.IsNullOrWhiteSpace(IngredientNames[i]))
            {
                Recipe.Ingredients.Add(new Ingredient
                {
                    Name = IngredientNames[i],
                    Quantity = i < IngredientQuantities.Count ? IngredientQuantities[i] : "",
                    Unit = i < IngredientUnits.Count ? IngredientUnits[i] : ""
                });
            }
        }

        await _mongoDBService.UpdateRecipeAsync(Recipe.Id!, Recipe);
        return RedirectToPage("Index");
    }
}
