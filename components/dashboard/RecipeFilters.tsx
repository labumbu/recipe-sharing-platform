'use client';

interface RecipeFiltersProps {
  selectedDifficulty: string;
  selectedCategory: string;
  onDifficultyChange: (difficulty: string) => void;
  onCategoryChange: (category: string) => void;
}

export function RecipeFilters({
  selectedDifficulty,
  selectedCategory,
  onDifficultyChange,
  onCategoryChange,
}: RecipeFiltersProps) {
  const difficulties = ['Easy', 'Medium', 'Hard'];
  const categories = [
    'Appetizers',
    'Main Courses',
    'Desserts',
    'Beverages',
    'Salads',
    'Breakfast',
    'Snacks',
  ];

  const clearFilters = () => {
    onDifficultyChange('');
    onCategoryChange('');
  };

  const hasActiveFilters = selectedDifficulty || selectedCategory;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Difficulty Filter */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Difficulty
          </label>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => onDifficultyChange('')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                !selectedDifficulty
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              All
            </button>
            {difficulties.map((difficulty) => (
              <button
                key={difficulty}
                onClick={() => onDifficultyChange(difficulty)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedDifficulty === difficulty
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {difficulty}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 transition-colors"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <div>
          <button
            onClick={clearFilters}
            className="text-sm text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors flex items-center gap-1"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
