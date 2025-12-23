import { Routes, Route, Link } from 'react-router-dom';
import RecipeList from './components/RecipeList';
import RecipeDetails from './components/RecipeDetails';
import RecipeForm from './components/RecipeForm';
import ShoppingList from './components/ShoppingList';
import Backup from './components/Backup';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link className="text-xl font-bold text-gray-900" to="/">RecipeTracker</Link>
            <ul className="flex space-x-8">
              <li>
                <Link className="text-gray-700 hover:text-gray-900 font-medium transition-colors" to="/">Recipes</Link>
              </li>
              <li>
                <Link className="text-gray-700 hover:text-gray-900 font-medium transition-colors" to="/shopping-list">Shopping List</Link>
              </li>
              <li>
                <Link className="text-gray-700 hover:text-gray-900 font-medium transition-colors" to="/backup">Backup</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      
      <main role="main" className="flex-grow">
        <Routes>
          <Route path="/" element={<RecipeList />} />
          <Route path="/recipes/create" element={<RecipeForm />} />
          <Route path="/recipes/edit/:id" element={<RecipeForm />} />
          <Route path="/recipes/:id" element={<RecipeDetails />} />
          <Route path="/shopping-list" element={<ShoppingList />} />
          <Route path="/backup" element={<Backup />} />
        </Routes>
      </main>
      
      <footer className="border-t border-gray-200 bg-gray-50 mt-auto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-500">&copy; 2025 - RecipeTracker</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
