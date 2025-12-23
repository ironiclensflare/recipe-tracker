import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { shortlistService } from '../services';

interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
}

function ShoppingList() {
  const [shoppingList, setShoppingList] = useState<Record<string, Ingredient[]>>({});
  const [loading, setLoading] = useState(true);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadShoppingList();
  }, []);

  const loadShoppingList = async () => {
    try {
      const data = await shortlistService.getShoppingList();
      setShoppingList(data);
    } catch (error) {
      console.error('Error loading shopping list:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearShortlist = async () => {
    if (!window.confirm('Are you sure you want to clear the entire shopping list?')) return;
    
    try {
      const recipes = await shortlistService.getShortlistedRecipes();
      for (const recipe of recipes) {
        if (recipe.id) {
          await shortlistService.removeFromShortlist(recipe.id);
        }
      }
      setShoppingList({});
      setCheckedItems(new Set());
    } catch (error) {
      console.error('Error clearing shortlist:', error);
    }
  };

  const toggleIngredient = (recipeName: string, index: number) => {
    const key = `${recipeName}-${index}`;
    setCheckedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  if (loading) {
    return <div className="text-center mt-4">Loading...</div>;
  }

  const recipeNames = Object.keys(shoppingList);

  if (recipeNames.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">Shopping List</h1>
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg mb-4">
          No recipes in your shortlist. Add recipes to your shortlist to create a shopping list.
        </div>
        <Link 
          to="/" 
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
        >
          Go to Recipes
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Shopping List</h1>
        <div className="flex gap-2">
          <button 
            onClick={handleClearShortlist}
            className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
            title="Clear shopping list"
          >
            <i className="bi bi-trash"></i>
          </button>
          <Link 
            to="/" 
            className="bg-gray-600 hover:bg-gray-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Back to Recipes
          </Link>
        </div>
      </div>

      {recipeNames.map((recipeName) => (
        <div key={recipeName} className="bg-white rounded-lg shadow-md mb-4 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h5 className="text-lg font-semibold text-gray-900">{recipeName}</h5>
          </div>
          <div className="p-6">
            <ul className="space-y-2">
              {shoppingList[recipeName].map((ingredient, idx) => {
                const itemKey = `${recipeName}-${idx}`;
                const isChecked = checkedItems.has(itemKey);
                return (
                  <li 
                    key={idx} 
                    className={`cursor-pointer select-none transition-colors py-1 px-2 rounded hover:bg-gray-50 ${
                      isChecked ? 'line-through text-gray-400' : 'text-gray-700'
                    }`}
                    onClick={() => toggleIngredient(recipeName, idx)}
                  >
                    {ingredient.quantity} {ingredient.unit} {ingredient.name}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ShoppingList;
