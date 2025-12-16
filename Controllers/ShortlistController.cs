using Microsoft.AspNetCore.Mvc;
using RecipeTracker.Models;
using RecipeTracker.Services;

namespace RecipeTracker.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ShortlistController : ControllerBase
{
    private readonly MongoDBService _mongoDBService;

    public ShortlistController(MongoDBService mongoDBService)
    {
        _mongoDBService = mongoDBService;
    }

    [HttpGet("ids")]
    public async Task<ActionResult<List<string>>> GetShortlistedRecipeIds()
    {
        var shortlisted = await _mongoDBService.GetAllShortlistedRecipesAsync();
        var recipeIds = shortlisted.Select(s => s.RecipeId).ToList();
        return Ok(recipeIds);
    }

    [HttpGet("recipes")]
    public async Task<ActionResult<List<Recipe>>> GetShortlistedRecipes()
    {
        var shortlisted = await _mongoDBService.GetAllShortlistedRecipesAsync();
        var recipes = new List<Recipe>();
        
        foreach (var item in shortlisted)
        {
            var recipe = await _mongoDBService.GetRecipeAsync(item.RecipeId);
            if (recipe != null)
            {
                recipes.Add(recipe);
            }
        }
        
        return Ok(recipes);
    }

    [HttpPost("add/{recipeId}")]
    public async Task<IActionResult> AddToShortlist(string recipeId)
    {
        var recipe = await _mongoDBService.GetRecipeAsync(recipeId);
        if (recipe == null)
        {
            return NotFound("Recipe not found");
        }

        await _mongoDBService.AddToShortlistAsync(recipeId);
        return Ok();
    }

    [HttpDelete("remove/{recipeId}")]
    public async Task<IActionResult> RemoveFromShortlist(string recipeId)
    {
        await _mongoDBService.RemoveFromShortlistAsync(recipeId);
        return NoContent();
    }

    [HttpGet("shopping-list")]
    public async Task<ActionResult<Dictionary<string, List<Ingredient>>>> GetShoppingList()
    {
        var shortlisted = await _mongoDBService.GetAllShortlistedRecipesAsync();
        var ingredientsByRecipe = new Dictionary<string, List<Ingredient>>();
        
        foreach (var item in shortlisted)
        {
            var recipe = await _mongoDBService.GetRecipeAsync(item.RecipeId);
            if (recipe != null)
            {
                ingredientsByRecipe[recipe.Name] = recipe.Ingredients;
            }
        }
        
        return Ok(ingredientsByRecipe);
    }
}
