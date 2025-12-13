using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using RecipeTracker.Models;
using RecipeTracker.Services;

namespace RecipeTracker.Pages.Recipes;

public class CreateModel : PageModel
{
    private readonly MongoDBService _mongoDBService;

    public CreateModel(MongoDBService mongoDBService)
    {
        _mongoDBService = mongoDBService;
    }

    [BindProperty]
    public Recipe Recipe { get; set; } = new();

    public void OnGet()
    {
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

        await _mongoDBService.CreateRecipeAsync(Recipe);
        return RedirectToPage("Index");
    }
}
