interface RecipeCardProps {
  id: number;
  title: string;
  description: string;
  category: string;
}

export function RecipeCard({ id, title, description, category }: RecipeCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-200 dark:border-gray-700">
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
        <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {title}
        </h4>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
          {description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
            {category}
          </span>
          <button className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 text-sm font-medium">
            View Recipe →
          </button>
        </div>
      </div>
    </div>
  );
}
