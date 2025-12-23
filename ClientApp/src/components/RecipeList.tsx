import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Recipe } from '../types';
import { recipeService, shortlistService } from '../services';

function RecipeList() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [shortlistedIds, setShortlistedIds] = useState<Set<string>>(new Set());

  const getYoutubeVideoId = (url: string): string | null => {
    if (!url) return null;
    try {
      const urlObj = new URL(url);
      const videoId = urlObj.searchParams.get('v');
      if (videoId) {
        return videoId;
      } else if (url.includes('youtu.be/')) {
        return url.split('youtu.be/')[1].split('?')[0];
      }
    } catch (e) {
      console.error('Error parsing URL:', e);
    }
    return null;
  };

  useEffect(() => {
    loadRecipes();
    loadShortlist();
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

  const loadShortlist = async () => {
    try {
      const ids = await shortlistService.getShortlistedIds();
      setShortlistedIds(new Set(ids));
    } catch (error) {
      console.error('Error loading shortlist:', error);
    }
  };

  const handleToggleShortlist = async (recipeId: string) => {
    try {
      if (shortlistedIds.has(recipeId)) {
        await shortlistService.removeFromShortlist(recipeId);
        setShortlistedIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(recipeId);
          return newSet;
        });
      } else {
        await shortlistService.addToShortlist(recipeId);
        setShortlistedIds(prev => new Set(prev).add(recipeId));
      }
    } catch (error) {
      console.error('Error toggling shortlist:', error);
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
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Recipe Tracker</h1>
        <Link 
          to="/recipes/create" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
        >
          Add New Recipe
        </Link>
      </div>

      {recipes.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg">
          No recipes found. Click "Add New Recipe" to create your first recipe.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col h-full">
              <div className="p-6 flex-grow">
                <h5 className="text-xl font-semibold mb-2">
                  <Link to={`/recipes/${recipe.id}`} className="text-gray-900 hover:text-blue-600 transition-colors">
                    {recipe.name}
                    {recipe.youtubeUrl && (
                      <i className="bi bi-play-circle-fill text-red-600 ms-2" title="Video available"></i>
                    )}
                  </Link>
                </h5>
                <p className="text-gray-600 mb-4">{recipe.description}</p>
                <div className="mb-4">
                  <small className="text-gray-500 text-sm">
                    <i className="bi bi-clock"></i> Prep: {recipe.prepTimeMinutes} min | 
                    Cook: {recipe.cookTimeMinutes} min | 
                    Servings: {recipe.servings}
                  </small>
                </div>
                <div className="mb-4">
                  <strong className="text-gray-900">Ingredients:</strong>
                  <ul className="text-sm text-gray-700 list-disc list-inside mt-1">
                    {recipe.ingredients.slice(0, 3).map((ingredient, idx) => (
                      <li key={idx}>{ingredient.quantity} {ingredient.unit} {ingredient.name}</li>
                    ))}
                    {recipe.ingredients.length > 3 && (
                      <li className="italic text-gray-500">...and {recipe.ingredients.length - 3} more</li>
                    )}
                  </ul>
                </div>
                {recipe.youtubeUrl && getYoutubeVideoId(recipe.youtubeUrl) && (
                  <div className="mb-4">
                    <img 
                      src={`https://img.youtube.com/vi/${getYoutubeVideoId(recipe.youtubeUrl)}/mqdefault.jpg`}
                      alt="Video thumbnail"
                      className="w-full rounded-lg"
                    />
                  </div>
                )}
              </div>
              <div className="border-t border-gray-200 px-6 py-4 flex gap-2">
                <button 
                  onClick={() => handleToggleShortlist(recipe.id!)}
                  className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                    shortlistedIds.has(recipe.id!) 
                      ? 'bg-green-600 text-white hover:bg-green-700' 
                      : 'bg-white text-green-600 border border-green-600 hover:bg-green-50'
                  }`}
                  title={shortlistedIds.has(recipe.id!) ? 'Remove from shortlist' : 'Add to shortlist'}
                >
                  <i className={`bi ${shortlistedIds.has(recipe.id!) ? 'bi-star-fill' : 'bi-star'}`}></i>
                </button>
                <Link 
                  to={`/recipes/${recipe.id}`} 
                  className="px-3 py-1.5 text-sm font-medium rounded bg-cyan-500 text-white hover:bg-cyan-600 transition-colors"
                >
                  View
                </Link>
                <Link 
                  to={`/recipes/edit/${recipe.id}`} 
                  className="px-3 py-1.5 text-sm font-medium rounded bg-amber-500 text-white hover:bg-amber-600 transition-colors"
                >
                  Edit
                </Link>
                <button 
                  onClick={() => handleDelete(recipe.id!)} 
                  className="px-3 py-1.5 text-sm font-medium rounded bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecipeList;
