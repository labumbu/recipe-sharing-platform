import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { RecipeDetail } from '@/components/recipes/RecipeDetail';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

interface RecipePageProps {
  params: Promise<{ id: string }>;
}

export default async function RecipePage({ params }: RecipePageProps) {
  const { id } = await params;
  const supabase = await createClient();
  
  // Get current user (if authenticated)
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch recipe
  const { data: recipe, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !recipe) {
    notFound();
  }

  // Fetch recipe author profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', recipe.user_id)
    .single();

  const isOwner = user?.id === recipe.user_id;

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-800 flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <RecipeDetail 
            recipe={recipe} 
            profile={profile}
            isOwner={isOwner}
            currentUserId={user?.id || null}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
