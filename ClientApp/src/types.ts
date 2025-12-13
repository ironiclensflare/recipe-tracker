export interface Recipe {
  id?: string;
  name: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  youtubeUrl?: string;
}

export interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
}
