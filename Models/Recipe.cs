using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace RecipeTracker.Models;

public class Recipe
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("name")]
    public string Name { get; set; } = string.Empty;

    [BsonElement("description")]
    public string Description { get; set; } = string.Empty;

    [BsonElement("ingredients")]
    public List<Ingredient> Ingredients { get; set; } = new();

    [BsonElement("instructions")]
    public string Instructions { get; set; } = string.Empty;

    [BsonElement("prepTimeMinutes")]
    public int PrepTimeMinutes { get; set; }

    [BsonElement("cookTimeMinutes")]
    public int CookTimeMinutes { get; set; }

    [BsonElement("servings")]
    public int Servings { get; set; }
}

public class Ingredient
{
    [BsonElement("name")]
    public string Name { get; set; } = string.Empty;

    [BsonElement("quantity")]
    public string Quantity { get; set; } = string.Empty;

    [BsonElement("unit")]
    public string Unit { get; set; } = string.Empty;
}
