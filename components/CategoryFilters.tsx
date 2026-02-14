interface CategoryFiltersProps {
  selectedCategory?: string;
}

export function CategoryFilters({ selectedCategory = "All" }: CategoryFiltersProps) {
  const categories = ["All", "Appetizers", "Main Courses", "Desserts", "Beverages", "Salads"];

  return (
    <div className="flex flex-wrap justify-center gap-3 mb-12">
      {categories.map((category) => (
        <button
          key={category}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            category === selectedCategory
              ? "bg-orange-600 text-white"
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-400"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
