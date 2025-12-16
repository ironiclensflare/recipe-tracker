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
      <div className="mt-4">
        <h1>Shopping List</h1>
        <div className="alert alert-info mt-4">
          No recipes in your shortlist. Add recipes to your shortlist to create a shopping list.
        </div>
        <Link to="/" className="btn btn-primary">Go to Recipes</Link>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Shopping List</h1>
        <div>
          <button 
            onClick={handleClearShortlist}
            className="btn btn-danger"
            title="Clear shopping list"
          >
            <i className="bi bi-trash"></i>
          </button>
          <Link to="/" className="btn btn-secondary ms-2">Back to Recipes</Link>
        </div>
      </div>

      {recipeNames.map((recipeName) => (
        <div key={recipeName} className="card mb-3">
          <div className="card-header">
            <h5 className="mb-0">{recipeName}</h5>
          </div>
          <div className="card-body">
            <ul className="list-unstyled mb-0">
              {shoppingList[recipeName].map((ingredient, idx) => {
                const itemKey = `${recipeName}-${idx}`;
                const isChecked = checkedItems.has(itemKey);
                return (
                  <li 
                    key={idx} 
                    className="mb-1"
                    onClick={() => toggleIngredient(recipeName, idx)}
                    style={{ 
                      cursor: 'pointer',
                      textDecoration: isChecked ? 'line-through' : 'none',
                      color: isChecked ? '#6c757d' : 'inherit',
                      userSelect: 'none'
                    }}
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
