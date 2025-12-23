import { useState, useEffect } from 'react';
import YoutubeEmbed from './YoutubeEmbed';
import { useParams, Link } from 'react-router-dom';
import { Recipe } from '../types';
import { recipeService, shortlistService } from '../services';

function RecipeDetails() {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [isShortlisted, setIsShortlisted] = useState(false);

  useEffect(() => {
    if (id) {
      loadRecipe(id);
      checkShortlistStatus(id);
    }
  }, [id]);

  const loadRecipe = async (recipeId: string) => {
    try {
      const data = await recipeService.getById(recipeId);
      setRecipe(data);
    } catch (error) {
      console.error('Error loading recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkShortlistStatus = async (recipeId: string) => {
    try {
      const ids = await shortlistService.getShortlistedIds();
      setIsShortlisted(ids.includes(recipeId));
    } catch (error) {
      console.error('Error checking shortlist status:', error);
    }
  };

  const handleToggleShortlist = async () => {
    if (!id) return;
    
    try {
      if (isShortlisted) {
        await shortlistService.removeFromShortlist(id);
        setIsShortlisted(false);
      } else {
        await shortlistService.addToShortlist(id);
        setIsShortlisted(true);
      }
    } catch (error) {
      console.error('Error toggling shortlist:', error);
    }
  };

  if (loading) {
    return <div className="text-center mt-4">Loading...</div>;
  }

  if (!recipe) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          Recipe not found
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">{recipe.name}</h1>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={handleToggleShortlist}
            className={`px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center ${
              isShortlisted 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-white text-green-600 border border-green-600 hover:bg-green-50'
            }`}
          >
            <i className={`bi ${isShortlisted ? 'bi-star-fill' : 'bi-star'} me-2`}></i>
            {isShortlisted ? 'Shortlisted' : 'Add to Shortlist'}
          </button>
          <Link 
            to={`/recipes/edit/${recipe.id}`} 
            className="bg-amber-500 hover:bg-amber-600 text-white font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Edit
          </Link>
          <Link 
            to="/" 
            className="bg-gray-600 hover:bg-gray-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Back to List
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md mb-8">
        <div className="p-6 sm:p-8">
          <p className="text-lg text-gray-700 mb-6">{recipe.description}</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
            <div>
              <strong className="text-gray-900">Prep Time:</strong>
              <span className="text-gray-700 ml-2">{recipe.prepTimeMinutes} minutes</span>
            </div>
            <div>
              <strong className="text-gray-900">Cook Time:</strong>
              <span className="text-gray-700 ml-2">{recipe.cookTimeMinutes} minutes</span>
            </div>
            <div>
              <strong className="text-gray-900">Servings:</strong>
              <span className="text-gray-700 ml-2">{recipe.servings}</span>
            </div>
          </div>

          <h3 className="text-2xl font-semibold text-gray-900 mb-4">Ingredients</h3>
          <ul className="list-disc list-inside space-y-2 mb-8 text-gray-700">
            {recipe.ingredients.map((ingredient, idx) => (
              <li key={idx}>
                {ingredient.quantity} {ingredient.unit} {ingredient.name}
              </li>
            ))}
          </ul>

          <h3 className="text-2xl font-semibold text-gray-900 mb-4">Instructions</h3>
          <p className="whitespace-pre-wrap text-gray-700 mb-8">{recipe.instructions}</p>

          {recipe.youtubeUrl && (
            <>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Video</h3>
              <YoutubeEmbed url={recipe.youtubeUrl} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecipeDetails;
