import { RecipeCard } from "@/components/RecipeCard";

export function FeaturedRecipes() {
  const placeholderRecipes = [
    { id: 1, title: "Recipe Title 1", description: "A delicious recipe description that will make your mouth water...", category: "Main Course" },
    { id: 2, title: "Recipe Title 2", description: "A delicious recipe description that will make your mouth water...", category: "Dessert" },
    { id: 3, title: "Recipe Title 3", description: "A delicious recipe description that will make your mouth water...", category: "Appetizer" },
    { id: 4, title: "Recipe Title 4", description: "A delicious recipe description that will make your mouth water...", category: "Main Course" },
    { id: 5, title: "Recipe Title 5", description: "A delicious recipe description that will make your mouth water...", category: "Salad" },
    { id: 6, title: "Recipe Title 6", description: "A delicious recipe description that will make your mouth water...", category: "Beverage" },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Featured Recipes
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {placeholderRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} {...recipe} />
        ))}
      </div>
    </section>
  );
}
