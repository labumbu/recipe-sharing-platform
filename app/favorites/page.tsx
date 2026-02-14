import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { RecipeList } from '@/components/dashboard/RecipeList';
import type { Recipe, Profile } from '@/types/database';

interface FavoriteWithRecipe {
  id: string;
  recipe_id: string;
  user_id: string;
  created_at: string;
  recipe: Recipe;
  profile: Profile | null;
}

export default async function FavoritesPage() {
  const supabase = await createClient();
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/');
  }

  // Get user's favorites with recipes
  const { data: favorites, error } = await supabase
    .from('favorites')
    .select(`
      *,
      recipe:recipes(*)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching favorites:', error);
  }

  // Get profiles for recipe authors
  let recipesWithProfiles = [];
  if (favorites && favorites.length > 0) {
    const userIds = [...new Set(favorites.map(f => f.recipe?.user_id).filter(Boolean))];
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .in('id', userIds);

    recipesWithProfiles = favorites
      .filter(f => f.recipe) // Filter out any null recipes
      .map(favorite => ({
        ...favorite.recipe,
        profile: profiles?.find(p => p.id === favorite.recipe?.user_id) || null,
      }));
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-800 flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              My Favorites
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Your saved recipes
            </p>
          </div>

          {error ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
              <p className="text-red-700 dark:text-red-300">
                Error loading favorites: {error.message}
              </p>
            </div>
          ) : recipesWithProfiles.length === 0 ? (
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
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No favorites yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Start exploring recipes and add them to your favorites!
                </p>
                <a
                  href="/dashboard"
                  className="inline-block px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
                >
                  Browse Recipes
                </a>
              </div>
            </div>
          ) : (
            <RecipeList recipes={recipesWithProfiles} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
