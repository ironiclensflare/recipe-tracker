import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Recipe, Ingredient } from '../types';
import { recipeService } from '../services';

function RecipeForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [recipe, setRecipe] = useState<Recipe>({
    name: '',
    description: '',
    ingredients: [{ name: '', quantity: '', unit: '' }],
    instructions: '',
    prepTimeMinutes: 0,
    cookTimeMinutes: 0,
    servings: 1,
    youtubeUrl: '',
  });

  useEffect(() => {
    if (id) {
      loadRecipe(id);
    }
  }, [id]);

  const loadRecipe = async (recipeId: string) => {
    try {
      const data = await recipeService.getById(recipeId);
      setRecipe(data);
    } catch (error) {
      console.error('Error loading recipe:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEdit && id) {
        await recipeService.update(id, recipe);
      } else {
        await recipeService.create(recipe);
      }
      navigate('/');
    } catch (error) {
      console.error('Error saving recipe:', error);
    }
  };

  const addIngredient = () => {
    setRecipe({
      ...recipe,
      ingredients: [...recipe.ingredients, { name: '', quantity: '', unit: '' }],
    });
  };

  const removeIngredient = (index: number) => {
    if (recipe.ingredients.length > 1) {
      setRecipe({
        ...recipe,
        ingredients: recipe.ingredients.filter((_, i) => i !== index),
      });
    }
  };

  const updateIngredient = (index: number, field: keyof Ingredient, value: string) => {
    const newIngredients = [...recipe.ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setRecipe({ ...recipe, ingredients: newIngredients });
  };

  return (
    <div className="container mt-4">
      <h1>{isEdit ? 'Edit Recipe' : 'Create New Recipe'}</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            value={recipe.name}
            onChange={(e) => setRecipe({ ...recipe, name: e.target.value })}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            rows={3}
            value={recipe.description}
            onChange={(e) => setRecipe({ ...recipe, description: e.target.value })}
          />
        </div>

        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label">Prep Time (minutes)</label>
            <input
              type="number"
              className="form-control"
              min="0"
              value={recipe.prepTimeMinutes}
              onChange={(e) => setRecipe({ ...recipe, prepTimeMinutes: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Cook Time (minutes)</label>
            <input
              type="number"
              className="form-control"
              min="0"
              value={recipe.cookTimeMinutes}
              onChange={(e) => setRecipe({ ...recipe, cookTimeMinutes: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Servings</label>
            <input
              type="number"
              className="form-control"
              min="1"
              value={recipe.servings}
              onChange={(e) => setRecipe({ ...recipe, servings: parseInt(e.target.value) || 1 })}
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Ingredients</label>
          {recipe.ingredients.map((ingredient, index) => (
            <div key={index} className="ingredient-item mb-2">
              <div className="row">
                <div className="col-md-5">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ingredient name"
                    value={ingredient.name}
                    onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Quantity"
                    value={ingredient.quantity}
                    onChange={(e) => updateIngredient(index, 'quantity', e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Unit"
                    value={ingredient.unit}
                    onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                  />
                </div>
                <div className="col-md-1">
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => removeIngredient(index)}
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          ))}
          <button type="button" className="btn btn-sm btn-secondary mt-2" onClick={addIngredient}>
            Add Ingredient
          </button>
        </div>

        <div className="mb-3">
          <label className="form-label">Instructions</label>
          <textarea
            className="form-control"
            rows={6}
            value={recipe.instructions}
            onChange={(e) => setRecipe({ ...recipe, instructions: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">YouTube Video URL (optional)</label>
          <input
            type="url"
            className="form-control"
            placeholder="https://www.youtube.com/watch?v=..."
            value={recipe.youtubeUrl || ''}
            onChange={(e) => setRecipe({ ...recipe, youtubeUrl: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <button type="submit" className="btn btn-primary">
            {isEdit ? 'Save Changes' : 'Create Recipe'}
          </button>
          <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default RecipeForm;
