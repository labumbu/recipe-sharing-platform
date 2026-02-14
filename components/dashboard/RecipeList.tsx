import Link from 'next/link';
import type { Recipe, Profile } from '@/types/database';

interface RecipeWithProfile extends Recipe {
  profile: Profile | null;
}

interface RecipeListProps {
  recipes: RecipeWithProfile[];
}

export function RecipeList({ recipes }: RecipeListProps) {
  if (recipes.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center border border-gray-200 dark:border-gray-700">
        <div className="max-w-md mx-auto">
          <svg
            className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No recipes yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Be the first to share a recipe with the community!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <div
          key={recipe.id}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-200 dark:border-gray-700"
        >
          <div className="h-48 bg-gradient-to-br from-orange-200 to-orange-300 dark:from-orange-900 dark:to-orange-800 flex items-center justify-center">
            <svg
              className="w-16 h-16 text-orange-600 dark:text-orange-400 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <div className="p-5">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
              {recipe.title}
            </h3>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                by {recipe.profile?.user_name || 'Unknown'}
              </span>
              {recipe.category && (
                <span className="text-xs text-gray-500 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                  {recipe.category}
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
              {recipe.difficulty && (
                <span>Difficulty: {recipe.difficulty}</span>
              )}
              {recipe.cooking && (
                <span>Cooking: {recipe.cooking}</span>
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
              {recipe.ingredients.substring(0, 100)}...
            </p>
            <Link
              href={`/recipes/${recipe.id}`}
              className="block w-full text-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
            >
              View Recipe
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
