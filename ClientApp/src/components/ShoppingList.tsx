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
        <Link to="/" className="btn btn-secondary">Back to Recipes</Link>
      </div>

      <div className="alert alert-info">
        Combined ingredients from {recipeNames.length} shortlisted recipe{recipeNames.length !== 1 ? 's' : ''}
      </div>

      {recipeNames.map((recipeName) => (
        <div key={recipeName} className="card mb-3">
          <div className="card-header">
            <h5 className="mb-0">{recipeName}</h5>
          </div>
          <div className="card-body">
            <ul className="list-unstyled mb-0">
              {shoppingList[recipeName].map((ingredient, idx) => (
                <li key={idx} className="mb-1">
                  <i className="bi bi-check-square me-2"></i>
                  {ingredient.quantity} {ingredient.unit} {ingredient.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ShoppingList;
