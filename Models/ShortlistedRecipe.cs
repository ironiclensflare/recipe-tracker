using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace RecipeTracker.Models;

public class ShortlistedRecipe
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("recipeId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string RecipeId { get; set; } = string.Empty;

    [BsonElement("addedAt")]
    public DateTime AddedAt { get; set; } = DateTime.UtcNow;
}
