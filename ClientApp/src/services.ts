import { Recipe } from './types';

const API_BASE = '/api/recipes';

export const recipeService = {
  async getAll(): Promise<Recipe[]> {
    const response = await fetch(API_BASE);
    if (!response.ok) throw new Error('Failed to fetch recipes');
    return response.json();
  },

  async getById(id: string): Promise<Recipe> {
    const response = await fetch(`${API_BASE}/${id}`);
    if (!response.ok) throw new Error('Failed to fetch recipe');
    return response.json();
  },

  async create(recipe: Recipe): Promise<Recipe> {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recipe),
    });
    if (!response.ok) throw new Error('Failed to create recipe');
    return response.json();
  },

  async update(id: string, recipe: Recipe): Promise<void> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recipe),
    });
    if (!response.ok) throw new Error('Failed to update recipe');
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete recipe');
  },
};
