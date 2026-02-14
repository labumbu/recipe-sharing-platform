'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import type { RecipeInsert } from '@/types/database';

interface RecipeFormProps {
  initialData?: Partial<RecipeInsert & { id?: string }>;
  isEditing?: boolean;
}

export function RecipeForm({ initialData, isEditing = false }: RecipeFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || '');
  const [ingredients, setIngredients] = useState(initialData?.ingredients || '');
  const [instructions, setInstructions] = useState(initialData?.instructions || '');
  const [cooking, setCooking] = useState(initialData?.cooking || '');
  const [difficulty, setDifficulty] = useState(initialData?.difficulty || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const url = isEditing && initialData?.id 
        ? `/api/recipes/${initialData.id}`
        : '/api/recipes';
      
      const method = isEditing ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          ingredients: ingredients.trim(),
          instructions: instructions.trim(),
          cooking: cooking.trim() || null,
          difficulty: difficulty.trim() || null,
          category: category.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || `Failed to ${isEditing ? 'update' : 'create'} recipe`);
        setLoading(false);
        return;
      }

      // Redirect to recipe detail page or dashboard
      if (isEditing) {
        router.push(`/recipes/${data.recipe.id}`);
      } else {
        router.push('/dashboard');
      }
      router.refresh();
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Recipe Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={200}
          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 transition-colors"
          placeholder="e.g., Classic Chocolate Chip Cookies"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 transition-colors"
          >
            <option value="">Select category</option>
            <option value="Appetizers">Appetizers</option>
            <option value="Main Courses">Main Courses</option>
            <option value="Desserts">Desserts</option>
            <option value="Beverages">Beverages</option>
            <option value="Salads">Salads</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Snacks">Snacks</option>
          </select>
        </div>

        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Difficulty
          </label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 transition-colors"
          >
            <option value="">Select difficulty</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <div>
          <label htmlFor="cooking" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Cooking Time
          </label>
          <input
            id="cooking"
            type="text"
            value={cooking}
            onChange={(e) => setCooking(e.target.value)}
            maxLength={50}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 transition-colors"
            placeholder="e.g., 30 minutes"
          />
        </div>
      </div>

      <div>
        <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Ingredients <span className="text-red-500">*</span>
        </label>
        <textarea
          id="ingredients"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          required
          rows={6}
          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 resize-none transition-colors"
          placeholder="List all ingredients, one per line or separated by commas..."
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
          List all ingredients needed for this recipe
        </p>
      </div>

      <div>
        <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Instructions <span className="text-red-500">*</span>
        </label>
        <textarea
          id="instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          required
          rows={10}
          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 resize-none transition-colors"
          placeholder="Step-by-step instructions for preparing the recipe..."
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
          Provide detailed step-by-step instructions
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-6 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
        >
          {loading && <LoadingSpinner size="sm" />}
          {loading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Recipe' : 'Create Recipe')}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          disabled={loading}
          className="px-6 py-2.5 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
