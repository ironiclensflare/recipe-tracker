using Microsoft.AspNetCore.Mvc;
using RecipeTracker.Models;
using RecipeTracker.Services;

namespace RecipeTracker.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RecipesController : ControllerBase
{
    private readonly MongoDBService _mongoDBService;

    public RecipesController(MongoDBService mongoDBService)
    {
        _mongoDBService = mongoDBService;
    }

    [HttpGet]
    public async Task<ActionResult<List<Recipe>>> GetRecipes()
    {
        var recipes = await _mongoDBService.GetAllRecipesAsync();
        return Ok(recipes);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Recipe>> GetRecipe(string id)
    {
        var recipe = await _mongoDBService.GetRecipeAsync(id);
        if (recipe == null)
        {
            return NotFound();
        }
        return Ok(recipe);
    }

    [HttpPost]
    public async Task<ActionResult<Recipe>> CreateRecipe(Recipe recipe)
    {
        await _mongoDBService.CreateRecipeAsync(recipe);
        return CreatedAtAction(nameof(GetRecipe), new { id = recipe.Id }, recipe);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateRecipe(string id, Recipe recipe)
    {
        var existingRecipe = await _mongoDBService.GetRecipeAsync(id);
        if (existingRecipe == null)
        {
            return NotFound();
        }

        recipe.Id = id;
        await _mongoDBService.UpdateRecipeAsync(id, recipe);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteRecipe(string id)
    {
        var recipe = await _mongoDBService.GetRecipeAsync(id);
        if (recipe == null)
        {
            return NotFound();
        }

        await _mongoDBService.DeleteRecipeAsync(id);
        return NoContent();
    }
}
