import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Recipe, Ingredient } from '../types';
import { recipeService } from '../services';

function RecipeForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;
  const ingredientNameRefs = useRef<(HTMLInputElement | null)[]>([]);

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

  const handleUnitBlur = (index: number) => {
    // Only add a new ingredient if this is the last one
    if (index === recipe.ingredients.length - 1) {
      const newIngredients = [...recipe.ingredients, { name: '', quantity: '', unit: '' }];
      setRecipe({ ...recipe, ingredients: newIngredients });
      
      // Focus the new ingredient name field after state updates
      setTimeout(() => {
        ingredientNameRefs.current[index + 1]?.focus();
      }, 0);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">{isEdit ? 'Edit Recipe' : 'Create New Recipe'}</h1>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 sm:p-8">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
          <input
            type="text"
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={recipe.name}
            onChange={(e) => setRecipe({ ...recipe, name: e.target.value })}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            rows={3}
            value={recipe.description}
            onChange={(e) => setRecipe({ ...recipe, description: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Prep Time (minutes)</label>
            <input
              type="number"
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              min="0"
              value={recipe.prepTimeMinutes}
              onChange={(e) => setRecipe({ ...recipe, prepTimeMinutes: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cook Time (minutes)</label>
            <input
              type="number"
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              min="0"
              value={recipe.cookTimeMinutes}
              onChange={(e) => setRecipe({ ...recipe, cookTimeMinutes: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Servings</label>
            <input
              type="number"
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              min="1"
              value={recipe.servings}
              onChange={(e) => setRecipe({ ...recipe, servings: parseInt(e.target.value) || 1 })}
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Ingredients</label>
          {recipe.ingredients.map((ingredient, index) => (
            <div key={index} className="mb-3">
              <div className="flex gap-2">
                <div className="flex-grow">
                  <input
                    type="text"
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Ingredient name"
                    value={ingredient.name}
                    onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                    ref={(el) => (ingredientNameRefs.current[index] = el)}
                    required
                  />
                </div>
                <div className="w-28">
                  <input
                    type="text"
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Quantity"
                    value={ingredient.quantity}
                    onChange={(e) => updateIngredient(index, 'quantity', e.target.value)}
                    required
                  />
                </div>
                <div className="w-28">
                  <input
                    type="text"
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Unit"
                    value={ingredient.unit}
                    onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                    onBlur={() => handleUnitBlur(index)}
                  />
                </div>
                <div>
                  <button
                    type="button"
                    className="h-full px-3 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors font-medium text-lg leading-none"
                    onClick={() => removeIngredient(index)}
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          ))}
          <button type="button" className="bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium px-3 py-2 rounded-lg transition-colors" onClick={addIngredient}>
            Add Ingredient
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Instructions</label>
          <textarea
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            rows={6}
            value={recipe.instructions}
            onChange={(e) => setRecipe({ ...recipe, instructions: e.target.value })}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">YouTube Video URL (optional)</label>
          <input
            type="url"
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="https://www.youtube.com/watch?v=..."
            value={recipe.youtubeUrl || ''}
            onChange={(e) => setRecipe({ ...recipe, youtubeUrl: e.target.value })}
          />
        </div>

        <div className="flex gap-2">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors">
            {isEdit ? 'Save Changes' : 'Create Recipe'}
          </button>
          <button type="button" className="bg-gray-600 hover:bg-gray-700 text-white font-medium px-6 py-2 rounded-lg transition-colors" onClick={() => navigate('/')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default RecipeForm;
