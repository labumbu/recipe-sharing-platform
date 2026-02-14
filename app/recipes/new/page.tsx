import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { RecipeForm } from '@/components/recipes/RecipeForm';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default async function NewRecipePage() {
  const supabase = await createClient();
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-800 flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Create New Recipe
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Share your favorite recipe with the community
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <RecipeForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
