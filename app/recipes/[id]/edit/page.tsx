import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import { RecipeForm } from '@/components/recipes/RecipeForm';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

interface EditRecipePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditRecipePage({ params }: EditRecipePageProps) {
  const { id } = await params;
  const supabase = await createClient();
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/');
  }

  // Fetch recipe
  const { data: recipe, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !recipe) {
    notFound();
  }

  // Check if user owns the recipe
  if (recipe.user_id !== user.id) {
    redirect(`/recipes/${id}`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-800 flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Edit Recipe
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Update your recipe information
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <RecipeForm 
              initialData={{
                id: recipe.id,
                title: recipe.title,
                ingredients: recipe.ingredients,
                instructions: recipe.instructions,
                cooking: recipe.cooking,
                difficulty: recipe.difficulty,
                category: recipe.category,
              }}
              isEditing={true}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
