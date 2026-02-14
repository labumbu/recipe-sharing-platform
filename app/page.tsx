import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SignInForm } from "@/components/auth/SignInForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function Home() {
  const supabase = await createClient();
  
  // Redirect authenticated users to dashboard
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-800 flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome to <span className="text-orange-600 dark:text-orange-400">RecipeShare</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Share and discover delicious recipes from home cooks around the world
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Sign In Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Sign In
              </h2>
              <SignInForm />
            </div>

            {/* Sign Up Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Create Account
              </h2>
              <SignUpForm />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
