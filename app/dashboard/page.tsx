import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { RecipeListWithSearch } from '@/components/dashboard/RecipeListWithSearch';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default async function DashboardPage() {
  const supabase = await createClient();
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/');
  }

  // Fetch recipes from all users
  const { data: recipes, error: recipesError } = await supabase
    .from('recipes')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  // Fetch profiles for the recipes
  let recipesWithProfiles = [];
  if (recipes && recipes.length > 0) {
    const userIds = [...new Set(recipes.map(r => r.user_id))];
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .in('id', userIds);

    recipesWithProfiles = recipes.map(recipe => ({
      ...recipe,
      profile: profiles?.find(p => p.id === recipe.user_id) || null,
    }));
  }

  const error = recipesError;

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-800 flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Discover recipes shared by our community
            </p>
          </div>

          {error ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
              <p className="text-red-700 dark:text-red-300">
                Error loading recipes: {error.message}
              </p>
            </div>
          ) : (
            <RecipeListWithSearch recipes={recipesWithProfiles} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
