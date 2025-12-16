import { Recipe } from './types';

const API_BASE = '/api/recipes';
const SHORTLIST_BASE = '/api/shortlist';

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

export const shortlistService = {
  async getShortlistedIds(): Promise<string[]> {
    const response = await fetch(`${SHORTLIST_BASE}/ids`);
    if (!response.ok) throw new Error('Failed to fetch shortlist');
    return response.json();
  },

  async getShortlistedRecipes(): Promise<Recipe[]> {
    const response = await fetch(`${SHORTLIST_BASE}/recipes`);
    if (!response.ok) throw new Error('Failed to fetch shortlisted recipes');
    return response.json();
  },

  async addToShortlist(recipeId: string): Promise<void> {
    const response = await fetch(`${SHORTLIST_BASE}/add/${recipeId}`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to add to shortlist');
  },

  async removeFromShortlist(recipeId: string): Promise<void> {
    const response = await fetch(`${SHORTLIST_BASE}/remove/${recipeId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to remove from shortlist');
  },

  async getShoppingList(): Promise<Record<string, Array<{ name: string; quantity: string; unit: string }>>> {
    const response = await fetch(`${SHORTLIST_BASE}/shopping-list`);
    if (!response.ok) throw new Error('Failed to fetch shopping list');
    return response.json();
  },
};

