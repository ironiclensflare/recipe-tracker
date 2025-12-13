import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Recipe } from '../types';
import { recipeService } from '../services';

function RecipeList() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    try {
      const data = await recipeService.getAll();
      setRecipes(data);
    } catch (error) {
      console.error('Error loading recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) return;
    
    try {
      await recipeService.delete(id);
      setRecipes(recipes.filter(r => r.id !== id));
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };

  if (loading) {
    return <div className="text-center mt-4">Loading...</div>;
  }

  return (
    <div className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Recipe Tracker</h1>
        <Link to="/recipes/create" className="btn btn-primary">Add New Recipe</Link>
      </div>

      {recipes.length === 0 ? (
        <div className="alert alert-info">
          No recipes found. Click "Add New Recipe" to create your first recipe.
        </div>
      ) : (
        <div className="row">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">
                    <Link to={`/recipes/${recipe.id}`} className="text-decoration-none">
                    {recipe.name}
                    {recipe.youtubeUrl && (
                      <i className="bi bi-play-circle-fill text-danger ms-2" title="Video available"></i>
                    )}
                    </Link>
                  </h5>
                  <p className="card-text">{recipe.description}</p>
                  <div className="mb-2">
                    <small className="text-muted">
                      <i className="bi bi-clock"></i> Prep: {recipe.prepTimeMinutes} min | 
                      Cook: {recipe.cookTimeMinutes} min | 
                      Servings: {recipe.servings}
                    </small>
                  </div>
                  <div className="mb-2">
                    <strong>Ingredients:</strong>
                    <ul className="small">
                      {recipe.ingredients.slice(0, 3).map((ingredient, idx) => (
                        <li key={idx}>{ingredient.quantity} {ingredient.unit} {ingredient.name}</li>
                      ))}
                      {recipe.ingredients.length > 3 && (
                        <li><em>...and {recipe.ingredients.length - 3} more</em></li>
                      )}
                    </ul>
                  </div>
                </div>
                <div className="card-footer bg-transparent">
                  <Link to={`/recipes/${recipe.id}`} className="btn btn-sm btn-info">View</Link>
                  <Link to={`/recipes/edit/${recipe.id}`} className="btn btn-sm btn-warning ms-1">Edit</Link>
                  <button 
                    onClick={() => handleDelete(recipe.id!)} 
                    className="btn btn-sm btn-danger ms-1"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecipeList;
