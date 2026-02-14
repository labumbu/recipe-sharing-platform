import { SearchBar } from "@/components/SearchBar";
import { CategoryFilters } from "@/components/CategoryFilters";

export function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
      <div className="text-center">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4">
          Discover & Share
          <span className="text-orange-600 dark:text-orange-400"> Delicious Recipes</span>
        </h2>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
          Join our community of home cooks and food lovers. Share your favorite recipes and discover new culinary adventures.
        </p>
      </div>
      <SearchBar />
      <CategoryFilters />
    </section>
  );
}
