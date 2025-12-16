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
    return <div className="alert alert-danger mt-4">Recipe not found</div>;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>{recipe.name}</h1>
        <div>
          <button 
            onClick={handleToggleShortlist}
            className={`btn ${isShortlisted ? 'btn-success' : 'btn-outline-success'}`}
          >
            <i className={`bi ${isShortlisted ? 'bi-star-fill' : 'bi-star'}`}></i>
            {isShortlisted ? ' Shortlisted' : ' Add to Shortlist'}
          </button>
          <Link to={`/recipes/edit/${recipe.id}`} className="btn btn-warning ms-2">Edit</Link>
          <Link to="/" className="btn btn-secondary ms-2">Back to List</Link>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <p className="lead">{recipe.description}</p>
          
          <div className="row mb-3">
            <div className="col-md-4">
              <strong>Prep Time:</strong> {recipe.prepTimeMinutes} minutes
            </div>
            <div className="col-md-4">
              <strong>Cook Time:</strong> {recipe.cookTimeMinutes} minutes
            </div>
            <div className="col-md-4">
              <strong>Servings:</strong> {recipe.servings}
            </div>
          </div>

          <h3>Ingredients</h3>
          <ul>
            {recipe.ingredients.map((ingredient, idx) => (
              <li key={idx}>
                {ingredient.quantity} {ingredient.unit} {ingredient.name}
              </li>
            ))}
          </ul>

          <h3>Instructions</h3>
          <p style={{ whiteSpace: 'pre-wrap' }}>{recipe.instructions}</p>

          {recipe.youtubeUrl && (
            <>
              <h3>Video</h3>
              <YoutubeEmbed url={recipe.youtubeUrl} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecipeDetails;
