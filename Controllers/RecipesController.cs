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

    [HttpGet("backup")]
    public async Task<IActionResult> BackupRecipes()
    {
        var recipes = await _mongoDBService.GetAllRecipesAsync();
        var json = System.Text.Json.JsonSerializer.Serialize(recipes, new System.Text.Json.JsonSerializerOptions 
        { 
            WriteIndented = true 
        });
        var bytes = System.Text.Encoding.UTF8.GetBytes(json);
        var timestamp = DateTime.UtcNow.ToString("yyyyMMdd_HHmmss");
        return File(bytes, "application/json", $"recipes_backup_{timestamp}.json");
    }

    [HttpPost("restore")]
    public async Task<IActionResult> RestoreRecipes(IFormFile file)
    {
        Console.WriteLine("RestoreRecipes endpoint called");
        if (file == null || file.Length == 0)
        {
            return BadRequest("No file uploaded");
        }

        if (!file.ContentType.Equals("application/json", StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest("File must be a JSON file");
        }

        Console.WriteLine($"Uploaded file: {file.FileName}, Size: {file.Length} bytes, ContentType: {file.ContentType}");

        try
        {
            using var stream = new StreamReader(file.OpenReadStream());
            var json = await stream.ReadToEndAsync();
            var recipes = System.Text.Json.JsonSerializer.Deserialize<List<Recipe>>(json);

            if (recipes == null || recipes.Count == 0)
            {
                return BadRequest("No recipes found in the backup file");
            }

            await _mongoDBService.DeleteAllRecipesAsync();
            await _mongoDBService.CreateManyRecipesAsync(recipes);

            return Ok(new { message = $"Successfully restored {recipes.Count} recipes", count = recipes.Count });
        }
        catch (System.Text.Json.JsonException)
        {
            return BadRequest("Invalid JSON format");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error restoring recipes: {ex.Message}");
        }
    }
}
