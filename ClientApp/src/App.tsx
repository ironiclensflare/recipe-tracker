import { Routes, Route, Link } from 'react-router-dom';
import RecipeList from './components/RecipeList';
import RecipeDetails from './components/RecipeDetails';
import RecipeForm from './components/RecipeForm';
import ShoppingList from './components/ShoppingList';

function App() {
  return (
    <div>
      <nav className="navbar navbar-expand-sm navbar-light bg-white border-bottom box-shadow mb-3">
        <div className="container">
          <Link className="navbar-brand" to="/">RecipeTracker</Link>
          <div className="navbar-collapse">
            <ul className="navbar-nav flex-grow-1">
              <li className="nav-item">
                <Link className="nav-link text-dark" to="/">Recipes</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-dark" to="/shopping-list">Shopping List</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      
      <div className="container">
        <main role="main" className="pb-3">
          <Routes>
            <Route path="/" element={<RecipeList />} />
            <Route path="/recipes/create" element={<RecipeForm />} />
            <Route path="/recipes/edit/:id" element={<RecipeForm />} />
            <Route path="/recipes/:id" element={<RecipeDetails />} />
            <Route path="/shopping-list" element={<ShoppingList />} />
          </Routes>
        </main>
      </div>
      
      <footer className="border-top footer text-muted mt-4">
        <div className="container py-3">
          &copy; 2025 - RecipeTracker
        </div>
      </footer>
    </div>
  );
}

export default App;
